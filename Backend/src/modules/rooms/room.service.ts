import { GenericService } from "../../core/services/base.service";
import roomModel, { IRoom } from "./room.model";

export class roomService extends GenericService<IRoom> {
  constructor() {
    super(roomModel);
  }

  createNewRoom = async (data: Partial<IRoom>) => {
    // Đảm bảo không tạo 2 phòng trùng tên trong cùng 1 cụm trọ
    if (!data.houseId || !data.roomName) {
      throw new Error("HOUSE_ID_AND_ROOM_NAME_REQUIRED");
    }

    const existed = await roomModel.findOne({
      houseId: data.houseId,
      roomName: data.roomName,
    });

    if (existed) {
      const error: any = new Error("ROOM_NAME_ALREADY_EXISTS_IN_HOUSE");
      error.code = "ROOM_NAME_ALREADY_EXISTS_IN_HOUSE";
      throw error;
    }

    const newRoom = new roomModel({
      ...data,
    });
    return await roomModel.create(newRoom);
  };

  getAllRoomsByHouseId = async (houseId: string) => {
    return await roomModel.find({ houseId: houseId });
  };

  updateRoom = async (roomId: string, data: Partial<IRoom>) => {
    const existing = await roomModel.findById(roomId);
    if (!existing) {
      const error: any = new Error("ROOM_NOT_FOUND");
      error.code = "ROOM_NOT_FOUND";
      throw error;
    }
    const targetHouseId = (data.houseId as any) || existing.houseId;
    const targetRoomName = (data.roomName as any) || existing.roomName;

    if (!targetHouseId || !targetRoomName) {
      return await roomModel.findByIdAndUpdate(roomId, data, { new: true });
    }

    const duplicate = await roomModel.findOne({
      houseId: targetHouseId,
      roomName: targetRoomName,
      _id: { $ne: roomId },
    });

    if (duplicate) {
      const error: any = new Error("ROOM_NAME_ALREADY_EXISTS_IN_HOUSE");
      error.code = "ROOM_NAME_ALREADY_EXISTS_IN_HOUSE";
      throw error;
    }

    return await roomModel.findByIdAndUpdate(roomId, data, { new: true });
  };
}
