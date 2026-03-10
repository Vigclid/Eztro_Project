import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Misc } from "../constants/misc";
import environments from "../environments/env";
import { logoutAsync, setAccessToken } from "../features/auth/authSlice";
import { store } from "../stores/store";

// TYPE DEFINITION

interface ApiError {
  message: string;
  status: number | null;
  config: InternalAxiosRequestConfig | null;
  response: any;
}

interface ApiResponse<T = any> {
  status: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp?: string;
  message?: string;
}

class ApiResponseWrapper<T> implements ApiResponse<T> {
  constructor(
    public status: boolean,
    public data: T | null,
    public error: ApiError | null = null,
    public timestamp?: string,
    public message?: string,
  ) {}

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponseWrapper(true, data);
  }

  static error(error: ApiError): ApiResponse<never> {
    return new ApiResponseWrapper(false, null, error);
  }
}

// AXIOS INSTANCE

const { ERROR_MESSAGE, HTTP_STATUS_CODE, NUMBER } = Misc();

const apiClient: AxiosInstance = axios.create({
  baseURL: `${environments.SERVER_URI}`,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// TOKEN ATTACH

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = store.getState().auth?.accessToken; // lấy từ Redux
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error),
);

// REFRESH TOKEN LOGIC (Must be registered BEFORE error handler)

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null | undefined = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Register refresh token interceptor FIRST
apiClient.interceptors.response.use(
  (res: any) => res,
  async (err: any) => {
    const originalRequest = err.config;
    if (!originalRequest) return Promise.reject(err);

    const status = err.response?.status;
    const shouldRetry = status === 401 || status === 403;

    if (shouldRetry && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest._retry = true;
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token - need to get token from response data structure
        const refreshRes = await apiClient.post(
          "/refresh",
          {},
          { withCredentials: true },
        );

        // Handle different response structures
        // Backend returns: { accessToken: "..." } directly (no wrapper)
        let newToken: string | null = null;

        if (refreshRes.status === 200) {
          // Backend refresh endpoint returns: { accessToken: "..." }
          // But handleResponse may wrap it, so check both
          const responseData = refreshRes.data;
          newToken =
            responseData?.accessToken || responseData?.data?.accessToken;

          if (!newToken) {
            processQueue(new Error("Refresh failed: No token"), null);
            isRefreshing = false;
            store.dispatch(logoutAsync());
            return Promise.reject(err);
          }

          store.dispatch(setAccessToken(newToken));
          apiClient.defaults.headers.common["Authorization"] =
            "Bearer " + newToken;
          processQueue(null, newToken);
          isRefreshing = false;

          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return apiClient(originalRequest);
        } else {
          processQueue(new Error("Refresh failed"), null);
          isRefreshing = false;
          store.dispatch(logoutAsync());
          return Promise.reject(err);
        }
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        isRefreshing = false;
        store.dispatch(logoutAsync());
        return Promise.reject(refreshError);
      }
    }

    // If not a retry case, pass error to next interceptor
    return Promise.reject(err);
  },
);

// ERROR HANDLER (Registered AFTER refresh token handler)

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<ApiResponse<never>> => {
    const { status } = error.response || {};

    if (!error || status === undefined || status === NUMBER.ZERO) {
      return Promise.reject(
        ApiResponseWrapper.error({
          message: ERROR_MESSAGE.NETWORK_ERROR,
          status: null,
          config: error.config!,
          response: error.response,
        }),
      );
    }

    if (status >= HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR) {
      return Promise.reject(
        ApiResponseWrapper.error({
          message: ERROR_MESSAGE.SERVER_ERROR,
          status,
          config: error.config!,
          response: error.response,
        }),
      );
    }

    if (status === HTTP_STATUS_CODE.BAD_REQUEST) {
      return Promise.reject(
        ApiResponseWrapper.error({
          message: ERROR_MESSAGE.CLIENT_ERROR,
          status,
          config: error.config!,
          response: error.response,
        }),
      );
    }

    // 403 and 401 are handled by refresh token interceptor above
    // But if refresh failed, we handle it here
    if (status === HTTP_STATUS_CODE.FORBIDDEN) {
      return Promise.reject(
        ApiResponseWrapper.error({
          message: ERROR_MESSAGE.FORBIDDEN,
          status,
          config: error.config!,
          response: error.response,
        }),
      );
    }

    if (status === HTTP_STATUS_CODE.UNAUTHORIZED) {
      return Promise.reject(
        ApiResponseWrapper.error({
          message: ERROR_MESSAGE.INVALID_SESSION,
          status,
          config: error.config!,
          response: error.response,
        }),
      );
    }

    return Promise.reject(
      ApiResponseWrapper.error({
        message: ERROR_MESSAGE.ERROR,
        status,
        config: error.config!,
        response: error.response,
      }),
    );
  },
);

// HANDLE RESPONSE

const handleResponse = (response: AxiosResponse): ApiResponse<any> => {
  const { data } = response;

  if (data instanceof Blob) {
    return ApiResponseWrapper.success(window.URL.createObjectURL(data));
  }

  if (["boolean", "number", "string"].includes(typeof data)) {
    return ApiResponseWrapper.success(data);
  }

  if (Array.isArray(data)) {
    return ApiResponseWrapper.success(data || []);
  }

  if (typeof data === "object") {
    return ApiResponseWrapper.success(data);
  }

  return ApiResponseWrapper.error({
    message: ERROR_MESSAGE.ERROR,
    status: null,
    config: null,
    response,
  });
};

// API SERVICE METHODS

export const apiService = {
  async get<T>(
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<T>(endpoint, { params });
      return handleResponse(response);
    } catch (error: any) {
      return error;
    }
  },

  async post<T>(
    endpoint: string,
    data: Record<string, any> = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<T>(endpoint, data);
      return handleResponse(response);
    } catch (error: any) {
      return error;
    }
  },

  async patch<T>(
    endpoint: string,
    data: Record<string, any> = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<T>(endpoint, data);
      return handleResponse(response);
    } catch (error: any) {
      return error;
    }
  },

  async put<T>(
    endpoint: string,
    data: Record<string, any> = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<T>(endpoint, data);
      return handleResponse(response);
    } catch (error: any) {
      return error;
    }
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<T>(endpoint);
      return handleResponse(response);
    } catch (error: any) {
      return error;
    }
  },
};
