import { apiService } from "../../service/apiService";
import { IUser } from "../../types/users";
import * as FileSystem from "expo-file-system/legacy";
import { ApiResponse } from "../../types/app.common";
const userApi = "v1/users";

export const getUserApi = {
  async getUser(id: number) {
    try {
      const response = await apiService.get(`${userApi}/${id}`);
      return response.data;
    } catch (error) {}
  },

  async getAllUsers() {
    try {
      const response = await apiService.get(`${userApi}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return { data: { data: [] } };
    }
  },

  async createUser(userData: any) {
    try {
      const response = (await apiService.post(
        userApi,
        userData,
      )) as ApiResponse<IUser>;
      return response.data;
    } catch (error: any) {
      console.error("createUser error:", error);
      throw error;
    }
  },

  async checkEmailExist(email: string) {
    try {
      const response = await apiService.get(`${userApi}/exist/${email}`);
      return response?.data?.data?.exists ?? false;
    } catch (error: any) {
      console.error("checkEmailExist error:", error);
      return false;
    }
  },

  async resetPassword(email: string, password: string) {
    try {
      const res = await apiService.post(`${userApi}/me/password/reset`, {
        email,
        password,
      });
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Reset failed");
    }
  },

  updateProfile: async (data: any) => {
    const res = await apiService.put(`${userApi}/me/profile`, data);
    return res.data;
  },

  changePassword: async (
    oldPassword: string,
    password: string,
  ): Promise<void> => {
    const res = await apiService.put<any>(`${userApi}/me/password`, {
      oldPassword,
      password,
    });

    if (res.data?.status === "error") {
      throw new Error(res.data.message || "Đổi mật khẩu thất bại");
    }

    if (!res.status) {
      throw new Error(res.message || "Lỗi mạng");
    }
  },

  uploadAvatar: async (avatarUri: string): Promise<IUser> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(avatarUri, {
        encoding: "base64",
      });

      const base64String = `data:image/jpeg;base64,${base64}`;

      const res = await apiService.put<any>(`${userApi}/me/avatar`, {
        avatar: base64String,
      });

      if (!res.status || res.error) {
        throw new Error(
          res.error?.message || res.message || "Upload avatar thất bại",
        );
      }

      if (!res.data?.data) {
        throw new Error("Không nhận được dữ liệu người dùng");
      }

      return res.data.data as IUser;
    } catch (err: any) {
      throw err;
    }
  },
};
