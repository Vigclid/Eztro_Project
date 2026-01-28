import { IRoom } from "./room.model";
import { GenericController } from "../../core/controllers/base.controller";
import { roomService } from "./room.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class roomController extends GenericController<IRoom> {
    private RoomService: roomService
    constructor(roomService: roomService) {
        super(roomService)
        this.RoomService = roomService
    }

    createNewRoom = async (req: Request, res: Response) => {
        try {
            const token = req.headers["authorization"]?.split(" ")[1];
            if (!token) {
                return res.status(401).json(responseWrapper("error", "Unauthorized"));
            }
            const { id } = jwt.decode(token) as { id: string };

            req.body.landlordId = id;
            const result = await this.RoomService.createNewRoom(req.body)
            return res
                .status(201)
                .json(responseWrapper("success", "Tạo Phòng Thành Công", result))
        } catch (error: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", error))
        }
    }

    getAllRoomsByHouseId = async (req: Request, res: Response) => {
        try {
            const houseId = req.params.houseId;
            const result = await this.RoomService.getAllRoomsByHouseId(houseId);

            return res
                .status(200)
                .json(responseWrapper("success", "Lấy Danh Sách Phòng Thành Công", result))
        } catch (error: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", error))
        }
    }

    updateRoom = async (req: Request, res: Response) => {
        try {
            const roomId = req.params.id;
            const updateData = req.body;

            const result = await this.RoomService.update(roomId, updateData);

            if (!result) {
                return res.status(404).json(responseWrapper("error", "Không tìm thấy phòng cần sửa"));
            }

            return res
                .status(200)
                .json(responseWrapper("success", "Cập Nhật Phòng Thành Công", result));
        } catch (error: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", error));
        }
    }
}