import { apiService } from "../../service/apiService";
import { IConversation } from "../../types/chats";

const chatApi = "v1/chat";

/**
 * Chat API endpoints for creating conversations
 */
export const postChatApi = {
  /**
   * Create conversation with specific user
   * @param userId - ID of the other user
   * @returns Promise with created conversation
   */
  createConversationWithUser: async (
    userId: string,
  ): Promise<{ conversation: IConversation | null }> => {
    try {
      const response = await apiService.post<any>(
        `${chatApi}/conversations/user/${userId}`,
        {},
      );
      // Backend returns: { status, message, data: { conversation } }
      if (response.status && response.data && response.data.data) {
        return response.data.data;
      }
      return {
        conversation: null,
      };
    } catch (error: any) {
      return {
        conversation: null,
      };
    }
  },
};
