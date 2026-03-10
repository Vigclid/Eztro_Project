import { INotification } from "../../features/notification/types";
import { apiService } from "../../service/apiService";

const notificationUrl = "v1/notifications";

export interface PaginatedNotificationResult {
  data: INotification[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface PaginatedNotificationResponse {
  data: PaginatedNotificationResult;
}

export const getNotificationApi = {
  async getMyNotification(cursor?: string): Promise<PaginatedNotificationResult> {
    try {
      const url = cursor
        ? `${notificationUrl}/me?cursor=${cursor}`
        : `${notificationUrl}/me`;
      const response = await apiService.get<PaginatedNotificationResponse>(url);
      return response.data?.data ?? { data: [], nextCursor: null, hasMore: false };
    } catch (error) {
      return { data: [], nextCursor: null, hasMore: false };
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
