import { Request, Response, NextFunction } from "express";
import { TicketService } from "./ticket.service";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  // Tạo ticket bởi tenant
  createByTenant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      const { title, description, categories } = req.body;

      if (!title || !description || !categories || categories.length === 0) {
        return res
          .status(400)
          .json(responseWrapper("error", "Title, description và categories là bắt buộc"));
      }

      const ticket = await this.ticketService.createTicketByTenant(userId.toString(), {
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
  createByLandlord = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      const { title, description, categories, houseId, roomId } = req.body;

      if (!title || !description || !categories || !houseId || !roomId) {
        return res
          .status(400)
          .json(
            responseWrapper(
              "error",
              "Title, description, categories, houseId và roomId là bắt buộc"
            )
          );
      }

      const ticket = await this.ticketService.createTicketByLandlord(userId.toString(), {
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
        return res.status(404).json(responseWrapper("error", "Ticket không tồn tại"));
      }
      res.json(responseWrapper("success", "Lấy ticket thành công", ticket));
    } catch (error) {
      next(error);
    }
  };

  // Lấy tickets của landlord
  getByLandlord = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      const tickets = await this.ticketService.getTicketsByLandlord(userId.toString());
      res.json(responseWrapper("success", "Lấy danh sách tickets thành công", tickets));
    } catch (error) {
      next(error);
    }
  };

  // Lấy tickets của tenant
  getByTenant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      const tickets = await this.ticketService.getTicketsByTenant(userId.toString());
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
  addReply = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      const { ticketId } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json(responseWrapper("error", "Content là bắt buộc"));
      }

      const ticket = await this.ticketService.addReply(ticketId, userId.toString(), content);
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
        return res
          .status(400)
          .json(responseWrapper("error", "Status phải là pending, processing hoặc completed"));
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
      const result = await this.ticketService.delete(req.params.id);
      if (!result) {
        return res.status(404).json(responseWrapper("error", "Ticket không tồn tại"));
      }
      res.json(responseWrapper("success", "Xóa ticket thành công", result));
    } catch (error) {
      next(error);
    }
  };
}
