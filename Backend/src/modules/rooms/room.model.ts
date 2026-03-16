import mongoose, { Document, Types } from "mongoose";
import { IHouse } from "../houses/house.model";

export interface IVirtualTenant {
  tenantName: string;
  phoneNumber: string;
  joinDate: Date;
}

export interface IRoom extends Document {
  houseId: Types.ObjectId | IHouse;
  roomName: string;
  rentalFee: number;
  status: string;
  rentalDate: Date;
  virtualTenants: IVirtualTenant[];
}

export const VirtualTenantSchema = new mongoose.Schema<IVirtualTenant>(
  {
    tenantName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    joinDate: { type: Date, required: true },
  },
  { _id: false }
);

export const RoomSchema = new mongoose.Schema<IRoom>({
  houseId: { type: Types.ObjectId, ref: "houses", required: true },
  roomName: { type: String, required: true },
  rentalFee: { type: Number, required: true },
  status: { type: String, enum: ["Đang Thuê", "Còn Trống"], required: true },
  rentalDate: { type: Date, default: null },
  virtualTenants: { type: [VirtualTenantSchema], default: [] },
});

// Không cho phép 2 phòng cùng tên trong 1 cụm trọ
RoomSchema.index({ houseId: 1, roomName: 1 }, { unique: true });

export default mongoose.model<IRoom>("rooms", RoomSchema);
