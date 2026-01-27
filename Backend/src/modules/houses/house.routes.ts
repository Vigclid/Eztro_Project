import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
// import { authorize } from "../../middlewares/roleMiddleware";
import { houseController } from "./house.controller";
import { houseService } from "./house.service";

const router = Router();
const HouseController = new houseController(new houseService())

router.route('/:id')
    .get(authenticate, HouseController.getHouseById)


router.route('/')
    .get(authenticate, HouseController.getAllHousesByLandlordId)
    .post(authenticate, HouseController.createNewHouse)

export default router