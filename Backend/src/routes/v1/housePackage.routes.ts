import { Router } from "express";
import housePackageRoutes from "../../modules/housePackage/housePackage.routes";

const router = Router();
router.use("/housePackages", housePackageRoutes);

export default router;
