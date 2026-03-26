import mongoose, { Document, Types } from "mongoose";
import { IHouse } from "../houses/house.model";
import { IRoom } from "./room.model";

export type NotificationType = "in-app" | "mail" | "zalo";

export interface IRoomPolicy extends Document {
  roomId: Types.ObjectId | IRoom;
  houseId: Types.ObjectId | IHouse;
  description: string;
  defaultTimeReminder: Date | null;
  defaultTimeReminderContent: string;
  notificationType: NotificationType;
  timeReminderStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomPolicySchema = new mongoose.Schema<IRoomPolicy>(
  {
    roomId: { type: Types.ObjectId, ref: "rooms", required: true },
    houseId: { type: Types.ObjectId, ref: "houses", required: true },
    description: { type: String, default: "" },
    defaultTimeReminder: { type: Date, default: null },
    defaultTimeReminderContent: { type: String, default: "" },
    notificationType: {
      type: String,
      enum: ["in-app", "mail", "zalo"],
      default: "in-app",
    },
    timeReminderStatus: { type: String, default: "active" },
  },
  { versionKey: false, timestamps: true }
);

RoomPolicySchema.index({ roomId: 1 }, { unique: true });
RoomPolicySchema.index({ houseId: 1 });

export default mongoose.model<IRoomPolicy>("room_policies", RoomPolicySchema);
