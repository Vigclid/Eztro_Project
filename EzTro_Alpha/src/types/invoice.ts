import { IRoom } from "./room";

export interface IInvoice {
    _id: string | undefined,
    roomId: IRoom | undefined,
    utilities: {
        key: string,
        value: number
    }[] | undefined,
    status: string | undefined,
    electricityImage: string | undefined,
    waterImage: string | undefined,
    previousElectricityNumber: number | undefined,
    currentElectricityNumber: number | undefined,
    previousWaterNumber: number | undefined,
    currentWaterNumber: number | undefined,
    electricityCharge: number | undefined,
    waterCharge: number | undefined,
    totalAmount: number | undefined,
    createDate: Date | undefined
}

export interface IRoomInvoice {
    _id: string | undefined;
    roomId: string | undefined;
    roomName: string;
    rentalFee: number;
    tenantName: string;
    electricityPrice: number;
    waterPrice: number;
    utilities: {
        key: string,
        value: number
    }[]
    isSelected: boolean;
    electricityImage: string;
    waterImage: string;
    previousElectricityNumber: number;
    previousWaterNumber: number;
    currentElectricityNumber: number;
    currentWaterNumber: number;
    utilitiesCost: number;
    electricityUsage: number;
    waterUsage: number;
    electricityCost: number;
    waterCost: number;
    totalAmount: number;
}