import { IUser } from "./users";

export interface ISetting {
    userId: IUser;
    inApp: boolean;
    notifyEmail: boolean;
    notifyZalo: boolean;
    theme: string;
    createdAt: Date;
    updatedAt: Date;
}