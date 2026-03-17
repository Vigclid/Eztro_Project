import React from "react";
import { IConversation } from "../../types/chat";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ConversationItemProps {
  conversation: IConversation;
  currentUserId: string;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  currentUserId,
  onClick,
}) => {
  // Lấy thông tin người chat (không phải current user)
  const otherParticipant = conversation.participants.find(
    (p) => p.userId !== currentUserId
  );

  if (!otherParticipant) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: false, 
      locale: vi 
    });
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {otherParticipant.profilePicture ? (
          <img
            src={otherParticipant.profilePicture}
            alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-teal-300 flex items-center justify-center text-white font-semibold">
            {getInitials(otherParticipant.firstName, otherParticipant.lastName)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold text-gray-900 truncate">
            {otherParticipant.firstName} {otherParticipant.lastName}
          </h3>
          <span className="text-xs text-gray-500 ml-2">
            {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate mt-1">
          {conversation.lastMessage?.content || "Chưa có tin nhắn"}
        </p>
      </div>

      {/* Unread badge (optional - cần thêm logic đếm unread) */}
      {/* <div className="flex-shrink-0">
        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          2
        </span>
      </div> */}
    </div>
  );
};
