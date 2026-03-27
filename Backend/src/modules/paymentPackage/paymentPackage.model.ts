import mongoose, { Document, Types } from "mongoose";
import { IUser } from "../users/user.model";
import { IPackage } from "../package/package.model";

export interface IPaymentPackage extends Document {
    userId: Types.ObjectId | IUser;
    packageId: Types.ObjectId | IPackage;
    expirationDate: Date;
    createDate: Date;
}

export const PaymentPackageSchema = new mongoose.Schema<IPaymentPackage>({
    userId: { type: Types.ObjectId, ref: 'users', required: true },
    packageId: { type: Types.ObjectId, ref: 'packages', required: true },
    expirationDate: { type: Date },
    createDate: { type: Date, default: Date.now }
})

export default mongoose.model<IPaymentPackage>('paymentPackages', PaymentPackageSchema)