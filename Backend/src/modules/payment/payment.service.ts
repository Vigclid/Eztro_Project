import { GenericService } from "../../core/services/base.service";
import paymentModel, { IPayment } from "./payment.model";
import { Types } from "mongoose";

export class paymentService extends GenericService<IPayment> {
  constructor() {
    super(paymentModel);
  }

  createPayment = async (userId: string, invoiceId: string) => {
    return await paymentModel.create({
      userId: new Types.ObjectId(userId),
      invoiceId: new Types.ObjectId(invoiceId),
    });
  };

  getPaymentsByTenant = async (userId: string) => {
    return await paymentModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "invoices",
          localField: "invoiceId",
          foreignField: "_id",
          as: "invoiceDetail",
        },
      },
      { $unwind: "$invoiceDetail" },
      {
        $lookup: {
          from: "rooms",
          localField: "invoiceDetail.roomId",
          foreignField: "_id",
          as: "roomDetail",
        },
      },
      { $unwind: "$roomDetail" },
      {
        $lookup: {
          from: "houses",
          localField: "roomDetail.houseId",
          foreignField: "_id",
          as: "houseDetail",
        },
      },
      { $unwind: "$houseDetail" },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          invoice: {
            $mergeObjects: [
              "$invoiceDetail",
              {
                roomId: {
                  $mergeObjects: ["$roomDetail", { houseId: "$houseDetail" }],
                },
              },
            ],
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  };
}
