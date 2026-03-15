export interface ReportUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface Reply {
  senderId: ReportUser;
  message: string;
  createdAt: string;
}

export type ReportType = 'Help' | 'Bug' | 'Advice';
export type ReportStatus = 'Pending' | 'InProgress' | 'Resolved' | 'Closed';

export interface Report {
  _id: string;
  userId: ReportUser;
  typeReport: ReportType;
  title: string;
  description: string;
  status: ReportStatus;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}
