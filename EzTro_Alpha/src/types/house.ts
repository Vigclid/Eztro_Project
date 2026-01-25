import { IUser } from './users'

export interface IHouse {
    _id: string | undefined
    landlordId: IUser | undefined,
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
}