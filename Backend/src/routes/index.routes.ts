import { Router } from "express";
import v1UserRoutes from "./v1/user.routes";
import v1RoleRoutes from "./v1/roles.routes";
import authRouter from "../modules/auth/auth.route";
import v1MailRoutes from "./v1/mail.routes";
import v1HouseRoutes from "./v1/house.routes";
import v1RoomRoutes from "./v1/room.routes";
import v1InvoiceRoutes from "./v1/invoice.routes";
import v1TicketRoutes from "./v1/ticket.routes";
import v1PackageRoutes from './v1/package.routes';
import v1NotificationRoutes from "./v1/notification.routes";
import v1ReportRoutes from "./v1/report.routes";

const router = Router();

router.use(authRouter);
router.use(
  "/v1",
  v1UserRoutes,
  v1RoleRoutes,
  v1MailRoutes,
  v1HouseRoutes,
  v1RoomRoutes,
  v1InvoiceRoutes,
  v1TicketRoutes,
  v1PackageRoutes,
  v1NotificationRoutes,
  v1ReportRoutes
);
export default router;
