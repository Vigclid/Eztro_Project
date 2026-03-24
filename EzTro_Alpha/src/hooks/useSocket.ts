import { useCallback } from 'react';
import { useSocket as useSocketContext } from '../context/SocketContext';
import { ReceiveMessagePayload } from '../types/chats';

/**
 * Return type for useSocket hook
 */
export interface UseSocketReturn {
  socket: any | null;
  isConnected: boolean;
  sendMessage(data: { to: string; content: string; type?: string }): void;
  onReceiveMessage(callback: (data: ReceiveMessagePayload) => void): () => void;
  onMessageSent(callback: (data: any) => void): () => void;
  markAsSeen(conversationId: string): void;
  sendTyping(conversationId: string, to: string): void;
  onUserTyping(callback: (data: { conversationId: string; userId: string }) => void): () => void;
}

/**
 * useSocket hook for Socket.IO integration
 * Provides methods for sending messages, receiving messages, and handling real-time events
 * 
 * Usage:
 * ```typescript
 * const { socket, isConnected, sendMessage, onReceiveMessage } = useSocket();
 * 
 * // Listen for incoming messages
 * useEffect(() => {
 *   const unsubscribe = onReceiveMessage((message) => {
 *     console.log('New message:', message);
 *   });
 *   return unsubscribe;
 * }, [onReceiveMessage]);
 * 
 * // Send a message
 * sendMessage({ to: 'userId', content: 'Hello!' });
 * ```
 */
export const useSocket = (): UseSocketReturn => {
  const { socket, isConnected } = useSocketContext();

  /**
   * Send a message via Socket.IO
   * Falls back to REST API if Socket.IO is unavailable
   */
  const sendMessage = useCallback(
    (data: { to: string; content: string; type?: string }) => {
      if (!socket || !isConnected) {
        console.warn('Socket not connected, message will not be sent via Socket.IO');
        return;
      }

      try {
        socket.emit('send_message', {
          to: data.to,
          content: data.content,
          type: data.type || 'text',
        });
      } catch (error) {
        console.error('Failed to send message via Socket.IO:', error);
      }
    },
    [socket, isConnected]
  );

  /**
   * Register a callback for receiving messages
   * Returns an unsubscribe function
   */
  const onReceiveMessage = useCallback(
    (callback: (data: ReceiveMessagePayload) => void): (() => void) => {
      if (!socket) {
        console.warn('Socket not available');
        return () => {};
      }

      socket.on('receive_message', callback);

      // Return unsubscribe function
      return () => {
        socket.off('receive_message', callback);
      };
    },
    [socket]
  );

  /**
   * Register a callback for message sent confirmation
   * Returns an unsubscribe function
   */
  const onMessageSent = useCallback(
    (callback: (data: any) => void): (() => void) => {
      if (!socket) {
        console.warn('Socket not available');
        return () => {};
      }

      socket.on('message_sent', callback);

      // Return unsubscribe function
      return () => {
        socket.off('message_sent', callback);
      };
    },
    [socket]
  );

  /**
   * Mark messages in a conversation as seen
   * Sends event to backend via Socket.IO
   */
  const markAsSeen = useCallback(
    (conversationId: string) => {
      if (!socket || !isConnected) {
        console.warn('Socket not connected, mark as seen will not be sent');
        return;
      }

      try {
        socket.emit('message_seen', {
          conversationId,
        });
      } catch (error) {
        console.error('Failed to mark messages as seen:', error);
      }
    },
    [socket, isConnected]
  );

  /**
   * Send typing indicator to other user
   * Notifies backend that current user is typing
   */
  const sendTyping = useCallback(
    (conversationId: string, to: string) => {
      if (!socket || !isConnected) {
        console.warn('Socket not connected, typing indicator will not be sent');
        return;
      }

      try {
        socket.emit('typing', {
          conversationId,
          to,
        });
      } catch (error) {
        console.error('Failed to send typing indicator:', error);
      }
    },
    [socket, isConnected]
  );

  /**
   * Register a callback for user typing indicator
   * Returns an unsubscribe function
   */
  const onUserTyping = useCallback(
    (callback: (data: { conversationId: string; userId: string }) => void): (() => void) => {
      if (!socket) {
        console.warn('Socket not available');
        return () => {};
      }

      socket.on('user_typing', callback);

      // Return unsubscribe function
      return () => {
        socket.off('user_typing', callback);
      };
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    sendMessage,
    onReceiveMessage,
    onMessageSent,
    markAsSeen,
    sendTyping,
    onUserTyping,
  };
};
