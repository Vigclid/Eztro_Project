import mongoose, { Document, Types } from "mongoose";
import { NotificationMetadata } from "./notificationMetadata";

export type NotificationTarget =
  | { kind: "user"; userId: Types.ObjectId }
  | { kind: "house"; houseId: Types.ObjectId }
  | { kind: "room"; roomId: Types.ObjectId }
  | { kind: "all" };

export interface INotification extends Document {
  type: string;
  target: NotificationTarget;
  triggeredBy?: Types.ObjectId; // ai tạo ra notification này
  metadata: NotificationMetadata;
  status: "unread" | "read";
  sendAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>({
  type: { type: String, required: true },
  target: { type: mongoose.Schema.Types.Mixed, required: true },
  triggeredBy: { type: Types.ObjectId, ref: "users" },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ["unread", "read"], default: "unread" },
  sendAt: { type: Date, default: Date.now },
});

NotificationSchema.index({ "target.userId": 1, status: 1 });
NotificationSchema.index({ "target.houseId": 1 });

export default mongoose.model<INotification>("notifications", NotificationSchema);
