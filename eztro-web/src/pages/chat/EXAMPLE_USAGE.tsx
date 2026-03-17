// Example: Cách sử dụng Chat System trong ứng dụng

import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ConversationScreen } from "./ConversationScreen";
import { MessageScreen } from "./MessageScreen";

// Example 1: Thêm vào routes
export const ChatRoutes = () => {
  return (
    <Routes>
      <Route path="/chat" element={<ConversationScreen />} />
      <Route path="/chat/:conversationId" element={<MessageScreen />} />
    </Routes>
  );
};

// Example 2: Link đến chat từ component khác
export const UserProfile = ({ userId }: { userId: string }) => {
  return (
    <div>
      <h2>User Profile</h2>
      <Link to={`/chat?userId=${userId}`}>
        <button className="bg-teal-500 text-white px-4 py-2 rounded">
          Nhắn tin
        </button>
      </Link>
    </div>
  );
};

// Example 3: Sử dụng useChat hook trực tiếp
import { useChat } from "../../hooks/useChat";

export const CustomChatComponent = () => {
  const { 
    conversations, 
    sendMessage, 
    isConnected 
  } = useChat();

  const handleSendQuickMessage = () => {
    sendMessage("USER_ID_HERE", "Hello!");
  };

  return (
    <div>
      <p>Connected: {isConnected ? "Yes" : "No"}</p>
      <p>Conversations: {conversations.length}</p>
      <button onClick={handleSendQuickMessage}>
        Send Quick Message
      </button>
    </div>
  );
};

// Example 4: Sử dụng Socket.IO hook trực tiếp
import { useSocket } from "../../hooks/useSocket";
import { useEffect } from "react";

export const SocketExample = () => {
  const socket = useSocket();

  useEffect(() => {
    // Lắng nghe tin nhắn mới
    const cleanup = socket.onReceiveMessage((data) => {
      console.log("New message:", data);
      // Hiển thị notification
      // Update UI
    });

    return cleanup;
  }, [socket]);

  return (
    <div>
      <p>Socket Status: {socket.isConnected ? "Connected" : "Disconnected"}</p>
    </div>
  );
};

// Example 5: Tích hợp với notification system
export const NotificationIntegration = () => {
  const socket = useSocket();

  useEffect(() => {
    const cleanup = socket.onReceiveMessage((data) => {
      // Hiển thị browser notification
      if (Notification.permission === "granted") {
        new Notification("Tin nhắn mới", {
          body: data.content,
          icon: "/chat-icon.png",
        });
      }

      // Hoặc hiển thị toast notification
      // toast.success(`Tin nhắn mới từ ${data.senderId}`);
    });

    return cleanup;
  }, [socket]);

  return null;
};

// Example 6: Chat button trong header
export const HeaderWithChat = () => {
  const { conversations } = useChat();
  const unreadCount = 0; // TODO: Implement unread count logic

  return (
    <header className="flex items-center justify-between p-4">
      <h1>Eztro</h1>
      <Link to="/chat" className="relative">
        <button className="p-2 rounded-full hover:bg-gray-100">
          💬
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </Link>
    </header>
  );
};
