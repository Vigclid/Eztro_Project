import { Request, Response, NextFunction } from "express";
import { GenericController } from "../../core/controllers/base.controller";
import { notificationService } from "./notification.service";
import { INotification } from "./notification.model";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";
import { notificationRequest } from "./notificationMetadata";
export class notificationController extends GenericController<INotification> {
  private NotificationService: notificationService;

  constructor(notificationService: notificationService) {
    super(notificationService);
    this.NotificationService = notificationService;
  }

  getByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { id } = jwt.decode(token) as { id: string };
      const cursor = req.query.cursor as string | undefined;
      const result = await this.NotificationService.getByUserId(id, cursor);
      res.json(responseWrapper("success", "Lấy danh sách thành công", result));
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.NotificationService.markAsRead(id);
      if (!result) {
        return res.status(404).json(responseWrapper("error", "Không tìm thấy notification"));
      }
      res.json(responseWrapper("success", "Đã đọc", result));
    } catch (error) {
      next(error);
    }
  };

  markAsReadAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { id } = jwt.decode(token) as { id: string };
      const result = await this.NotificationService.markAsReadAll(id);
      res.json(responseWrapper("success", "Đã đọc tất cả", result));
    } catch (error) {
      next(error);
    }
  };

  createNotificaition = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: notificationRequest = req.body;
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { id } = jwt.decode(token) as { id: string };
      await this.NotificationService.send({ ...body, triggeredBy: id });
      return res.status(200).json(responseWrapper("error", "Unknown kind"));
    } catch (error) {
      next(error);
    }
  };
}
