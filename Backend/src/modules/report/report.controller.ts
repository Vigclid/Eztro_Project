/// <reference path="../../interfaces/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import { ReportService } from "./report.service";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { ReportType, ReportStatus } from "./report.model";

const VALID_TYPES: ReportType[] = ["Help", "Bug", "Advice"];
const VALID_STATUSES: ReportStatus[] = ["Pending", "InProgress", "Resolved", "Closed"];

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { typeReport, title, description } = req.body;

      if (!typeReport || !title || !description) {
        res.status(400).json(responseWrapper("error", "typeReport, title và description là bắt buộc"));
        return;
      }

      if (!VALID_TYPES.includes(typeReport)) {
        res.status(400).json(responseWrapper("error", "typeReport phải là Help, Bug hoặc Advice"));
        return;
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

  getMyReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const reports = await this.reportService.getReportsByUser(userId.toString());
      res.json(responseWrapper("success", "Lấy danh sách báo cáo thành công", reports));
    } catch (error) {
      next(error);
    }
  };

  getReportById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const report = await this.reportService.getReportById(id);

      if (!report) {
        res.status(404).json(responseWrapper("error", "Không tìm thấy báo cáo"));
        return;
      }

      res.json(responseWrapper("success", "Lấy chi tiết báo cáo thành công", report));
    } catch (error) {
      next(error);
    }
  };

  getAllReports = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const reports = await this.reportService.getAllReports();
      res.json(responseWrapper("success", "Lấy tất cả báo cáo thành công", reports));
    } catch (error) {
      next(error);
    }
  };

  addReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const senderId = req.user!.id;
      const { id } = req.params;
      const { message } = req.body;

      if (!message) {
        res.status(400).json(responseWrapper("error", "Message là bắt buộc"));
        return;
      }

      const report = await this.reportService.addReply(id, senderId.toString(), message);

      if (!report) {
        res.status(404).json(responseWrapper("error", "Không tìm thấy báo cáo"));
        return;
      }

      res.json(responseWrapper("success", "Phản hồi thành công", report));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !VALID_STATUSES.includes(status)) {
        res.status(400).json(responseWrapper("error", "Status không hợp lệ"));
        return;
      }

      const report = await this.reportService.updateStatus(id, status);

      if (!report) {
        res.status(404).json(responseWrapper("error", "Không tìm thấy báo cáo"));
        return;
      }

      res.json(responseWrapper("success", "Cập nhật trạng thái thành công", report));
    } catch (error) {
      next(error);
    }
  };
}
