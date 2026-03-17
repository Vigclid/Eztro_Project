import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores/store";
import { useSocket } from "./SocketContext";
import { IConversation, IMessage } from "../types/chats";

/**
 * ChatContextType defines the shape of the chat context
 * Includes state for conversations and messages, plus action methods
 */
export interface ChatContextType {
  // State
  conversations: IConversation[];
  messages: IMessage[];
  loading: boolean;
  isConnected: boolean;
  conversationCursor: string | null;
  messageCursor: string | null;

  // Actions
  loadConversations(cursor?: string): Promise<void>;
  loadMessages(conversationId: string, cursor?: string): Promise<void>;
  sendMessage(to: string, content: string): Promise<void>;
  markAsSeen(conversationId: string): void;
  sendTyping(conversationId: string, to: string): void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/**
 * ChatProvider component that manages chat state and Socket.IO integration
 * Provides all chat functionality through context
 */
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const { user } = useSelector((state: RootState) => state.auth);

  // State management
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationCursor, setConversationCursor] = useState<string | null>(null);
  const [messageCursor, setMessageCursor] = useState<string | null>(null);

  /**
   * Load conversations with cursor-based pagination
   * Appends to existing conversations if cursor is provided
   */
  const loadConversations = useCallback(
    async (cursor?: string) => {
      if (!user) return;

      setLoading(true);
      try {
        // TODO: Replace with actual API call when available
        // const response = await chatApi.getConversations(cursor);
        // if (cursor) {
        //   setConversations(prev => [...prev, ...response.conversations]);
        // } else {
        //   setConversations(response.conversations);
        // }
        // setConversationCursor(response.nextCursor);
        void cursor; // Use cursor parameter
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /**
   * Load messages for a specific conversation with cursor-based pagination
   * Appends to existing messages if cursor is provided
   */
  const loadMessages = useCallback(
    async (conversationId: string, cursor?: string) => {
      if (!user) return;

      setLoading(true);
      try {
        // TODO: Replace with actual API call when available
        // const response = await chatApi.getMessages(conversationId, cursor);
        // if (cursor) {
        //   setMessages(prev => [...prev, ...response.messages]);
        // } else {
        //   setMessages(response.messages);
        // }
        // setMessageCursor(response.nextCursor);
        void conversationId; // Use conversationId parameter
        void cursor; // Use cursor parameter
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /**
   * Send a message via Socket.IO
   * Creates conversation if it doesn't exist
   */
  const sendMessage = useCallback(
    async (to: string, content: string) => {
      if (!socket || !isConnected || !user) {
        console.error("Socket not connected or user not authenticated");
        return;
      }

      try {
        // Validate message content
        if (!content.trim()) {
          console.warn("Cannot send empty message");
          return;
        }

        if (content.length > 5000) {
          console.warn("Message exceeds 5000 character limit");
          return;
        }

        // Emit message via Socket.IO
        socket.emit("send_message", {
          to,
          content: content.trim(),
          type: "text",
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [socket, isConnected, user]
  );

  /**
   * Mark messages in a conversation as seen
   * Sends event to backend via Socket.IO
   */
  const markAsSeen = useCallback(
    (conversationId: string) => {
      if (!socket || !isConnected || !user) {
        console.error("Socket not connected or user not authenticated");
        return;
      }

      try {
        socket.emit("message_seen", {
          conversationId,
          userId: user._id,
        });

        // Update local message state to mark as read
        setMessages((prev) =>
          prev.map((msg) =>
            msg.conversationId === conversationId && msg.senderId !== user._id
              ? { ...msg, status: "read" as const }
              : msg
          )
        );
      } catch (error) {
        console.error("Failed to mark messages as seen:", error);
      }
    },
    [socket, isConnected, user]
  );

  /**
   * Send typing indicator to other user
   * Notifies backend that current user is typing
   */
  const sendTyping = useCallback(
    (conversationId: string, to: string) => {
      if (!socket || !isConnected || !user) {
        console.error("Socket not connected or user not authenticated");
        return;
      }

      try {
        socket.emit("typing", {
          conversationId,
          to,
          userId: user._id,
        });
      } catch (error) {
        console.error("Failed to send typing indicator:", error);
      }
    },
    [socket, isConnected, user]
  );

  /**
   * Set up Socket.IO event listeners for real-time updates
   */
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for incoming messages
    const handleReceiveMessage = (data: IMessage) => {
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some((msg) => msg._id === data._id)) {
          return prev;
        }
        return [...prev, data];
      });

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === data.conversationId
            ? {
                ...conv,
                lastMessage: {
                  messageId: data._id,
                  content: data.content,
                  senderId: data.senderId,
                  createdAt: data.createdAt,
                },
                updatedAt: data.createdAt,
              }
            : conv
        )
      );
    };

    // Listen for message sent confirmation
    const handleMessageSent = (data: { messageId: string; conversationId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, status: "delivered" as const } : msg
        )
      );
    };

    // Listen for message read status
    const handleMessageRead = (data: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, status: "read" as const } : msg
        )
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);
    socket.on("message_read", handleMessageRead);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("message_read", handleMessageRead);
    };
  }, [socket, isConnected]);

  const value: ChatContextType = {
    conversations,
    messages,
    loading,
    isConnected,
    conversationCursor,
    messageCursor,
    loadConversations,
    loadMessages,
    sendMessage,
    markAsSeen,
    sendTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

/**
 * Hook to use the ChatContext
 * Must be used within ChatProvider
 */
export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return ctx;
};
