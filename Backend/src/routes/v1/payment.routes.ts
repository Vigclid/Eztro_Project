import { Router } from "express";
import paymentRoutes from "../../modules/payment/payment.routes";

const router = Router();
router.use("/payments", paymentRoutes);

export default router;
