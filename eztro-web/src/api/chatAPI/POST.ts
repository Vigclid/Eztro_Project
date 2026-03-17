import { apiService } from "../../service/apiService";
import { IMessage } from "../../types/chat";

/**
 * POST /chat/send
 * Gửi tin nhắn qua REST API (fallback nếu Socket.IO không khả dụng)
 */
export const sendMessage = async (data: {
  to: string;
  content: string;
  type?: "text" | "image" | "file";
}) => {
  return apiService.post<{
    messageId: string;
    conversationId: string;
    content: string;
    type: string;
    createdAt: Date;
  }>("/chat/send", data);
};
