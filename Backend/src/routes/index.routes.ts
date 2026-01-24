import { Router } from "express";
import v1UserRoutes from "./v1/user.routes";
import v1RoleRoutes from "./v1/roles.routes";
import authRouter from "../modules/auth/auth.route";
import v1MailRoutes from "./v1/mail.routes";

const router = Router();

router.use(authRouter);
router.use("/v1", v1UserRoutes, v1RoleRoutes, v1MailRoutes);
export default router;
