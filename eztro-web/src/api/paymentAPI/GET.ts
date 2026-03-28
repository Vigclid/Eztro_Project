import { apiService } from "../../service/apiService";
import { ApiResponse } from "../../types/common";

const housePackageUrl = "/v1/housePackages";

interface BackendResponse {
  status: string;
  message: string;
  data: any;
  error_log?: any;
  timestamp?: string;
}

export const paymentGetAPI = {
  getAllHousePackages: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get(`${housePackageUrl}/all`);
      const backendPayload = response?.data as BackendResponse;
      return {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },

  getRevenueByMonth: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get(`${housePackageUrl}/revenue/monthly`);
      const backendPayload = response?.data as BackendResponse;
      return {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },

  getRevenueByDay: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get(`${housePackageUrl}/revenue/daily`);
      const backendPayload = response?.data as BackendResponse;
      return {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },

  getTotalRevenue: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get(`${housePackageUrl}/revenue/total`);
      const backendPayload = response?.data as BackendResponse;
      return {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },
};
