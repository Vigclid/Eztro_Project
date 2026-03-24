import mongoose, { Document, Types } from "mongoose";

// Plain interfaces - không tạo schema riêng
export interface IParticipant {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  lastSeen?: Date;
}

export interface ILastMessage {
  messageId: Types.ObjectId;
  content: string;
  senderId: Types.ObjectId;
  createdAt: Date;
}

export interface IConversation extends Document {
  type: "direct";
  participants: IParticipant[];
  participantIds: Types.ObjectId[];
  lastMessage?: ILastMessage;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition với Mixed type cho nested objects
const ConversationSchema = new mongoose.Schema<IConversation>({
  type: { type: String, enum: ["direct"], default: "direct", required: true },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: { type: String },
    lastSeen: { type: Date },
    _id: false
  }],
  participantIds: { type: [mongoose.Schema.Types.ObjectId], required: true },
  lastMessage: {
    messageId: { type: mongoose.Schema.Types.ObjectId },
    content: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId },
    createdAt: { type: Date },
    _id: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { versionKey: false });

// Indexes
ConversationSchema.index({ participantIds: 1, updatedAt: -1 });
// Note: Removed unique index on participantIds to allow duplicate check in code
// ConversationSchema.index({ participantIds: 1 }, { unique: true });

export default mongoose.model<IConversation>("conversations", ConversationSchema);
