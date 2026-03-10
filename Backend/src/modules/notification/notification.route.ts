import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { notificationController } from "./notification.controller";
import { notificationService } from "./notification.service";

const router = Router();
const NotificaitonController = new notificationController(new notificationService());

router
  .route("/me")
  .get(authenticate, NotificaitonController.getByUserId)
  .post(authenticate, NotificaitonController.markAsReadAll);

router.route("/me/as-read/:id").post(authenticate, NotificaitonController.markAsRead);
export default router;
