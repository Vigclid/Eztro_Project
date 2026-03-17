import React, { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t bg-white p-4 flex items-center gap-2"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
        disabled={disabled}
        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        <Send size={20} />
      </button>
    </form>
  );
};
