import mongoose, { Document, Types } from "mongoose";
import { IHouse } from "../houses/house.model";
import { IPackage } from "../package/package.model";
import { IUser } from "../users/user.model";
import PaymentPackage from '../paymentPackage/paymentPackage.model'

export interface IHousePackage extends Document {
    userId: Types.ObjectId | IUser,
    houseId: Types.ObjectId | IHouse,
    packageId: Types.ObjectId | IPackage,
    expirationDate: Date,
    createDate: Date
}

export const HousePackageSchema = new mongoose.Schema<IHousePackage>({
    userId: { type: Types.ObjectId, ref: 'users', required: true },
    houseId: { type: Types.ObjectId, ref: 'houses', required: true },
    packageId: { type: Types.ObjectId, ref: 'packages', required: true },
    expirationDate: { type: Date, required: true },
    createDate: { type: Date, default: Date.now }
})

HousePackageSchema.post('save', async function (doc, next) {
    try {
        await PaymentPackage.create({
            userId: doc.userId,
            packageId: doc.packageId,
            expirationDate: doc.expirationDate,
        });
        next();
    } catch (error: any) {
        next(error);
    }
});

export default mongoose.model<IHousePackage>('housePackages', HousePackageSchema)