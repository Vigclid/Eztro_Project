import mongoose, { Document, Types } from "mongoose";
import { IRoom } from "./room.model";
import { IUser } from "../users/user.model";

export type RoomMemberRole = "TENANT" | "CO-TENANT";
export type RoomMemberStatus = "Đang Thuê" | "Đã Rời Phòng";

export interface IRoomMember extends Document {
  roomId: Types.ObjectId | IRoom;
  userId: Types.ObjectId | IUser;
  invitedBy: Types.ObjectId | IUser;
  role: RoomMemberRole;
  status: RoomMemberStatus;
  moveInDate: Date;
  moveOutDate?: Date | null;
  createdAt: Date;
}

const RoomMemberSchema = new mongoose.Schema<IRoomMember>(
  {
    roomId: { type: Types.ObjectId, ref: "rooms", required: true },
    userId: { type: Types.ObjectId, ref: "users", required: true },
    invitedBy: { type: Types.ObjectId, ref: "users", required: true },
    role: { type: String, enum: ["TENANT", "CO-TENANT"], required: true },
    status: {
      type: String,
      enum: ["Đang Thuê", "Đã Rời Phòng"],
      default: "Đang Thuê",
    },
    moveInDate: { type: Date, required: true },
    moveOutDate: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

RoomMemberSchema.index({ userId: 1, status: 1 });
RoomMemberSchema.index({ roomId: 1, status: 1 });

export default mongoose.model<IRoomMember>("room_members", RoomMemberSchema);
