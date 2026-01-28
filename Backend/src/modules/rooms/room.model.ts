import mongoose, {Document, Types} from "mongoose";
import { IHouse } from "../houses/house.model";

export interface IRoom extends Document {
    houseId: Types.ObjectId | IHouse,
    roomName: string,
    rentalFee: number,
    status: string,
    rentalDate: Date
}

export const RoomSchema = new mongoose.Schema<IRoom>({
    houseId: { type: Types.ObjectId, ref: 'houses', required: true },
    roomName: { type: String, required: true },
    rentalFee: { type: Number, required: true },
    status: { type: String, enum: ['Đang Thuê', 'Còn Trống'], required: true },
    rentalDate: { type: Date, default: null }
})

export default mongoose.model<IRoom>('rooms', RoomSchema)