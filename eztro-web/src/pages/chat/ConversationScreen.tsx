import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { ConversationItem } from "../../components/chat/ConversationItem";
import { useChat } from "../../hooks/useChat";

export const ConversationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { conversations, loading, loadConversations, conversationCursor, isConnected } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    // Lấy current user ID từ localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUserId(userData.id || userData._id);
    }

    // Load conversations
    loadConversations();
  }, [loadConversations]);

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants.find(
      (p) => p.userId !== currentUserId
    );
    if (!otherParticipant) return false;

    const fullName = `${otherParticipant.firstName} ${otherParticipant.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleLoadMore = () => {
    if (conversationCursor && !loading) {
      loadConversations(conversationCursor);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-500 text-white p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="hover:bg-teal-600 p-1 rounded">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Tin nhắn cá nhân</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm text-center">
          Đang kết nối lại...
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">
              {searchQuery ? "Không tìm thấy cuộc trò chuyện" : "Chưa có cuộc trò chuyện nào"}
            </div>
          </div>
        ) : (
          <>
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                currentUserId={currentUserId}
                onClick={() => navigate(`/chat/${conversation._id}`)}
              />
            ))}

            {/* Load More Button */}
            {conversationCursor && (
              <div className="p-4 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="text-teal-500 hover:text-teal-600 disabled:text-gray-400"
                >
                  {loading ? "Đang tải..." : "Tải thêm"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
