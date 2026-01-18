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
