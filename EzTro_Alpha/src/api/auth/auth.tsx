import { apiService } from "../../service/apiService";
import { ApiResponse } from "../../types/app.common";

const authApi = "v1/auth";

export interface IFacebookUserInfo {
  id: string;
  name: string;
  email: string;
  picture: {
    data: {
      url: string;
    };
  };
}

export interface IGoogleUserInfo {
  email: string;
  family_name: string;
  given_name: string;
  picture: string;
}

export const getAuthApi = {
  async loginWithGoogle(ggAccount: IGoogleUserInfo): Promise<ApiResponse<any>> {
    try {
      const response = await apiService.post(`${authApi}/google`, { ggAccount });
      return response.data as ApiResponse<any>;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiResponse<any>;
      }
      return {
        status: "error",
        message: error.message || "Đăng nhập Google thất bại",
      } as ApiResponse<any>;
    }
  },

  async loginWithFacebook(fbAccount: IFacebookUserInfo): Promise<ApiResponse<any>> {
    try {
      const response = await apiService.post(`${authApi}/facebook`, { fbAccount });
      return response.data as ApiResponse<any>;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiResponse<any>;
      }
      return {
        status: "error",
        message: error.message || "Đăng nhập Facebook thất bại",
      } as ApiResponse<any>;
    }
  },
};
