import { IHouse } from "./house";
import { IUser } from "./users";

export interface IVirtualTenant {
  tenantName: string;
  phoneNumber: string;
  joinDate: Date;
}

export interface IRoom {
  _id: string | undefined;
  houseId?: IHouse | undefined;
  area?: number | undefined;
  floor?: number | undefined;
  roomName: string | undefined;
  rentalFee: number | undefined;
  status: string | undefined;
  rentDate: Date | undefined;
  defaultDepositAmount?: number;
  virtualTenants?: IVirtualTenant[];
}

export interface IRoomMember {
  roomId: String | IRoom;
  userId: String | IUser;
  invitedBy: String | IUser;
  depositAmount?: number;
  role: string;
  status: string;
  moveInDate: Date;
  moveOutDate?: Date | null;
  createdAt: Date;
}
