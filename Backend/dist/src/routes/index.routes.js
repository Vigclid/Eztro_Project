"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./v1/user.routes"));
const roles_routes_1 = __importDefault(require("./v1/roles.routes"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const mail_routes_1 = __importDefault(require("./v1/mail.routes"));
const house_routes_1 = __importDefault(require("./v1/house.routes"));
const room_routes_1 = __importDefault(require("./v1/room.routes"));
const router = (0, express_1.Router)();
router.use(auth_route_1.default);
router.use("/v1", user_routes_1.default, roles_routes_1.default, mail_routes_1.default, house_routes_1.default, room_routes_1.default);
exports.default = router;
