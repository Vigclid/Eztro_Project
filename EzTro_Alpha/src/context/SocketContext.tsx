import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { getNotificationApi } from "../api/notification/notification";
import environments from "../environments/env";
import {
  addNotification,
  setNotifications,
} from "../features/notification/notificationSlice";
import { AppDispatch, RootState } from "../stores/store";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!user || !accessToken) return;

    const socket = io(environments.SERVER_URI as string, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", async () => {
      setIsConnected(true);
      const result = await getNotificationApi.getMyNotification();
      dispatch(setNotifications(result));
    });
    socket.on("disconnect", () => setIsConnected(false));

    // ───Cái này đang Lắng nghe notification từ backend, anh em thử như này ───────────────────────────
    // Backend emit: io.to(`user:${userId}`).emit("notification", data)
    socket.on("notification", (data) => {
      dispatch(addNotification(data));
    });

    // Thêm event mới ở đây khi có module khác nhé anh em:
    // socket.on("chat:message", (data) => dispatch(addChatMessage(data)));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, accessToken, dispatch]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
