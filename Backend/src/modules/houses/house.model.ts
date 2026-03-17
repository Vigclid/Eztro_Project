import mongoose, { Document, Types } from "mongoose";
import housePackageModel from "../housePackage/housePackage.model";
import { IUser } from "../users/user.model";

export interface IHouse extends Document {
    landlordId: Types.ObjectId | IUser,
    houseName: string,
    description: string,
    defaultElectricityCharge: number,
    defaultWaterCharge: number,
    defaultPrice: number,
    defaultUtilitesCharge: {
        key: string,
        value: number
    }[],
    address: string,
    status: string,
    createDate: Date
}

export const HouseSchema = new mongoose.Schema<IHouse>({
    landlordId: { type: Types.ObjectId, ref: 'users', required: true },
    houseName: { type: String, required: true },
    description: { type: String, required: true },
    defaultElectricityCharge: { type: Number },
    defaultWaterCharge: { type: Number },
    defaultPrice: { type: Number },
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
    status: { type: String, enum: ['Còn Phòng', 'Hết Phòng'], required: true, default: 'Còn Phòng' },
    createDate: { type: Date, default: Date.now }
})

HouseSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
        await housePackageModel.deleteMany({ houseId: doc._id });
    }
    next();
});

export default mongoose.model<IHouse>('houses', HouseSchema)