import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { RootState } from "../stores/store";
import environments from "../environments/env";

interface SocketContextType {
  socket: any | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (!user) return;

    const sock = new SockJS(`${process.env.SERVER_URI}ws`);

    sock.onopen = () => {
      sock.send(JSON.stringify({ type: "INIT", userId: user._id }));
      setIsConnected(true);
    };
    sock.onmessage = (e) => {};

    sock.onclose = () => {
      setIsConnected(false);
    };

    sock.onerror = (e) => {};

    setSocket(sock);

    return () => {
      sock.close();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
