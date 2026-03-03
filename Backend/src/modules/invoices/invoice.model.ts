import mongoose, { Document, Types } from 'mongoose';
import { IRoom } from '../rooms/room.model';

export interface IInvoice extends Document {
    roomId: Types.ObjectId | IRoom,
    utilities: {
        key: string,
        value: number
    }[],
    status: string,
    previousElectricityNumber: number,
    currentElectricityNumber: number,
    previousWaterNumber: number,
    currentWaterNumber: number,
    electricityCharge: number,
    waterCharge: number,
    totalAmount: number,
    createDate: Date
}

export const InvoiceSchema = new mongoose.Schema<IInvoice>({
    roomId: { type: Types.ObjectId, ref: 'rooms', required: true },
    utilities: {
        type: [
            {
                key: String,
                value: Number
            }
        ]
    },
    status: { type: String, enum: ['processing', 'completed'], required: true, default: 'processing' },
    previousElectricityNumber: {type: Number},
    currentElectricityNumber: {type: Number},
    previousWaterNumber: {type: Number},
    currentWaterNumber: {type: Number},
    electricityCharge: {type: Number},
    waterCharge: {type: Number},
    totalAmount: {type: Number},
    createDate: { type: Date, default: Date.now }
})

export default mongoose.model<IInvoice>('invoices', InvoiceSchema)