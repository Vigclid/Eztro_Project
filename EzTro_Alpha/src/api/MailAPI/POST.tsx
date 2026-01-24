import { apiService } from "../../service/apiService";
import { ApiResponse } from "../../types/app.common";

const mailV1Url = `v1/mail/`;

export const MailPostAPI = () => {
  const sendMail = async (
    email: string,
  ): Promise<ApiResponse<{ token: string }>> => {
    try {
      // apiService.post returns: { status: boolean, data: <backend response>, error, ... }
      const response = await apiService.post<any>(`${mailV1Url}token`, {
        email,
      });
      const backendPayload = response?.data;
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
  };

  return { sendMail };
};
