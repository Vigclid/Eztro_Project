import React from "react";
import { IMessage } from "../../types/chat";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: IMessage;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const formatTime = (date: Date) => {
    return format(new Date(date), "HH:mm");
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? "bg-teal-500 text-white rounded-br-none"
              : "bg-gray-200 text-gray-900 rounded-bl-none"
          }`}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-2">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};
