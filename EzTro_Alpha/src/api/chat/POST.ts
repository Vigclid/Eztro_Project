import { apiService } from '../../service/apiService';

const chatApi = 'v1/chat';

/**
 * Chat API endpoints for sending messages
 */
export const postChatApi = {
  /**
   * Send message (REST fallback if Socket.IO unavailable)
   * @param data - Message data containing recipient ID, content, and optional type
   * @returns Promise with message response including messageId, conversationId, content, type, createdAt
   * @throws Error if message content is empty or exceeds 5000 characters
   */
  sendMessage: async (data: {
    to: string;
    content: string;
    type?: 'text' | 'image' | 'file';
  }): Promise<{
    messageId: string;
    conversationId: string;
    content: string;
    type: string;
    createdAt: Date;
  }> => {
    try {
      // Validate message content
      const trimmedContent = data.content.trim();

      if (!trimmedContent) {
        console.error('Message content cannot be empty');
        throw new Error('Message content cannot be empty');
      }

      if (trimmedContent.length > 5000) {
        console.error('Message content exceeds maximum length of 5000 characters');
        throw new Error('Message content exceeds maximum length of 5000 characters');
      }

      // Prepare request payload
      const payload = {
        to: data.to,
        content: trimmedContent,
        type: data.type || 'text',
      };

      // Send message via REST API
      const response = await apiService.post<{
        messageId: string;
        conversationId: string;
        content: string;
        type: string;
        createdAt: Date;
      }>(`${chatApi}/messages`, payload);

      if (response.status && response.data) {
        return response.data;
      }

      // Handle error response
      console.error('Failed to send message:', response.error);
      throw new Error(response.error?.message || 'Failed to send message');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};
