// Chat Type Definitions
export interface IParticipant {
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  lastSeen?: Date;
}

export interface ILastMessage {
  messageId: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

export interface IConversation {
  _id: string;
  type: "direct";
  participants: IParticipant[];
  participantIds: string[];
  lastMessage?: ILastMessage;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file";
  status: "sent" | "delivered" | "read";
  createdAt: Date;
}

// API Response Types
export interface ConversationsResponse {
  conversations: IConversation[];
  nextCursor: string | null;
}

export interface MessagesResponse {
  messages: IMessage[];
  nextCursor: string | null;
}

// Socket Event Types
export interface SendMessagePayload {
  to: string;
  content: string;
  type?: "text" | "image" | "file";
}

export interface ReceiveMessagePayload {
  messageId: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file";
  createdAt: Date;
}
