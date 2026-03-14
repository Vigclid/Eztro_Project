import { apiService } from "../../service/apiService";

const reportApi = "v1/reports";

export type ReportType = "Help" | "Bug" | "Advice";

export interface CreateReportPayload {
  typeReport: ReportType;
  title: string;
  description: string;
}

export interface AddReplyPayload {
  message: string;
}

export const postReportApi = {
  createReport: async (payload: CreateReportPayload) => {
    return await apiService.post(`${reportApi}`, payload);
  },
  
  addReply: async (id: string, payload: AddReplyPayload) => {
    return await apiService.post(`${reportApi}/${id}/reply`, payload);
  },
};
