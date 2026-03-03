"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
// import { authorize } from "../../middlewares/roleMiddleware";
const house_controller_1 = require("./house.controller");
const house_service_1 = require("./house.service");
const router = (0, express_1.Router)();
const HouseController = new house_controller_1.houseController(new house_service_1.houseService());
router.route('/:id')
    .get(authMiddleware_1.authenticate, HouseController.getHouseById);
router.route('/')
    .get(authMiddleware_1.authenticate, HouseController.getAllHousesByLandlordId)
    .post(authMiddleware_1.authenticate, HouseController.createNewHouse);
exports.default = router;
