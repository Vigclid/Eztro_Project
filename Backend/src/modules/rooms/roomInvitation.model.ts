import mongoose, { Document, Types } from "mongoose";
import { IRoom } from "./room.model";
import { IUser } from "../users/user.model";

export type InvitationStatus = "Đang Chờ" | "Đã Chấp Nhận" | "Hết Hạn";

export interface IRoomInvitation extends Document {
  roomId: Types.ObjectId | IRoom;
  inviteCode?: string | null;
  invitedUserId?: Types.ObjectId | IUser | null;
  createdBy: Types.ObjectId | IUser;
  depositAmount: number;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
}

const RoomInvitationSchema = new mongoose.Schema<IRoomInvitation>(
  {
    roomId: { type: Types.ObjectId, ref: "rooms", required: true },
    inviteCode: { type: String, required: false },
    invitedUserId: { type: Types.ObjectId, ref: "users", required: false, default: null },
    createdBy: { type: Types.ObjectId, ref: "users", required: true },
    depositAmount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["Đang Chờ", "Đã Chấp Nhận", "Hết Hạn"],
      default: "Đang Chờ",
    },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

RoomInvitationSchema.index(
  { inviteCode: 1 },
  {
    unique: true,
    partialFilterExpression: {
      inviteCode: { $type: "string" },
    },
  }
);
RoomInvitationSchema.index({ roomId: 1, invitedUserId: 1, status: 1 });

export default mongoose.model<IRoomInvitation>("room_invitations", RoomInvitationSchema);
