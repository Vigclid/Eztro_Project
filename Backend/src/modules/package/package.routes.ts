import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { packageController } from "./package.controller";
import { packageService } from "./package.service";

const router = Router()
const PackageController = new packageController(new packageService())

router.route('/')
    .get(authenticate, PackageController.getAllPackage)

router.route('/:id')
    .get(authenticate, PackageController.getPackageById);
export default router 