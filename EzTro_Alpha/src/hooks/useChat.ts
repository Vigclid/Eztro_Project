import { useCallback } from 'react';
import { useChat as useChatContext } from '../context/ChatContext';
import { IConversation, IMessage } from '../types/chats';

/**
 * Return type for useChat hook
 */
export interface UseChatReturn {
  conversations: IConversation[];
  messages: IMessage[];
  loading: boolean;
  conversationCursor: string | null;
  messageCursor: string | null;
  loadConversations(cursor?: string): Promise<void>;
  loadMessages(conversationId: string, cursor?: string): Promise<void>;
  sendMessage(to: string, content: string, imageBase64?: string): Promise<void>;
  markAsSeen(conversationId: string): void;
  sendTyping(conversationId: string, to: string): void;
  isConnected: boolean;
}

/**
 * useChat hook for chat state management
 * Provides access to conversations, messages, and chat actions
 * 
 * Usage:
 * ```typescript
 * const { conversations, messages, loadConversations, sendMessage } = useChat();
 * 
 * // Load conversations on mount
 * useEffect(() => {
 *   loadConversations();
 * }, [loadConversations]);
 * 
 * // Send a message
 * const handleSend = async (content: string) => {
 *   await sendMessage('userId', content);
 * };
 * ```
 */
export const useChat = (): UseChatReturn => {
  const context = useChatContext();

  /**
   * Load conversations with optional cursor for pagination
   * If cursor is provided, appends to existing conversations
   * Otherwise, replaces conversations list
   */
  const loadConversations = useCallback(
    async (cursor?: string) => {
      try {
        await context.loadConversations(cursor);
      } catch (error) {
        console.error('Failed to load conversations:', error);
        throw error;
      }
    },
    [context]
  );

  /**
   * Load messages for a specific conversation with optional cursor for pagination
   * If cursor is provided, appends to existing messages
   * Otherwise, replaces messages list
   */
  const loadMessages = useCallback(
    async (conversationId: string, cursor?: string) => {
      try {
        await context.loadMessages(conversationId, cursor);
      } catch (error) {
        console.error('Failed to load messages:', error);
        throw error;
      }
    },
    [context]
  );

  /**
   * Send a message to another user
   * Creates conversation if it doesn't exist
   * Validates message content before sending
   */
  const sendMessage = useCallback(
    async (to: string, content: string, imageBase64?: string) => {
      try {
        // Validate message content
        if (!content.trim() && !imageBase64) {
          throw new Error('Message content cannot be empty');
        }

        if (content.length > 5000) {
          throw new Error('Message content exceeds 5000 character limit');
        }

        await context.sendMessage(to, content, imageBase64);
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    },
    [context]
  );

  /**
   * Mark messages in a conversation as seen
   * Sends event to backend via Socket.IO
   */
  const markAsSeen = useCallback(
    (conversationId: string) => {
      try {
        context.markAsSeen(conversationId);
      } catch (error) {
        console.error('Failed to mark messages as seen:', error);
      }
    },
    [context]
  );

  /**
   * Send typing indicator to other user
   * Notifies backend that current user is typing
   */
  const sendTyping = useCallback(
    (conversationId: string, to: string) => {
      try {
        context.sendTyping(conversationId, to);
      } catch (error) {
        console.error('Failed to send typing indicator:', error);
      }
    },
    [context]
  );

  return {
    conversations: context.conversations,
    messages: context.messages,
    loading: context.loading,
    conversationCursor: context.conversationCursor,
    messageCursor: context.messageCursor,
    loadConversations,
    loadMessages,
    sendMessage,
    markAsSeen,
    sendTyping,
    isConnected: context.isConnected,
  };
};
