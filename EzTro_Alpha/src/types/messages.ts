import { IUser } from "./users";

export interface IMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  dateSent: Date;
  isRead: number;
}

export interface IMessagePopulated {
  _id: string;
  senderId: IUser;
  receiverId: IUser;
  dateSent: Date;
  message: string;
  isRead: number;
}
