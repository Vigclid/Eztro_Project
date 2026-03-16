export type ReportStatus = "Pending" | "InProgress" | "Resolved" | "Closed";
export type ReportType = "Help" | "Bug" | "Advice";

export interface IReportReply {
  senderId: string;
  message: string;
  createdAt: string;
}

export interface IReport {
  _id: string;
  userId: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roleName?: string;
  };
  typeReport: ReportType;
  title: string;
  description: string;
  status: ReportStatus;
  replies: IReportReply[];
  createdAt: string;
  updatedAt: string;
}

export interface IReportStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}
