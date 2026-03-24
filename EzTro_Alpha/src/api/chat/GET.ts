import { apiService } from "../../service/apiService";
import {
  ConversationsResponse,
  MessagesResponse,
  IConversation,
} from "../../types/chats";

const chatApi = "v1/chat";

/**
 * Chat API endpoints for fetching conversations and messages
 */
export const getChatApi = {
  /**
   * Get paginated conversations for current user
   * @param cursor - Optional cursor for pagination (from previous response)
   * @param limit - Optional limit for number of conversations (default 25)
   * @returns Promise with conversations and nextCursor for pagination
   */
  getConversations: async (
    cursor?: string,
    limit: number = 25,
  ): Promise<ConversationsResponse> => {
    try {
      const params: Record<string, any> = { limit };
      if (cursor) {
        params.cursor = cursor;
      }

      const response = await apiService.get<any>(
        `${chatApi}/conversations`,
        params,
      );
      // Backend returns: { status, message, data: { conversations, nextCursor } }
      if (response.status && response.data && response.data.data) {
        return response.data.data;
      }

      // Handle error response
      return {
        conversations: [],
        nextCursor: null,
      };
    } catch (error) {
      return {
        conversations: [],
        nextCursor: null,
      };
    }
  },

  /**
   * Get paginated messages in a conversation
   * @param conversationId - ID of the conversation
   * @param cursor - Optional cursor for pagination (from previous response)
   * @param limit - Optional limit for number of messages (default 25)
   * @returns Promise with messages and nextCursor for pagination
   */
  getMessages: async (
    conversationId: string,
    cursor?: string,
    limit: number = 25,
  ): Promise<MessagesResponse> => {
    try {
      const params: Record<string, any> = { limit };
      if (cursor) {
        params.cursor = cursor;
      }

      const response = await apiService.get<any>(
        `${chatApi}/conversations/${conversationId}/messages`,
        params,
      );
      // Backend returns: { status, message, data: { messages, nextCursor } }
      if (response.status && response.data && response.data.data) {
        return response.data.data;
      }

      // Handle error response
      return {
        messages: [],
        nextCursor: null,
      };
    } catch (error) {
      return {
        messages: [],
        nextCursor: null,
      };
    }
  },

  /**
   * Check if conversation exists with specific user
   * @param userId - ID of the other user
   * @returns Promise with conversation if exists, null otherwise
   */
  getConversationWithUser: async (
    userId: string,
  ): Promise<{ conversation: IConversation | null }> => {
    try {
      const response = await apiService.get<any>(
        `${chatApi}/conversations/user/${userId}`,
      );
      // Backend returns: { status, message, data: { conversation } }
      if (response.status && response.data && response.data.data) {
        return response.data.data;
      }

      // Handle error response
      return {
        conversation: null,
      };
    } catch (error) {
      return {
        conversation: null,
      };
    }
  },
};
