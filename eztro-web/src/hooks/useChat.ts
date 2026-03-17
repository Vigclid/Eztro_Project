import { useState, useEffect, useCallback } from "react";
import { IConversation, IMessage } from "../types/chat";
import { getConversations, getMessages } from "../api/chatAPI/GET";
import { useSocket } from "./useSocket";

export const useChat = () => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationCursor, setConversationCursor] = useState<string | null>(null);
  const [messageCursor, setMessageCursor] = useState<string | null>(null);
  
  const socket = useSocket();

  // Load conversations
  const loadConversations = useCallback(async (cursor?: string) => {
    setLoading(true);
    try {
      const response = await getConversations(cursor);
      if (response.status && response.data) {
        if (cursor) {
          setConversations(prev => [...prev, ...response.data!.conversations]);
        } else {
          setConversations(response.data.conversations);
        }
        setConversationCursor(response.data.nextCursor);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages
  const loadMessages = useCallback(async (conversationId: string, cursor?: string) => {
    setLoading(true);
    try {
      const response = await getMessages(conversationId, cursor);
      if (response.status && response.data) {
        if (cursor) {
          setMessages(prev => [...response.data!.messages, ...prev]);
        } else {
          setMessages(response.data.messages);
        }
        setMessageCursor(response.data.nextCursor);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send message via Socket.IO
  const sendMessage = useCallback((to: string, content: string) => {
    try {
      socket.sendMessage({ to, content, type: "text" });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [socket]);

  // Listen for new messages
  useEffect(() => {
    const cleanup = socket.onReceiveMessage((data) => {
      // Add new message to list
      const newMessage: IMessage = {
        _id: data.messageId,
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
        type: data.type,
        status: "delivered",
        createdAt: data.createdAt,
      };
      setMessages(prev => [...prev, newMessage]);

      // Update conversation list
      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv._id === data.conversationId) {
            return {
              ...conv,
              lastMessage: {
                messageId: data.messageId,
                content: data.content,
                senderId: data.senderId,
                createdAt: data.createdAt,
              },
              updatedAt: data.createdAt,
            };
          }
          return conv;
        });
        // Sort by updatedAt
        return updated.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    });

    return cleanup;
  }, [socket]);

  return {
    conversations,
    messages,
    loading,
    conversationCursor,
    messageCursor,
    loadConversations,
    loadMessages,
    sendMessage,
    markAsSeen: socket.markAsSeen,
    sendTyping: socket.sendTyping,
    isConnected: socket.isConnected,
  };
};
