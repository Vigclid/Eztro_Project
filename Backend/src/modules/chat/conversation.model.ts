import mongoose, { Document, Types } from "mongoose";

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

const ParticipantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: { type: String },
  lastSeen: { type: Date },
}, { _id: false });

const LastMessageSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, required: true },
}, { _id: false });

const ConversationSchema = new mongoose.Schema<IConversation>({
  type: { type: String, enum: ["direct"], default: "direct", required: true },
  participants: { type: [ParticipantSchema], required: true },
  participantIds: { type: [mongoose.Schema.Types.ObjectId], required: true },
  lastMessage: { type: LastMessageSchema },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { versionKey: false });

// Indexes
ConversationSchema.index({ participantIds: 1, updatedAt: -1 });
ConversationSchema.index({ participantIds: 1 }, { unique: true });

export default mongoose.model<IConversation>("conversations", ConversationSchema);
