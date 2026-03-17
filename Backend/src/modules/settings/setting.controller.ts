import { NextFunction, Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { SettingService } from "./setting.service";
import jwt from "jsonwebtoken";
import { GenericController } from "../../core/controllers/base.controller";
import { ISetting } from "./settings.model";

export class SettingController extends GenericController<ISetting> {
  private SettingService: SettingService;
  constructor(settingService: SettingService) {
    super(settingService);
    this.SettingService = settingService;
  }

  getMySettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { id } = jwt.decode(token) as { id: string };
      const settings = await this.SettingService.getByUserId(id);
      if (!settings) {
        return res.status(404).json(responseWrapper("error", "Settings not found"));
      }
      res.json(responseWrapper("success", "Fetched successfully", settings));
    } catch (error) {
      next(error);
    }
  };

  updateMySettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }
      const { id } = jwt.decode(token) as { id: string };
      const result = this.SettingService.updateByUserId(id, req.body);
      if (!result) {
        return res.status(404).json(responseWrapper("error", "Settings not found"));
      }
      res.json(responseWrapper("success", "Updated successfully", result));
    } catch (error) {
      next(error);
    }
  };
}
