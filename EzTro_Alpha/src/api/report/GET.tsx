import { apiService } from "../../service/apiService";


const reportApi = "v1/reports";

export const getReportApi = {
  getMyReports: async () => {
    return await apiService.get(`${reportApi}`);
  },
  
  getReportById: async (id: string) => {
    return await apiService.get(`${reportApi}/${id}`);
  },
  
  getAllReports: async () => {
    return await apiService.get(`${reportApi}/all`);
  },
};
