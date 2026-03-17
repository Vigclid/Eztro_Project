import { apiService } from '../../service/apiService';
import { ConversationsResponse, MessagesResponse, IConversation } from '../../types/chats';

const chatApi = 'v1/chat';

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
  getConversations: async (cursor?: string, limit: number = 25): Promise<ConversationsResponse> => {
    try {
      const params: Record<string, any> = { limit };
      if (cursor) {
        params.cursor = cursor;
      }

      const response = await apiService.get<ConversationsResponse>(
        `${chatApi}/conversations`,
        params
      );

      if (response.status && response.data) {
        return response.data;
      }

      // Handle error response
      console.error('Failed to fetch conversations:', response.error);
      return {
        conversations: [],
        nextCursor: null,
      };
    } catch (error) {
      console.error('Error fetching conversations:', error);
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
   * @param limit - Optional limit for number of messages (default 50)
   * @returns Promise with messages and nextCursor for pagination
   */
  getMessages: async (
    conversationId: string,
    cursor?: string,
    limit: number = 50
  ): Promise<MessagesResponse> => {
    try {
      const params: Record<string, any> = { limit };
      if (cursor) {
        params.cursor = cursor;
      }

      const response = await apiService.get<MessagesResponse>(
        `${chatApi}/conversations/${conversationId}/messages`,
        params
      );

      if (response.status && response.data) {
        return response.data;
      }

      // Handle error response
      console.error('Failed to fetch messages:', response.error);
      return {
        messages: [],
        nextCursor: null,
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
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
  getConversationWithUser: async (userId: string): Promise<{ conversation: IConversation | null }> => {
    try {
      const response = await apiService.get<{ conversation: IConversation | null }>(
        `${chatApi}/conversations/user/${userId}`
      );

      if (response.status && response.data) {
        return response.data;
      }

      // Handle error response
      console.error('Failed to fetch conversation with user:', response.error);
      return {
        conversation: null,
      };
    } catch (error) {
      console.error('Error fetching conversation with user:', error);
      return {
        conversation: null,
      };
    }
  },
};
