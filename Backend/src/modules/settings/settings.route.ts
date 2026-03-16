import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { SettingController } from "./setting.controller";
import { SettingService } from "./setting.service";

const router = Router();
const settingController = new SettingController(new SettingService());
router
  .route("/me")
  .get(authenticate, settingController.getMySettings)
  .patch(authenticate, settingController.updateMySettings);

export default router;
