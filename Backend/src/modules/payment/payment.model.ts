import mongoose, { Document, Types } from "mongoose";

export interface IPayment extends Document {
  userId: Types.ObjectId;
  invoiceId: Types.ObjectId;
}

export const PaymentSchema = new mongoose.Schema<IPayment>(
  {
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "invoices", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IPayment>("payments", PaymentSchema);
