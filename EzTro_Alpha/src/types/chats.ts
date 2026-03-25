import { IUser } from "./users";

export interface IChat {
  _id: string;
  user1Id: string;
  user2Id: string;
  status: number;
}

export interface IChatPopulated {
  _id: string;
  user1Id: IUser;
  user2Id: IUser;
  status: number;
}

// Participant information in conversation
export interface IParticipant {
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  lastSeen?: Date;
}

// Last message preview in conversation list
export interface ILastMessage {
  messageId: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

// Conversation (direct message thread)
export interface IConversation {
  _id: string;
  type: "direct";
  participants: IParticipant[];
  participantIds: string[];
  lastMessage?: ILastMessage;
  createdAt: Date;
  updatedAt: Date;
  unreadCount?: number; // Number of unread messages for current user
}

// Individual message
export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file";
  status: "sent" | "delivered" | "read";
  createdAt: Date;
}

// Socket.IO message payload
export interface ReceiveMessagePayload {
  messageId: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file";
  createdAt: Date;
}

// API Response types
export interface ConversationsResponse {
  conversations: IConversation[];
  nextCursor: string | null;
}

export interface MessagesResponse {
  messages: IMessage[];
  nextCursor: string | null;
}
