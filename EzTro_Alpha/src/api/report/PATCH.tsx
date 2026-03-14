import { apiService } from "../../service/apiService";

const reportApi = "v1/reports";

export type ReportStatus = "Pending" | "InProgress" | "Resolved" | "Closed";

export interface UpdateStatusPayload {
  status: ReportStatus;
}

export const patchReportApi = {
  updateStatus: async (id: string, payload: UpdateStatusPayload) => {
    return await apiService.patch(`${reportApi}/${id}/status`, payload);
  },
};
