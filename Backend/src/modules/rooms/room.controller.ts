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
            if (
                error?.code === "ROOM_NOT_FOUND" ||
                error?.message === "ROOM_NOT_FOUND"
            ) {
                return res
                    .status(404)
                    .json(responseWrapper("error", "Không tìm thấy phòng cần sửa"));
            }

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

    createInviteCode = async (req: Request, res: Response) => {
        try {
            const roomId = req.params.id;
            const token = req.headers["authorization"]?.split(" ")[1];
            const { id } = jwt.decode(token as string) as { id: string };

            const invitation = await this.RoomService.createInviteCodeForRoom(roomId, id);
            return res
                .status(200)
                .json(responseWrapper("success", "Tạo mã phòng thành công", invitation));
        } catch (error: any) {
            if (error?.code === "ROOM_NOT_FOUND") {
                return res.status(404).json(responseWrapper("error", "Không tìm thấy phòng"));
            }
            return res.status(500).json(responseWrapper("error", "Internal Server Error", error));
        }
    };

    inviteTenant = async (req: Request, res: Response) => {
        try {
            const { roomId, invitedUserId } = req.body;
            const token = req.headers["authorization"]?.split(" ")[1];
            const { id } = jwt.decode(token as string) as { id: string };

            const invitation = await this.RoomService.inviteTenantToRoom(
                String(roomId),
                String(invitedUserId),
                id
            );
            return res
                .status(200)
                .json(responseWrapper("success", "Gửi lời mời thành công", invitation));
        } catch (error: any) {
            if (error?.code === "ROOM_NOT_FOUND") {
                return res.status(404).json(responseWrapper("error", "Không tìm thấy phòng"));
            }
            if (error?.code === 11000) {
                return res.status(200).json(
                    responseWrapper(
                        "error",
                        "Lời mời đã tồn tại hoặc dữ liệu lời mời bị trùng. Vui lòng thử lại."
                    )
                );
            }
            if (error?.code === "INVITED_USER_NOT_TENANT") {
                return res.status(200).json(responseWrapper("error", "Người dùng được mời không phải Tenant"));
            }
            if (error?.code === "USER_ALREADY_IN_ACTIVE_ROOM") {
                return res.status(200).json(
                    responseWrapper("error", "Người dùng đang ở trong phòng khác, cần rời phòng trước khi thêm")
                );
            }
            if (error?.code === "INVITATION_ALREADY_PENDING") {
                return res.status(200).json(responseWrapper("error", "Lời mời đang chờ xử lý"));
            }
            return res.status(500).json(responseWrapper("error", "Internal Server Error", error));
        }
    };

    joinByCode = async (req: Request, res: Response) => {
        try {
            const { inviteCode } = req.body;
            const token = req.headers["authorization"]?.split(" ")[1];
            const { id } = jwt.decode(token as string) as { id: string };

            const result = await this.RoomService.joinRoomByCode(String(inviteCode), id);
            return res.status(200).json(responseWrapper("success", "Tham gia phòng thành công", result));
        } catch (error: any) {
            if (error?.code === "INVALID_OR_EXPIRED_CODE") {
                return res.status(200).json(responseWrapper("error", "Mã phòng không hợp lệ hoặc đã hết hạn"));
            }
            if (error?.code === "USER_ALREADY_IN_ACTIVE_ROOM") {
                return res.status(200).json(
                    responseWrapper("error", "Bạn đang ở trong phòng khác, vui lòng rời phòng trước")
                );
            }
            return res.status(500).json(responseWrapper("error", "Internal Server Error", error));
        }
    };

    getMyInvitations = async (req: Request, res: Response) => {
        try {
            const token = req.headers["authorization"]?.split(" ")[1];
            const { id } = jwt.decode(token as string) as { id: string };

            const invitations = await this.RoomService.getPendingInvitationsOfTenant(id);
            return res
                .status(200)
                .json(responseWrapper("success", "Lấy danh sách lời mời thành công", invitations));
        } catch (error: any) {
            return res.status(500).json(responseWrapper("error", "Internal Server Error", error));
        }
    };

    acceptInvitation = async (req: Request, res: Response) => {
        try {
            const invitationId = req.params.id;
            const token = req.headers["authorization"]?.split(" ")[1];
            const { id } = jwt.decode(token as string) as { id: string };

            const result = await this.RoomService.acceptInvitation(invitationId, id);
            return res.status(200).json(responseWrapper("success", "Chấp nhận lời mời thành công", result));
        } catch (error: any) {
            if (error?.code === "INVITATION_NOT_FOUND") {
                return res.status(404).json(responseWrapper("error", "Không tìm thấy lời mời"));
            }
            if (error?.code === "INVITATION_FORBIDDEN") {
                return res.status(403).json(responseWrapper("error", "Không có quyền với lời mời này"));
            }
            if (error?.code === "INVITATION_EXPIRED") {
                return res.status(200).json(responseWrapper("error", "Lời mời đã hết hạn"));
            }
            if (error?.code === "USER_ALREADY_IN_ACTIVE_ROOM") {
                return res.status(200).json(
                    responseWrapper("error", "Bạn đang ở trong phòng khác, vui lòng rời phòng trước")
                );
            }
            return res.status(500).json(responseWrapper("error", "Internal Server Error", error));
        }
    };

    getMyActiveRoom = async (req: Request, res: Response) => {
        try {
            const token = req.headers["authorization"]?.split(" ")[1];
            const { id } = jwt.decode(token as string) as { id: string };

            const roomInfo = await this.RoomService.getActiveRoomOfUser(id);
            return res.status(200).json(responseWrapper("success", "Lấy thông tin phòng hiện tại thành công", roomInfo));
        } catch (error: any) {
            return res.status(500).json(responseWrapper("error", "Internal Server Error", error));
        }
    };

    removeRoomMember = async (req: Request, res: Response) => {
        try {
            const roomMemberId = req.params.id;
            const token = req.headers["authorization"]?.split(" ")[1];
            const { id } = jwt.decode(token as string) as { id: string };

            const removedMember = await this.RoomService.removeMemberByLandlord(roomMemberId, id);
            return res
                .status(200)
                .json(responseWrapper("success", "Xóa thành viên khỏi phòng thành công", removedMember));
        } catch (error: any) {
            if (error?.code === "ROOM_MEMBER_NOT_FOUND") {
                return res.status(404).json(responseWrapper("error", "Không tìm thấy thành viên phòng"));
            }
            if (error?.code === "ROOM_MEMBER_ALREADY_LEFT") {
                return res.status(200).json(responseWrapper("error", "Thành viên này đã rời phòng"));
            }
            if (error?.code === "LANDLORD_FORBIDDEN") {
                return res.status(403).json(responseWrapper("error", "Bạn không có quyền xóa thành viên phòng này"));
            }
            if (error?.code === "ROOM_NOT_FOUND" || error?.code === "HOUSE_NOT_FOUND") {
                return res.status(404).json(responseWrapper("error", "Không tìm thấy phòng/cụm trọ liên quan"));
            }
            return res.status(500).json(responseWrapper("error", "Internal Server Error", error));
        }
    };

    getRoomMembers = async (req: Request, res: Response) => {
        try {
            const roomId = req.params.id;
            const token = req.headers["authorization"]?.split(" ")[1];
            const { id } = jwt.decode(token as string) as { id: string };

            const members = await this.RoomService.getRoomMembersByLandlord(roomId, id);
            return res
                .status(200)
                .json(responseWrapper("success", "Lấy danh sách thành viên phòng thành công", members));
        } catch (error: any) {
            if (error?.code === "LANDLORD_FORBIDDEN") {
                return res.status(403).json(responseWrapper("error", "Bạn không có quyền xem phòng này"));
            }
            if (error?.code === "ROOM_NOT_FOUND" || error?.code === "HOUSE_NOT_FOUND") {
                return res.status(404).json(responseWrapper("error", "Không tìm thấy phòng/cụm trọ liên quan"));
            }
            return res.status(500).json(responseWrapper("error", "Internal Server Error", error));
        }
    };
}