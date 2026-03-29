import io from "socket.io-client";
import { API_URL } from "../config/env";
import { store } from "../stores/store";

class SocketService {
  private socket: ReturnType<typeof io> | null = null;

  connect(token?: string) {
    if (this.socket?.connected) return;

    // Get token from Redux if not provided
    const authToken = token || store.getState().auth.accessToken;
    
    if (!authToken) {
      return;
    }

    this.socket = io(API_URL, {
      auth: { token: authToken },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
    });

    this.socket.on("disconnect", () => {
    });

    this.socket.on("error", (_error: any) => {
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Report creation events
  onReportCreated(callback: (report: any) => void) {
    if (!this.socket) this.connect();
    this.socket?.on("report:created", callback);
  }

  offReportCreated() {
    this.socket?.off("report:created");
  }

  // Report update events
  onReportUpdated(callback: (report: any) => void) {
    if (!this.socket) this.connect();
    this.socket?.on("report:updated", callback);
  }

  offReportUpdated() {
    this.socket?.off("report:updated");
  }

  // Report reply events
  onReplyAdded(callback: (data: { reportId: string; reply: any; senderId?: string }) => void) {
    if (!this.socket) this.connect();
    this.socket?.on("report:reply-added", callback);
  }

  offReplyAdded() {
    this.socket?.off("report:reply-added");
  }

  // Report status change events
  onReportStatusChanged(callback: (data: { reportId: string; status: string }) => void) {
    if (!this.socket) this.connect();
    this.socket?.on("report:status-changed", callback);
  }

  offReportStatusChanged() {
    this.socket?.off("report:status-changed");
  }

  // Join/Leave report room
  joinReportRoom(reportId: string) {
    if (!this.socket) this.connect();
    this.socket?.emit("join:report", { reportId });
  }

  leaveReportRoom(reportId: string) {
    if (!this.socket) this.connect();
    this.socket?.emit("leave:report", { reportId });
  }

  // Ticket reply events
  onTicketReplyAdded(callback: (data: { ticketId: string; reply: any; senderId?: string }) => void) {
    if (!this.socket) this.connect();
    this.socket?.on("ticket:reply-added", callback);
  }

  offTicketReplyAdded() {
    this.socket?.off("ticket:reply-added");
  }

  // Ticket status change events
  onTicketStatusChanged(callback: (data: { ticketId: string; status: string }) => void) {
    if (!this.socket) this.connect();
    this.socket?.on("ticket:status-changed", callback);
  }

  offTicketStatusChanged() {
    this.socket?.off("ticket:status-changed");
  }

  // Join/Leave ticket room
  joinTicketRoom(ticketId: string) {
    if (!this.socket) this.connect();
    this.socket?.emit("join:ticket", { ticketId });
  }

  leaveTicketRoom(ticketId: string) {
    if (!this.socket) this.connect();
    this.socket?.emit("leave:ticket", { ticketId });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

const socketService = new SocketService();
export default socketService;
