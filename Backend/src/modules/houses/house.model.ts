import mongoose, { Document, Types } from "mongoose";
import { IUser } from "../users/user.model";

export interface IHouse extends Document {
    landlordId: Types.ObjectId | IUser,
    houseName: string,
    defaultElectricityCharge: number,
    defaultWaterCharge: number,
    defaultUtilitesCharge: {
        key: string,
        value: number
    }[],
    address: string,
    status: string,
    createDate: Date,
    roomCount: number,
    houseImgs: string[]
}

export const HouseSchema = new mongoose.Schema<IHouse>({
    landlordId: { type: Types.ObjectId, ref: 'users', required: true },
    houseName: { type: String, required: true },
    defaultElectricityCharge: { type: Number },
    defaultWaterCharge: { type: Number },
    defaultUtilitesCharge: {
        type: [
            {
                key: { type: String },
                value: { type: Number }
            }
        ],
        required: false
    },
    address: { type: String, required: true },
    status: { type: String, enum: ['Còn Phòng', 'Hết Phòng'], required: true },
    createDate: { type: Date, default: Date.now },
    roomCount: { type: Number, required: true },
    houseImgs: [{ type: String }]
})

export default mongoose.model<IHouse>('houses', HouseSchema)