import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";
import { housePackageController } from "./housePackage.controller";
import { housePackageService } from "./housePackage.service";

const router = Router();
const HousePackageController = new housePackageController(new housePackageService());

// Get all house packages (Admin/Staff only)
router.get("/all", authenticate, authorize(["Admin", "Staff"]), HousePackageController.getAllHousePackages);

// Get revenue by month (Admin/Staff only)
router.get("/revenue/monthly", authenticate, authorize(["Admin", "Staff"]), HousePackageController.getRevenueByMonth);

// Get revenue by day (Admin/Staff only)
router.get("/revenue/daily", authenticate, authorize(["Admin", "Staff"]), HousePackageController.getRevenueByDay);

// Get total revenue (Admin/Staff only)
router.get("/revenue/total", authenticate, authorize(["Admin", "Staff"]), HousePackageController.getTotalRevenue);

// Create new house package
router.post("/", authenticate, HousePackageController.createNewHousePackage);

// Update house package by house ID
router.patch("/:id", authenticate, HousePackageController.updateHousePackageByHouseId);

export default router;
