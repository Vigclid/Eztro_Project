import { IUser } from './users';
import { IHouse } from './house';
import { IRoom } from './room';

export interface ITicketReply {
  userId: IUser;
  content: string;
  createdAt: Date;
  isRead?: boolean;
}

export interface ITicket {
  _id: string;
  title: string;
  description: string;
  categories: string[];
  senderId: IUser;
  receiverId: IUser;
  houseId: IHouse;
  roomId: IRoom;
  status: 'pending' | 'processing' | 'completed';
  replies: ITicketReply[];
  lastReadReplyIndex?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TicketStatus = 'pending' | 'processing' | 'completed';
export type TicketCategory = 'plumbing' | 'electrical' | 'furniture' | 'appliance' | 'structure' | 'other';
