import { Router } from "express";
import settingRoutes from "../../modules/settings/settings.route";

const router = Router();
router.use("/settings", settingRoutes);

export default router;
