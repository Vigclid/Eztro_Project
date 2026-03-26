import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";
import { logController } from "./log.controller";
import { logService } from "./log.service";

const router = Router();
const LogController = new logController(new logService());

// Get all logs with filters (Admin only)
router.route("/").get(authenticate, authorize(["Admin"]), LogController.getLogs);

// Get log by ID (Admin only)
router.route("/:id").get(authenticate, authorize(["Admin"]), LogController.getLogById);

export default router;
