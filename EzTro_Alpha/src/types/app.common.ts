export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  error_log?: any;
  timestamp: string;
}

export const responseWrapper = <T>(
  status: "success" | "error",
  message: string,
  data?: T,
  error_log?: any
): ApiResponse<T> => {
  return {
    status,
    message,
    data,
    error_log,
    timestamp: new Date().toISOString(),
  };
};
