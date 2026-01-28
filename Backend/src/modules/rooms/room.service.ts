import { GenericService } from "../../core/services/base.service";
import roomModel, { IRoom } from "./room.model";

export class roomService extends GenericService<IRoom> {
    constructor() {
        super(roomModel)
    }

    createNewRoom = async (data: Partial<IRoom>) => {
        const newRoom = new roomModel({
            ...data,
        })
        return (await roomModel.create(newRoom))
    };

    getAllRoomsByHouseId = async (houseId: string) => {
        return await roomModel.find({ houseId: houseId });
    }
}