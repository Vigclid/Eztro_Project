import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { paymentPackageController } from "./paymentPackage.controller";
import { PaymentPackageService } from "./paymentPackage.service";

const router = Router()
const PaymentPackageController = new paymentPackageController(new PaymentPackageService())

router.route('/me')
    .get(authenticate, PaymentPackageController.getPaymentPackageByUserId)

export default router 
