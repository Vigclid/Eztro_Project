import mongoose, { Document } from "mongoose";

export interface IPackage extends Document {
    packageName: string,
    description: string,
    price: number,
    maxRoom: number,
    duration: number,
    createDate: Date
}

export const PackageSchema = new mongoose.Schema<IPackage>({
    packageName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    maxRoom: {type: Number, required: true},
    duration: { type: Number, required: true },
    createDate: { type: Date, default: Date.now }
})

export default mongoose.model<IPackage>('packages', PackageSchema)