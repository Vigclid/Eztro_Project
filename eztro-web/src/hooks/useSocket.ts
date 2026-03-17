import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ReceiveMessagePayload } from "../types/chat";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      console.warn("No access token found");
      return;
    }

    // Khởi tạo Socket.IO connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketRef.current.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Gửi tin nhắn qua Socket.IO
  const sendMessage = (data: {
    to: string;
    content: string;
    type?: "text" | "image" | "file";
  }) => {
    if (!socketRef.current?.connected) {
      throw new Error("Socket not connected");
    }
    socketRef.current.emit("send_message", data);
  };

  // Lắng nghe tin nhắn mới
  const onReceiveMessage = (callback: (data: ReceiveMessagePayload) => void) => {
    socketRef.current?.on("receive_message", callback);
    return () => {
      socketRef.current?.off("receive_message", callback);
    };
  };

  // Lắng nghe xác nhận gửi tin nhắn
  const onMessageSent = (callback: (data: any) => void) => {
    socketRef.current?.on("message_sent", callback);
    return () => {
      socketRef.current?.off("message_sent", callback);
    };
  };

  // Đánh dấu đã xem tin nhắn
  const markAsSeen = (conversationId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("message_seen", { conversationId });
  };

  // Gửi typing indicator
  const sendTyping = (conversationId: string, to: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("typing", { conversationId, to });
  };

  // Lắng nghe typing indicator
  const onUserTyping = (callback: (data: { conversationId: string; userId: string }) => void) => {
    socketRef.current?.on("user_typing", callback);
    return () => {
      socketRef.current?.off("user_typing", callback);
    };
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    onReceiveMessage,
    onMessageSent,
    markAsSeen,
    sendTyping,
    onUserTyping,
  };
};
