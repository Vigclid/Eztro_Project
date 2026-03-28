import { GenericService } from "../../core/services/base.service";
import logModel, { ILog } from "./log.model";

export class logService extends GenericService<ILog> {
  constructor() {
    super(logModel);
  }

  createLog = async (data: Partial<ILog>) => {
    return logModel.create(data);
  };

  getLogs = async (filters?: any) => {
    const query: any = {};

    if (filters?.startDate || filters?.endDate) {
      query.timestamp = {};
      if (filters.startDate) {
        query.timestamp.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        query.timestamp.$lte = endDate;
      }
    }

    if (filters?.method) {
      query["meta.method"] = filters.method;
    }

    if (filters?.status) {
      query["meta.status"] = parseInt(filters.status);
    }

    if (filters?.ip) {
      query["meta.ip"] = filters.ip;
    }

    if (filters?.url) {
      query["meta.url"] = { $regex: filters.url, $options: "i" };
    }

    if (filters?.minDuration || filters?.maxDuration) {
      query["meta.response_time"] = {};
      if (filters.minDuration) {
        query["meta.response_time"].$gte = parseInt(filters.minDuration);
      }
      if (filters.maxDuration) {
        query["meta.response_time"].$lte = parseInt(filters.maxDuration);
      }
    }

    return logModel.find(query).sort({ timestamp: -1 }).exec();
  };

  getLogById = async (id: string) => {
    return logModel.findById(id).exec();
  };

  deleteOldLogs = async (days: number = 30) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return logModel.deleteMany({ timestamp: { $lt: date } }).exec();
  };
}
