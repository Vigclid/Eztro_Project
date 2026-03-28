import io, { Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

class SocketService {
  private socket: Socket | null = null;

  connect(token?: string) {
    if (this.socket?.connected) return;

    // Get token from localStorage if not provided
    const authToken = token || localStorage.getItem("accessToken");
    
    if (!authToken) {
      return;
    }

    this.socket = io(SOCKET_URL, {
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

    this.socket.on("error", (error) => {
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

export default new SocketService();
