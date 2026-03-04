import mongoose, { Document, Types } from "mongoose";
import { IUser } from "../users/user.model";
import { IHouse } from "../houses/house.model";
import { IRoom } from "../rooms/room.model";

export interface ITicketReply {
  userId: Types.ObjectId | IUser;
  content: string;
  createdAt: Date;
}

export interface ITicket extends Document {
  title: string;
  description: string;
  categories: string[];
  senderId: Types.ObjectId | IUser;
  receiverId: Types.ObjectId | IUser;
  houseId: Types.ObjectId | IHouse;
  roomId: Types.ObjectId | IRoom;
  status: "pending" | "processing" | "completed";
  replies: ITicketReply[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketReplySchema = new mongoose.Schema<ITicketReply>(
  {
    userId: { type: Types.ObjectId, ref: "users", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const TicketSchema = new mongoose.Schema<ITicket>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: [String], required: true },
    senderId: { type: Types.ObjectId, ref: "users", required: true },
    receiverId: { type: Types.ObjectId, ref: "users", required: true },
    houseId: { type: Types.ObjectId, ref: "houses", required: true },
    roomId: { type: Types.ObjectId, ref: "rooms", required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },
    replies: { type: [TicketReplySchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<ITicket>("tickets", TicketSchema);
