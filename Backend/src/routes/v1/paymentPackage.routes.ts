import { Router } from "express";
import paymentPackageRoutes from "../../modules/paymentPackage/paymentPackage.routes";

const router = Router()
router.use('/paymentPackages', paymentPackageRoutes);

export default router