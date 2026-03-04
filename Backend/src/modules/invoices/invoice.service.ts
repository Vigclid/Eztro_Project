import { GenericService } from "../../core/services/base.service";
import invoiceModel, { IInvoice } from "./invoice.model";
import mongoose from "mongoose";

export class invoiceService extends GenericService<IInvoice> {
    constructor() {
        super(invoiceModel)
    }

    getInvoiceById = async (id: string) => {
        return await invoiceModel.findById(id)
    }

    getAllInvoicesByRoomId = async (roomId: string) => {
        return await invoiceModel.find({ roomId })
    }

    createNewInvoice = async (data: Partial<IInvoice>) => {
        const newInvoice = new invoiceModel({
            ...data,
        })
        return (await invoiceModel.create(newInvoice))
    }

    createNewInvoices = async (invoicesData: Partial<IInvoice>[]) => {
        const newInvoices = invoicesData.map((data) => new invoiceModel({
            ...data,
        }))
        return (await invoiceModel.insertMany(newInvoices))
    }

    getFilteredInvoices = async (filters: {
        houseId?: string,
        month?: any,
        year?: any,
        status?: string
    }) => {
        const { houseId, status } = filters;
        // Ép kiểu vì GET query luôn gửi lên dạng String
        const month = filters.month ? parseInt(filters.month) : undefined;
        const year = filters.year ? parseInt(filters.year) : undefined;

        const query: any = {};

        if (status && status !== 'all') {
            query.status = status === 'paid' ? 'completed' : 'processing';
        }

        if (month || year) {
            const y = year || new Date().getFullYear();
            const m = month || (new Date().getMonth() + 1);
            const startDate = new Date(y, m - 1, 1);
            const endDate = new Date(y, m, 0, 23, 59, 59);
            query.createDate = { $gte: startDate, $lte: endDate };
        }

        const pipeline: any[] = [
            { $match: query },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'roomId',
                    foreignField: '_id',
                    as: 'roomDetail'
                }
            },
            { $unwind: '$roomDetail' },
            {
                $lookup: {
                    from: 'houses',
                    localField: 'roomDetail.houseId',
                    foreignField: '_id',
                    as: 'houseDetail'
                }
            },
            { $unwind: '$houseDetail' }
        ];

        if (houseId && houseId !== 'all') {
            pipeline.push({
                $match: { 'roomDetail.houseId': new mongoose.Types.ObjectId(houseId) }
            });
        }

        pipeline.push({ $sort: { createDate: -1 } });

        pipeline.push({
            $project: {
                _id: 1,
                status: 1,
                utilities: 1,
                previousElectricityNumber: 1,
                currentElectricityNumber: 1,
                previousWaterNumber: 1,
                currentWaterNumber: 1,
                electricityCharge: 1,
                waterCharge: 1,
                totalAmount: 1,
                createDate: 1,
                roomId: {
                    $mergeObjects: ["$roomDetail", { houseId: "$houseDetail" }]
                }
            }
        });

        return await invoiceModel.aggregate(pipeline);
    }
}