import { IHouse } from "./house";

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
  virtualTenants?: IVirtualTenant[];
}