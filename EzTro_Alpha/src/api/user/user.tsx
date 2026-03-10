import * as FileSystem from "expo-file-system/legacy";
import { apiService } from "../../service/apiService";
import { IUser } from "../../types/users";
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
      return { data: { data: [] } };
    }
  },

  async checkEmailExist(email: string) {
    try {
      const response: any = await apiService.get(`${userApi}/exist/${email}`);
      return response.data.data as ApiResponse<boolean>;
    } catch (error: any) {
      return false;
    }
  },
};

export const postUserApi = {
  async createUser(userData: any) {
    try {
      const response = await apiService.post(userApi, userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },
};

export const putUserApi = {
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
  updateProfile: async (data: any) => {
    const res = await apiService.put(`${userApi}/me/profile`, data);
    return res.data;
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
};
