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

router.route('/invite-code/:id')
    .post(authenticate, RoomController.createInviteCode)

router.route('/invite')
    .post(authenticate, RoomController.inviteTenant)

router.route('/join-by-code')
    .post(authenticate, RoomController.joinByCode)

router.route('/invitations/my')
    .get(authenticate, RoomController.getMyInvitations)

router.route('/invitations/:id/accept')
    .post(authenticate, RoomController.acceptInvitation)

router.route('/my-room')
    .get(authenticate, RoomController.getMyActiveRoom)

router.route('/:id/members')
    .get(authenticate, RoomController.getRoomMembers)

router.route('/:id/policy')
    .get(authenticate, RoomController.getRoomPolicy)
    .patch(authenticate, RoomController.updateRoomPolicy)

router.route('/members/:id')
    .delete(authenticate, RoomController.removeRoomMember)

router.route('/:id')
    .patch(authenticate, RoomController.updateRoom)

export default router