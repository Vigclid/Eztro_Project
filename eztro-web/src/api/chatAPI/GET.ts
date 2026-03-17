import { apiService } from "../../service/apiService";
import { ConversationsResponse, MessagesResponse, IConversation } from "../../types/chat";

/**
 * GET /chat/conversations
 * Lấy danh sách conversations với pagination
 */
export const getConversations = async (cursor?: string, limit: number = 25) => {
  const params: Record<string, any> = { limit };
  if (cursor) params.cursor = cursor;
  
  return apiService.get<ConversationsResponse>("/chat/conversations", params);
};

/**
 * GET /chat/messages/:conversationId
 * Lấy danh sách messages trong conversation với pagination
 */
export const getMessages = async (
  conversationId: string,
  cursor?: string,
  limit: number = 50
) => {
  const params: Record<string, any> = { limit };
  if (cursor) params.cursor = cursor;
  
  return apiService.get<MessagesResponse>(
    `/chat/messages/${conversationId}`,
    params
  );
};

/**
 * GET /chat/conversation/:userId
 * Kiểm tra conversation với user cụ thể
 */
export const getConversationWithUser = async (userId: string) => {
  return apiService.get<{ conversation: IConversation | null }>(
    `/chat/conversation/${userId}`
  );
};
