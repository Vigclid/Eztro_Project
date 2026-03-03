"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomController = void 0;
const base_controller_1 = require("../../core/controllers/base.controller");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiResponseWrapper_1 = require("../../interfaces/wrapper/ApiResponseWrapper");
class roomController extends base_controller_1.GenericController {
    constructor(roomService) {
        super(roomService);
        this.createNewRoom = async (req, res) => {
            try {
                const token = req.headers["authorization"]?.split(" ")[1];
                if (!token) {
                    return res.status(401).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Unauthorized"));
                }
                const { id } = jsonwebtoken_1.default.decode(token);
                req.body.landlordId = id;
                const result = await this.RoomService.createNewRoom(req.body);
                return res
                    .status(201)
                    .json((0, ApiResponseWrapper_1.responseWrapper)("success", "Tạo Phòng Thành Công", result));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.getAllRoomsByHouseId = async (req, res) => {
            try {
                const houseId = req.params.houseId;
                const result = (await this.RoomService.getAllRoomsByHouseId(houseId)).reverse();
                return res
                    .status(200)
                    .json((0, ApiResponseWrapper_1.responseWrapper)("success", "Lấy Danh Sách Phòng Thành Công", result));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.updateRoom = async (req, res) => {
            try {
                const roomId = req.params.id;
                const updateData = req.body;
                const result = await this.RoomService.update(roomId, updateData);
                if (!result) {
                    return res.status(404).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Không tìm thấy phòng cần sửa"));
                }
                return res
                    .status(200)
                    .json((0, ApiResponseWrapper_1.responseWrapper)("success", "Cập Nhật Phòng Thành Công", result));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.RoomService = roomService;
    }
}
exports.roomController = roomController;
