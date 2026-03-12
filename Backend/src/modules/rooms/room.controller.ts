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
            // Trường hợp tên phòng đã tồn tại trong cùng cụm trọ
            if (
                error?.code === "ROOM_NAME_ALREADY_EXISTS_IN_HOUSE" ||
                error?.message === "ROOM_NAME_ALREADY_EXISTS_IN_HOUSE"
            ) {
                return res
                    .status(200)
                    .json(
                        responseWrapper(
                            "error",
                            "Tên phòng này đã tồn tại trong cụm trọ. Vui lòng chọn tên khác."
                        )
                    );
            }

            if (
                error?.code === "HOUSE_PACKAGE_NOT_FOUND" ||
                error?.message === "HOUSE_PACKAGE_NOT_FOUND"
            ) {
                return res
                    .status(200)
                    .json(
                        responseWrapper(
                            "error",
                            "Gói của bạn đã hết hạn vui lòng gia hạn thêm!"
                        )
                    );
            }

            if (
                error?.code === "ROOM_LIMIT_EXCEEDED" ||
                error?.message === "ROOM_LIMIT_EXCEEDED"
            ) {
                return res
                    .status(200)
                    .json(
                        responseWrapper(
                            "error",
                            "Đã đạt giới hạn tạo phòng, vui lòng nâng cấp gói quản lý!"
                        )
                    );
            }

            // Trường hợp vi phạm unique index ở MongoDB
            if (error?.code === 11000) {
                return res
                    .status(200)
                    .json(
                        responseWrapper(
                            "error",
                            "Tên phòng này đã tồn tại trong cụm trọ. Vui lòng chọn tên khác."
                        )
                    );
            }

            res.status(500).json(responseWrapper("error", "Internal Server Error", error))
        }
    }

    getAllRoomsByHouseId = async (req: Request, res: Response) => {
        try {
            const houseId = req.params.houseId;
            const result = (await this.RoomService.getAllRoomsByHouseId(houseId)).reverse();

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

            const result = await this.RoomService.updateRoom(roomId, updateData);

            return res
                .status(200)
                .json(responseWrapper("success", "Cập Nhật Phòng Thành Công", result));
        } catch (error: any) {
            // Trường hợp phòng không tồn tại
            if (
                error?.code === "ROOM_NOT_FOUND" ||
                error?.message === "ROOM_NOT_FOUND"
            ) {
                return res
                    .status(404)
                    .json(responseWrapper("error", "Không tìm thấy phòng cần sửa"));
            }

            // Trường hợp tên phòng đã tồn tại trong cùng cụm trọ
            if (
                error?.code === "ROOM_NAME_ALREADY_EXISTS_IN_HOUSE" ||
                error?.message === "ROOM_NAME_ALREADY_EXISTS_IN_HOUSE"
            ) {
                return res
                    .status(200)
                    .json(
                        responseWrapper(
                            "error",
                            "Tên phòng này đã tồn tại trong cụm trọ. Vui lòng chọn tên khác."
                        )
                    );
            }

            // Trường hợp vi phạm unique index ở MongoDB
            if (error?.code === 11000) {
                return res
                    .status(200)
                    .json(
                        responseWrapper(
                            "error",
                            "Tên phòng này đã tồn tại trong cụm trọ. Vui lòng chọn tên khác."
                        )
                    );
            }

            res.status(500).json(responseWrapper("error", "Internal Server Error", error));
        }
    }
}