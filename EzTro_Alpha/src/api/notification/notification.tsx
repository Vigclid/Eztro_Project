import { INotification } from "../../features/notification/types";
import { apiService } from "../../service/apiService";

const notificationUrl = "v1/notifications";

interface NotificationListResponse {
  data: INotification[];
}

export const getNotificationApi = {
  async getMyNotification(): Promise<INotification[]> {
    try {
      const response = await apiService.get<NotificationListResponse>(
        `${notificationUrl}/me`,
      );
      return response.data?.data ?? [];
    } catch (error) {
      return [];
    }
  },
};

export const postNotificationApi = {
  async markAsRead(id: string) {
    const response = await apiService.post(
      `${notificationUrl}/me/as-read/${id}`,
    );
    return response.data;
  },
  async markAsReadAll() {
    const response = await apiService.post(`${notificationUrl}/me/as-read`);
    return response.data;
  },
};
