"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_routes_1 = __importDefault(require("../../modules/rooms/room.routes"));
const router = (0, express_1.Router)();
router.use('/rooms', room_routes_1.default);
exports.default = router;
