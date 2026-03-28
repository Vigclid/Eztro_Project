import { ILog } from "./log.model";
import { GenericController } from "../../core/controllers/base.controller";
import { logService } from "./log.service";
import { Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class logController extends GenericController<ILog> {
  private LogService: logService;

  constructor(logService: logService) {
    super(logService);
    this.LogService = logService;
  }

  getLogs = async (req: Request, res: Response) => {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        method: req.query.method,
        status: req.query.status,
        ip: req.query.ip,
        url: req.query.url,
        minDuration: req.query.minDuration,
        maxDuration: req.query.maxDuration,
      };

      const logs = await this.LogService.getLogs(filters);
      return res.status(200).json(responseWrapper("success", "Fetched logs successfully", logs));
    } catch (error) {
      return res.status(500).json(responseWrapper("error", "Internal Server Error", error));
    }
  };

  getLogById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const log = await this.LogService.getLogById(id);

      if (!log) {
        return res.status(404).json(responseWrapper("error", "Log not found"));
      }

      return res.status(200).json(responseWrapper("success", "Fetched log successfully", log));
    } catch (error) {
      return res.status(500).json(responseWrapper("error", "Internal Server Error", error));
    }
  };
}
