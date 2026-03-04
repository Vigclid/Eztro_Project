import { IRoom } from "./room";

export interface IInvoice {
    _id: string | undefined,
    roomId: IRoom | undefined,
    utilities: {
        key: string,
        value: number
    }[] | undefined,
    status: string | undefined,
    previousElectricityNumber: number | undefined,
    currentElectricityNumber: number | undefined,
    previousWaterNumber: number | undefined,
    currentWaterNumber: number | undefined,
    electricityCharge: number | undefined,
    waterCharge: number | undefined,
    totalAmount: number | undefined,
    createDate: Date | undefined
}