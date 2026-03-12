import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
// import { authorize } from "../../middlewares/roleMiddleware";
import { houseController } from "./house.controller";
import { houseService } from "./house.service";
import { housePackageService } from "../housePackage/housePackage.service";

const router = Router();
const HouseController = new houseController(
    new houseService(),
    new housePackageService()
)

router.route('/landlord/all')
    .get(authenticate, HouseController.getAllHousesByLandlordId)

router.route('/:id')
    .get(authenticate, HouseController.getHouseById)

router.route('/')
    .post(authenticate, HouseController.createNewHouse)

export default router 