import mongoose, { Document, Types } from "mongoose";
import { IUser } from "../users/user.model";

export interface IHouse extends Document {
    landlordId: Types.ObjectId | IUser,
    defaultElectricityCharge: number,
    defaultWaterCharge: number,
    defaultUtilitesCharge: [
        {
            key: string,
            value: number
        }
    ],
    address: string,
    status: string,
    createDate: Date
}

export const HouseSchema = new mongoose.Schema<IHouse>({
    landlordId: { type: Types.ObjectId, ref: 'User', required: true },
    defaultElectricityCharge: { type: Number, required: true },
    defaultWaterCharge: { type: Number, required: true },
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
    status: { type: String, enum: [''], required: true },
    createDate: { type: Date, default: Date.now }
})

export default mongoose.model<IHouse>('houses', HouseSchema)