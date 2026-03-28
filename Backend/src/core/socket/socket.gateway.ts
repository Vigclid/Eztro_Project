import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { SocketRooms } from "./socket.rooms";
import { initChatSocketHandlers } from "../../modules/chat/chat.socket";

let io: SocketServer;

export function initSocketGateway(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      (socket as any).userId = decoded.id;
      (socket as any).houseId = decoded.houseId;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId as string;
    
    socket.join(SocketRooms.user(userId));

    // Handle joining report room
    socket.on("join:report", (data: { reportId: string }) => {
      socket.join(`report:${data.reportId}`);
    });

    // Handle leaving report room
    socket.on("leave:report", (data: { reportId: string }) => {
      socket.leave(`report:${data.reportId}`);
    });

    // Handle joining ticket room
    socket.on("join:ticket", (data: { ticketId: string }) => {
      socket.join(`ticket:${data.ticketId}`);
    });

    // Handle leaving ticket room
    socket.on("leave:ticket", (data: { ticketId: string }) => {
      socket.leave(`ticket:${data.ticketId}`);
    });

    socket.on("disconnect", () => {
    });
  });

  // Initialize chat socket handlers
  initChatSocketHandlers(io);

  return io;
}

export function emitToUser(userId: string, event: string, data: unknown) {
  io?.to(SocketRooms.user(userId)).emit(event, data);
}

export function emitToAll(event: string, data: unknown) {
  io?.emit(event, data);
}

export function emitToRoom(roomName: string, event: string, data: unknown) {
  io?.to(roomName).emit(event, data);
}

export function getIO(): SocketServer {
  if (!io) throw new Error("Socket.IO chưa được khởi tạo. Gọi initSocketGateway() trước.");
  return io;
}
