/// <reference path="../../interfaces/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import { TicketService } from "./ticket.service";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";

export class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  // Tạo ticket bởi tenant
  createByTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const decoded = jwt.decode(token) as { id: string; role: string };
      const { id } = decoded;
      
      const { title, description, categories } = req.body;

      if (!title || !description || !categories || categories.length === 0) {
        res.status(400).json(responseWrapper("error", "Title, description và categories là bắt buộc"));
        return;
      }

      const ticket = await this.ticketService.createTicketByTenant(id, {
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
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { id } = jwt.decode(token) as { id: string };
      
      const { title, description, categories, houseId, roomId } = req.body;

      if (!title || !description || !categories || !houseId || !roomId) {
        res.status(400).json(responseWrapper("error", "Title, description, categories, houseId và roomId là bắt buộc"));
        return;
      }

      const ticket = await this.ticketService.createTicketByLandlord(id, {
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
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { id } = jwt.decode(token) as { id: string };
      
      const tickets = await this.ticketService.getTicketsByLandlord(id);
      res.json(responseWrapper("success", "Lấy danh sách tickets thành công", tickets));
    } catch (error) {
      next(error);
    }
  };

  // Lấy tickets của tenant
  getByTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { id } = jwt.decode(token) as { id: string };
      
      const tickets = await this.ticketService.getTicketsByTenant(id);
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
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { id } = jwt.decode(token) as { id: string };
      
      const { ticketId } = req.params;
      const { content } = req.body;

      if (!content) {
        res.status(400).json(responseWrapper("error", "Content là bắt buộc"));
        return;
      }

      const ticket = await this.ticketService.addReply(ticketId, id, content);
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
      res.json(responseWrapper("success", "Cập nhật status thành công", ticket));
    } catch (error) {
      next(error);
    }
  };

  // Xóa ticket
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const decoded = jwt.decode(token) as { id: string; role: string };
      const currentUserId = decoded.id;
      
      // Get ticket first to check permissions
      const ticket = await this.ticketService.getById(req.params.id);
      if (!ticket) {
        res.status(404).json(responseWrapper("error", "Ticket không tồn tại"));
        return;
      }

      // Check if user can delete this ticket
      const canDelete = await this.canDeleteTicket(ticket, currentUserId);
      if (!canDelete) {
        res.status(403).json(responseWrapper("error", "Bạn không có quyền xóa ticket này"));
        return;
      }

      const result = await this.ticketService.delete(req.params.id);
      res.json(responseWrapper("success", "Xóa ticket thành công", result));
    } catch (error) {
      next(error);
    }
  };

  // Check if user can delete ticket
  private async canDeleteTicket(ticket: any, userId: string): Promise<boolean> {
    // User can delete their own ticket
    const senderId = typeof ticket.senderId === 'object' ? ticket.senderId._id : ticket.senderId;
    if (senderId.toString() === userId) {
      return true;
    }

    // Landlord can delete tickets in their houses
    const receiverId = typeof ticket.receiverId === 'object' ? ticket.receiverId._id : ticket.receiverId;
    if (receiverId.toString() === userId) {
      return true;
    }

    return false;
  }
}
