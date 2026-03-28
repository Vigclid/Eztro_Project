import { IRole } from "./roles";

export interface IUser {
  _id: string | undefined;
  email: string | undefined;
  password: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  phoneNumber: string | undefined;
  roleId: IRole | string | undefined;
  dateOfBirth?: Date | undefined;
  lastLogin?: Date | undefined;
  accessFailedCount: number | undefined;
  profilePicture?: string | undefined;
  statusActive: boolean | undefined;
  createdAt: Date | undefined;
  loginFailedTime: Date | null | undefined;
  roleName: string | undefined;
  bankName?: string | undefined;
  bankNumber?: string | undefined;
}
