import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
// import { authorize } from "../../middlewares/roleMiddleware";
import { houseController } from "./house.controller";
import { houseService } from "./house.service";

const router = Router();
const HouseController = new houseController(new houseService())

router.route('/')
    .post(authenticate, HouseController.createNewHouse)

export default router