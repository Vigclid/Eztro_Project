import mongoose, { Document, Types } from "mongoose";
import { IRoom } from "../rooms/room.model";

export interface InvoiceZalo {
  accessToken: string;
  phoneToken: string;
  phoneNumber: string;
  waterNumber: string;
  waterImage: string;
  electricNumber: string;
  electricImage: string;
}
export interface IInvoice extends Document {
  roomId: Types.ObjectId | IRoom;
  utilities: {
    key: string;
    value: number;
  }[];
  status: string;
  previousElectricityNumber: number;
  currentElectricityNumber: number;
  electricityImage: string;
  previousWaterNumber: number;
  currentWaterNumber: number;
  waterImage: string;
  electricityCharge: number;
  waterCharge: number;
  totalAmount: number;
  createDate: Date;
}

export const InvoiceSchema = new mongoose.Schema<IInvoice>({
  roomId: { type: Types.ObjectId, ref: "rooms", required: true },
  utilities: {
    type: [
      {
        key: String,
        value: Number,
      },
    ],
  },
  status: {
    type: String,
    enum: ["processing", "completed"],
    required: true,
    default: "processing",
  },
  previousElectricityNumber: { type: Number },
  currentElectricityNumber: { type: Number },
  previousWaterNumber: { type: Number },
  electricityImage: { type: String },
  waterImage: { type: String },
  currentWaterNumber: { type: Number },
  electricityCharge: { type: Number },
  waterCharge: { type: Number },
  totalAmount: { type: Number },
  createDate: { type: Date, default: Date.now },
});

InvoiceSchema.pre("save", function () {
  const utilitiesTotal = this.utilities?.reduce((sum, u) => sum + (u.value ?? 0), 0) ?? 0;

  const electricityUsage =
    (this.currentElectricityNumber ?? 0) - (this.previousElectricityNumber ?? 0);

  const waterUsage = (this.currentWaterNumber ?? 0) - (this.previousWaterNumber ?? 0);

  this.totalAmount =
    electricityUsage * (this.electricityCharge ?? 0) +
    waterUsage * (this.waterCharge ?? 0) +
    utilitiesTotal;
});

export default mongoose.model<IInvoice>("invoices", InvoiceSchema);
