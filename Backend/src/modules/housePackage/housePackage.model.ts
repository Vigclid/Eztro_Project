import mongoose, { Document, Types } from "mongoose";
import { IHouse } from "../houses/house.model";
import { IPackage } from "../package/package.model";

export interface IHousePackage extends Document {
    houseId: Types.ObjectId | IHouse,
    packageId: Types.ObjectId | IPackage,
    expirationDate: Date,
    createDate: Date
}

export const HousePackageSchema = new mongoose.Schema<IHousePackage>({
    houseId: { type: Types.ObjectId, ref: 'houses', required: true },
    packageId: { type: Types.ObjectId, ref: 'packages', required: true },
    expirationDate: { type: Date, required: true },
    createDate: { type: Date, default: Date.now }
})

export default mongoose.model<IHousePackage>('housePackages', HousePackageSchema)