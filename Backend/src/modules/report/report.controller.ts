import { Request, Response, NextFunction } from "express";
import { ReportService } from "./report.service";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { ReportType, ReportStatus } from "./report.model";

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string };
}

const VALID_TYPES: ReportType[] = ["Help", "Bug", "Advice"];
const VALID_STATUSES: ReportStatus[] = ["Pending", "InProgress", "Resolved", "Closed"];

export class ReportController {
  private reportService = new ReportService();

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json(responseWrapper("error", "Unauthorized"));

      const { typeReport, title, description } = req.body;

      if (!typeReport || !title || !description) {
        return res.status(400).json(responseWrapper("error", "typeReport, title và description là bắt buộc"));
      }

      if (!VALID_TYPES.includes(typeReport)) {
        return res.status(400).json(responseWrapper("error", "typeReport phải là Help, Bug hoặc Advice"));
      }

      const report = await this.reportService.createReport(userId.toString(), {
        typeReport,
        title,
        description,
      });

      res.status(201).json(responseWrapper("success", "Gửi báo cáo thành công", report));
    } catch (error) {
      next(error);
    }
  };

  getMyReports = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json(responseWrapper("error", "Unauthorized"));

      const reports = await this.reportService.getReportsByUser(userId.toString());
      res.json(responseWrapper("success", "Lấy danh sách báo cáo thành công", reports));
    } catch (error) {
      next(error);
    }
  };

  getReportById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const report = await this.reportService.getReportById(id);

      if (!report) {
        return res.status(404).json(responseWrapper("error", "Không tìm thấy báo cáo"));
      }

      res.json(responseWrapper("success", "Lấy chi tiết báo cáo thành công", report));
    } catch (error) {
      next(error);
    }
  };

  getAllReports = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const reports = await this.reportService.getAllReports();
      res.json(responseWrapper("success", "Lấy tất cả báo cáo thành công", reports));
    } catch (error) {
      next(error);
    }
  };

  addReply = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const senderId = req.user?.id;
      if (!senderId) return res.status(401).json(responseWrapper("error", "Unauthorized"));

      const { id } = req.params;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json(responseWrapper("error", "Message là bắt buộc"));
      }

      const report = await this.reportService.addReply(id, senderId.toString(), message);

      if (!report) {
        return res.status(404).json(responseWrapper("error", "Không tìm thấy báo cáo"));
      }

      res.json(responseWrapper("success", "Phản hồi thành công", report));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json(responseWrapper("error", "Status không hợp lệ"));
      }

      const report = await this.reportService.updateStatus(id, status);

      if (!report) {
        return res.status(404).json(responseWrapper("error", "Không tìm thấy báo cáo"));
      }

      res.json(responseWrapper("success", "Cập nhật trạng thái thành công", report));
    } catch (error) {
      next(error);
    }
  };
}
