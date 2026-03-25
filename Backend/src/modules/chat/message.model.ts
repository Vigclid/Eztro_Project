import mongoose, { Document, Types } from "mongoose";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  type: "text" | "image" | "file";
  status: "sent" | "delivered" | "read";
  createdAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "conversations", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["text", "image", "file"], default: "text" },
  status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ conversationId: 1, _id: -1 });

export default mongoose.model<IMessage>("messages", MessageSchema);
