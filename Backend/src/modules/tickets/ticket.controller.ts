/// <reference path="../../interfaces/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import { TicketService } from "./ticket.service";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { getIO } from "../../core/socket/socket.gateway";

export class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  // Tạo ticket bởi tenant
  createByTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      
      const { title, description, categories } = req.body;

      if (!title || !description || !categories || categories.length === 0) {
        res.status(400).json(responseWrapper("error", "Title, description và categories là bắt buộc"));
        return;
      }

      const ticket = await this.ticketService.createTicketByTenant(userId, {
        title,
        description,
        categories,
      });

      res.status(201).json(responseWrapper("success", "Tạo ticket thành công", ticket));
    } catch (error: any) {
      next(error);
    }
  };

  // Tạo ticket bởi landlord
  createByLandlord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      
      const { title, description, categories, houseId, roomId } = req.body;

      if (!title || !description || !categories || !houseId || !roomId) {
        res.status(400).json(responseWrapper("error", "Title, description, categories, houseId và roomId là bắt buộc"));
        return;
      }

      const ticket = await this.ticketService.createTicketByLandlord(userId, {
        title,
        description,
        categories,
        houseId,
        roomId,
      });

      res.status(201).json(responseWrapper("success", "Tạo ticket thành công", ticket));
    } catch (error: any) {
      next(error);
    }
  };

  // Lấy tất cả tickets (admin)
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets = await this.ticketService.getAllPopulated();
      res.json(responseWrapper("success", "Lấy danh sách tickets thành công", tickets));
    } catch (error) {
      next(error);
    }
  };

  // Lấy ticket theo ID
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await this.ticketService.getByIdPopulated(req.params.id);
      if (!ticket) {
        res.status(404).json(responseWrapper("error", "Ticket không tồn tại"));
        return;
      }
      res.json(responseWrapper("success", "Lấy ticket thành công", ticket));
    } catch (error) {
      next(error);
    }
  };

  // Lấy tickets của landlord
  getByLandlord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      
      const tickets = await this.ticketService.getTicketsByLandlord(userId);
      res.json(responseWrapper("success", "Lấy danh sách tickets thành công", tickets));
    } catch (error) {
      next(error);
    }
  };

  // Lấy tickets của tenant
  getByTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      
      const tickets = await this.ticketService.getTicketsByTenant(userId);
      res.json(responseWrapper("success", "Lấy danh sách tickets thành công", tickets));
    } catch (error) {
      next(error);
    }
  };

  // Lấy tickets theo house
  getByHouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { houseId } = req.params;
      const tickets = await this.ticketService.getTicketsByHouse(houseId);
      res.json(responseWrapper("success", "Lấy danh sách tickets thành công", tickets));
    } catch (error) {
      next(error);
    }
  };

  // Lấy tickets theo room
  getByRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomId } = req.params;
      const tickets = await this.ticketService.getTicketsByRoom(roomId);
      res.json(responseWrapper("success", "Lấy danh sách tickets thành công", tickets));
    } catch (error) {
      next(error);
    }
  };

  // Thêm reply vào ticket
  addReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const senderId = (req as any).user?.id;
      if (!senderId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      
      const { ticketId } = req.params;
      const { content } = req.body;

      if (!content) {
        res.status(400).json(responseWrapper("error", "Content là bắt buộc"));
        return;
      }

      const ticket = await this.ticketService.addReply(ticketId, senderId, content);
      
      // Get updated ticket with populated data
      const updatedTicket = await this.ticketService.getByIdPopulated(ticketId);
      const newReply = updatedTicket?.replies[updatedTicket.replies.length - 1];

      // Emit socket event to ticket room (exclude sender)
      const io = getIO();
      io.to(`ticket:${ticketId}`).emit("ticket:reply-added", {
        ticketId: ticketId,
        reply: newReply,
        senderId: senderId,
      });

      res.json(responseWrapper("success", "Thêm reply thành công", ticket));
    } catch (error) {
      next(error);
    }
  };

  // Cập nhật status của ticket
  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.params;
      const { status } = req.body;

      if (!status || !["pending", "processing", "completed"].includes(status)) {
        res.status(400).json(responseWrapper("error", "Status phải là pending, processing hoặc completed"));
        return;
      }

      const ticket = await this.ticketService.updateStatus(ticketId, status);
      
      // Emit socket event to ticket room
      const io = getIO();
      io.to(`ticket:${ticketId}`).emit("ticket:status-changed", {
        ticketId: ticketId,
        status: status,
      });

      res.json(responseWrapper("success", "Cập nhật status thành công", ticket));
    } catch (error) {
      next(error);
    }
  };

  // Xóa ticket
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { id: ticketId } = req.params;

      // Get ticket to check ownership
      const ticket = await this.ticketService.getById(ticketId);
      if (!ticket) {
        res.status(404).json(responseWrapper("error", "Ticket không tồn tại"));
        return;
      }

      // Check if user is the sender (creator) or receiver (landlord)
      const isSender = ticket.senderId.toString() === userId;
      const isReceiver = ticket.receiverId.toString() === userId;

      if (!isSender && !isReceiver) {
        res.status(403).json(responseWrapper("error", "Bạn không có quyền xóa ticket này"));
        return;
      }

      const result = await this.ticketService.delete(ticketId);
      res.json(responseWrapper("success", "Xóa ticket thành công", result));
    } catch (error: any) {
      next(error);
    }
  };

  // Mark replies as read
  markRepliesAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { ticketId } = req.params;

      const ticket = await this.ticketService.markRepliesAsRead(ticketId, userId);
      res.json(responseWrapper("success", "Đánh dấu đã đọc thành công", ticket));
    } catch (error: any) {
      next(error);
    }
  };
}
