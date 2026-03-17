import { IRoom } from "./room";

export type InvoiceStatus = "processing" | "payment-processing" | "tenant-confirmed" | "completed";

export interface IInvoice {
    _id: string | undefined,
    roomId: IRoom | undefined,
    utilities: {
        key: string,
        value: number
    }[] | undefined,
    status: InvoiceStatus | undefined,
    rentalFee: number | undefined,
    electricityImage: string | undefined,
    waterImage: string | undefined,
    transactionImage: string | undefined,
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
    invoiceId?: string;
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
