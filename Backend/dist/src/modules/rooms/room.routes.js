"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const room_controller_1 = require("./room.controller");
const room_service_1 = require("./room.service");
const router = (0, express_1.Router)();
const RoomController = new room_controller_1.roomController(new room_service_1.roomService());
router.route('/')
    .post(authMiddleware_1.authenticate, RoomController.createNewRoom);
router.route('/house/:houseId')
    .get(authMiddleware_1.authenticate, RoomController.getAllRoomsByHouseId);
router.route('/:id')
    .patch(authMiddleware_1.authenticate, RoomController.updateRoom);
exports.default = router;
