import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores/store";
import { useSocket } from "./SocketContext";
import { IConversation, IMessage } from "../types/chats";
import { getChatApi } from "../api/chat/GET";

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
  sendMessage(to: string, content: string, imageUrl?: string): Promise<void>;
  markAsSeen(conversationId: string): void;
  sendTyping(conversationId: string, to: string): void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/**
 * ChatProvider component that manages chat state and Socket.IO integration
 * Provides all chat functionality through context
 */
export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { socket, isConnected } = useSocket();
  const { user } = useSelector((state: RootState) => state.auth);

  // State management
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [conversationCursor, setConversationCursor] = useState<string | null>(
    null,
  );
  const [messageCursor, setMessageCursor] = useState<string | null>(null);

  /**
   * Load conversations with cursor-based pagination
   * Appends to existing conversations if cursor is provided
   */
  const loadConversations = useCallback(
    async (cursor?: string) => {
      if (!user) {
        return;
      }
      setLoading(true);
      try {
        const response = await getChatApi.getConversations(cursor, 25);
        if (cursor) {
          // Append to existing conversations (load more)
          setConversations((prev) => [...prev, ...response.conversations]);
        } else {
          // Replace conversations (initial load or refresh)
          setConversations(response.conversations);
        }

        setConversationCursor(response.nextCursor);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  /**
   * Load messages for a specific conversation with cursor-based pagination
   * Appends to existing messages if cursor is provided
   * Clears messages if switching to different conversation
   */
  const loadMessages = useCallback(
    async (conversationId: string, cursor?: string) => {
      if (!user) {
        return;
      }
      // If switching to different conversation, clear messages
      if (conversationId !== currentConversationId) {
        setMessages([]);
        setMessageCursor(null);
        setCurrentConversationId(conversationId);
      }

      setLoading(true);
      try {
        const response = await getChatApi.getMessages(
          conversationId,
          cursor,
          50,
        );
        if (cursor) {
          // Prepend older messages (load more at top)
          setMessages((prev) => [...response.messages, ...prev]);
        } else {
          // Replace messages (initial load)
          setMessages(response.messages);
        }

        setMessageCursor(response.nextCursor);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, currentConversationId],
  );

  /**
   * Send a message via Socket.IO
   * Conversation must already exist
   */
  const sendMessage = useCallback(
    async (
      to: string,
      content: string,
      imageBase64?: string,
    ): Promise<void> => {
      if (!socket || !isConnected || !user) {
        return;
      }

      try {
        // Determine message type
        const type = imageBase64 ? "image" : "text";

        // Validate message content for text messages
        if (type === "text") {
          if (!content.trim()) {
            return;
          }

          if (content.length > 5000) {
            return;
          }
        }

        // Emit message via Socket.IO
        socket.emit("send_message", {
          to,
          content: content.trim(),
          type,
          imageBase64,
        });
      } catch (error) {
        throw error;
      }
    },
    [socket, isConnected, user],
  );

  /**
   * Mark messages in a conversation as seen
   * Sends event to backend via Socket.IO
   */
  const markAsSeen = useCallback(
    (conversationId: string) => {
      if (!socket || !isConnected || !user) {
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
              : msg,
          ),
        );

        // Reset unread count locally
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      } catch (error) {
      }
    },
    [socket, isConnected, user],
  );

  /**
   * Send typing indicator to other user
   * Notifies backend that current user is typing
   */
  const sendTyping = useCallback(
    (conversationId: string, to: string) => {
      if (!socket || !isConnected || !user) {
        return;
      }

      try {
        socket.emit("typing", {
          conversationId,
          to,
          userId: user._id,
        });
      } catch (error) {
      }
    },
    [socket, isConnected, user],
  );

  /**
   * Set up Socket.IO event listeners for real-time updates
   */
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for incoming messages
    const handleReceiveMessage = (data: IMessage) => {
      // If we don't have a currentConversationId yet, set it from the message
      if (!currentConversationId && data.conversationId) {
        setCurrentConversationId(data.conversationId);
      }

      // Add message if it belongs to current conversation OR if we don't have a conversation yet
      if (
        !currentConversationId ||
        data.conversationId === currentConversationId
      ) {
        setMessages((prev) => {
          // Prevent duplicate messages
          if (prev.some((msg) => msg._id === data._id)) {
            return prev;
          }
          return [...prev, data];
        });
      }
      // Always update conversation's last message
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
            : conv,
        ),
      );
    };

    // Listen for message sent confirmation
    const handleMessageSent = (data: {
      messageId: string;
      conversationId: string;
    }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, status: "delivered" as const }
            : msg,
        ),
      );
    };

    // Listen for message read status
    const handleMessageRead = (data: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, status: "read" as const }
            : msg,
        ),
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
  }, [socket, isConnected, currentConversationId]);

  /**
   * Listen for conversation updates (unread count changes)
   */
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleConversationUpdated = (data: { conversationId: string; unreadCount: number }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === data.conversationId
            ? { ...conv, unreadCount: data.unreadCount }
            : conv
        )
      );
    };

    socket.on("conversation_updated", handleConversationUpdated);

    return () => {
      socket.off("conversation_updated", handleConversationUpdated);
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
