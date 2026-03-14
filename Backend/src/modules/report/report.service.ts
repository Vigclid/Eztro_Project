import { GenericService } from "../../core/services/base.service";
import ReportModel, { IReport, ReportType, ReportStatus } from "./report.model";

export class ReportService extends GenericService<IReport> {
  constructor() {
    super(ReportModel);
  }

  async createReport(
    userId: string,
    data: { typeReport: ReportType; title: string; description: string }
  ) {
    return ReportModel.create({ userId, ...data, status: "Pending", replies: [] });
  }

  async getReportsByUser(userId: string) {
    return ReportModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getReportById(reportId: string) {
    return ReportModel.findById(reportId).populate("userId", "fullName email").populate("replies.senderId", "fullName email");
  }

  async getAllReports() {
    return ReportModel.find().populate("userId", "fullName email").sort({ createdAt: -1 });
  }

  async addReply(reportId: string, senderId: string, message: string) {
    return ReportModel.findByIdAndUpdate(
      reportId,
      {
        $push: { replies: { senderId, message, createdAt: new Date() } },
        $set: { status: "InProgress" },
      },
      { new: true }
    ).populate("userId", "fullName email").populate("replies.senderId", "fullName email");
  }

  async updateStatus(reportId: string, status: ReportStatus) {
    return ReportModel.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );
  }
}
