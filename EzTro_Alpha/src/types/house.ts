import { IUser } from './users'
import { IPackage } from './package'

export interface IHousePackageInfo {
    _id?: string;
    expirationDate?: Date | string;
    createDate?: Date | string;
    isExpired?: boolean;
    package?: IPackage | null;
}

export interface IHouse {
    _id: string | undefined
    landlordId: IUser | undefined,
    houseName: string | undefined,
    description: string | undefined,
    defaultElectricityCharge: number | undefined,
    defaultWaterCharge: number | undefined,
    defaultUtilitesCharge: {
        key: string,
        value: number
    }[] | undefined,
    address: string | undefined,
    status: string | undefined,
    createDate: Date | undefined
    houseImgs: string[] | undefined
    housePackage?: IHousePackageInfo | null
}

export interface IHouseDelete {
    _id: string
    houseName: string
    address: string
    totalRooms: number
    rentedRooms: number
}