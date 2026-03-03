"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomService = void 0;
const base_service_1 = require("../../core/services/base.service");
const room_model_1 = __importDefault(require("./room.model"));
class roomService extends base_service_1.GenericService {
    constructor() {
        super(room_model_1.default);
        this.createNewRoom = async (data) => {
            const newRoom = new room_model_1.default({
                ...data,
            });
            return (await room_model_1.default.create(newRoom));
        };
        this.getAllRoomsByHouseId = async (houseId) => {
            return await room_model_1.default.find({ houseId: houseId });
        };
    }
}
exports.roomService = roomService;
