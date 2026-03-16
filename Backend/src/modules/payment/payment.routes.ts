import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { getMyPaymentsAsTenant } from "./payment.controller";

const router = Router();

router.route("/tenant/me").get(authenticate, getMyPaymentsAsTenant);

export default router;
