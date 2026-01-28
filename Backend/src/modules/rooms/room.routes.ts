import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { roomController } from "./room.controller";
import { roomService } from "./room.service";

const router = Router();
const RoomController = new roomController(new roomService())

router.route('/')
    .post(authenticate, RoomController.createNewRoom)

router.route('/house/:houseId')
    .get(authenticate, RoomController.getAllRoomsByHouseId)

router.route('/:id')
    .patch(authenticate, RoomController.updateRoom)

export default router