import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MessageBubble } from "../../components/chat/MessageBubble";
import { ChatInput } from "../../components/chat/ChatInput";
import { useChat } from "../../hooks/useChat";
import { getConversations } from "../../api/chatAPI/GET";

export const MessageScreen: React.FC = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, loading, loadMessages, sendMessage, markAsSeen, messageCursor } = useChat();
  const [currentUserId, setCurrentUserId] = useState("");
  const [otherUser, setOtherUser] = useState<{ name: string; avatar?: string } | null>(null);

  useEffect(() => {
    // Lấy current user ID
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUserId(userData.id || userData._id);
    }

    // Load conversation details
    if (conversationId) {
      loadConversationDetails();
      loadMessages(conversationId);
      markAsSeen(conversationId);
    }
  }, [conversationId]);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversationDetails = async () => {
    try {
      const response = await getConversations();
      if (response.status && response.data) {
        const conversation = response.data.conversations.find(
          (c) => c._id === conversationId
        );
        if (conversation) {
          const other = conversation.participants.find(
            (p) => p.userId !== currentUserId
          );
          if (other) {
            setOtherUser({
              name: `${other.firstName} ${other.lastName}`,
              avatar: other.profilePicture,
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to load conversation details:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (content: string) => {
    if (!conversationId) return;
    
    // Get other user ID from conversation
    const otherUserId = messages[0]?.senderId === currentUserId 
      ? messages.find(m => m.senderId !== currentUserId)?.senderId
      : messages[0]?.senderId;

    if (otherUserId) {
      sendMessage(otherUserId, content);
    }
  };

  const handleLoadMore = () => {
    if (conversationId && messageCursor && !loading) {
      loadMessages(conversationId, messageCursor);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
      : name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-teal-500 text-white p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="hover:bg-teal-600 p-1 rounded">
          <ArrowLeft size={24} />
        </button>
        
        {otherUser && (
          <div className="flex items-center gap-2">
            {otherUser.avatar ? (
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white text-teal-500 flex items-center justify-center font-semibold">
                {getInitials(otherUser.name)}
              </div>
            )}
            <h1 className="text-lg font-semibold">{otherUser.name}</h1>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Load More Button */}
        {messageCursor && (
          <div className="text-center mb-4">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="text-teal-500 hover:text-teal-600 text-sm disabled:text-gray-400"
            >
              {loading ? "Đang tải..." : "Tải tin nhắn cũ hơn"}
            </button>
          </div>
        )}

        {messages.length === 0 && !loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Chưa có tin nhắn nào</div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
};
