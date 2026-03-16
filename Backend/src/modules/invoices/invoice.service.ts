import { GenericService } from "../../core/services/base.service";
import { uploadImage } from "../../utils/imageUtils";
import roomMemberModel from "../rooms/roomMember.model";
import userModel from "../users/user.model";
import invoiceModel, { IInvoice, InvoiceZalo } from "./invoice.model";
import paymentModel from "../payment/payment.model";
import { notificationService } from "../notification/notification.service";
import { NOTIFICATION_TYPES } from "../notification/notificationTypes";
import mongoose, { PipelineStage, Types } from "mongoose";

export class invoiceService extends GenericService<IInvoice> {
  constructor() {
    super(invoiceModel);
  }

  getInvoiceById = async (id: string) => {
    return await invoiceModel.findById(id);
  };

  getAllInvoicesByRoomId = async (roomId: string) => {
    return await invoiceModel.find({ roomId });
  };

  createNewInvoice = async (data: Partial<IInvoice>) => {
    const newInvoice = new invoiceModel({
      ...data,
    });
    return await invoiceModel.create(newInvoice);
  };

  createNewInvoices = async (invoicesData: Partial<IInvoice>[]) => {
    const newInvoices = invoicesData.map(
      (data) =>
        new invoiceModel({
          ...data,
        })
    );
    return await invoiceModel.insertMany(newInvoices);
  };

  // Landlord finalizes invoices: processing → payment-processing + notify tenants
  finalizeInvoices = async (invoiceIds: string[], triggeredByUserId?: string) => {
    const objectIds = invoiceIds.map((id) => new Types.ObjectId(id));
    const result = await invoiceModel.updateMany(
      { _id: { $in: objectIds }, status: "processing" },
      { $set: { status: "payment-processing" } }
    );
    const notifSvc = new notificationService();
    const updatedInvoices = await invoiceModel.find({ _id: { $in: objectIds } });
    for (const invoice of updatedInvoices) {
      const member = await roomMemberModel.findOne({
        roomId: invoice.roomId,
        role: "TENANT",
        status: "Đang Thuê",
      });
      if (member) {
        await notifSvc.send({
          type: NOTIFICATION_TYPES.LANDLORD_INVOICE,
          target: { kind: "user", userId: member.userId.toString() },
          triggeredBy: triggeredByUserId,
          metadata: {
            invoiceId: (invoice._id as Types.ObjectId).toString(),
            amount: invoice.totalAmount ?? 0,
            roomId: invoice.roomId.toString(),
          },
        });
      }
    }
    return result;
  };

  getProcessingInvoicesByHouse = async (houseId: string) => {
    const pipeline: PipelineStage[] = [
      { $match: { status: "processing" } },
      { $lookup: { from: "rooms", localField: "roomId", foreignField: "_id", as: "roomDetail" } },
      { $unwind: "$roomDetail" },
      { $match: { "roomDetail.houseId": new mongoose.Types.ObjectId(houseId) } },
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
        $lookup: {
          from: "room_members",
          let: { roomId: "$roomId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$roomId", "$$roomId"] },
                role: "TENANT",
                status: "Đang Thuê",
              },
            },
          ],
          as: "tenantMember",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "tenantMember.userId",
          foreignField: "_id",
          as: "tenantUser",
        },
      },
      {
        $project: {
          _id: 1,
          invoiceId: "$_id",
          roomId: 1,
          roomName: "$roomDetail.roomName",
          tenantName: {
            $cond: {
              if: { $gt: [{ $size: "$tenantUser" }, 0] },
              then: {
                $concat: [
                  { $arrayElemAt: ["$tenantUser.lastName", 0] },
                  " ",
                  { $arrayElemAt: ["$tenantUser.firstName", 0] },
                ],
              },
              else: "Chưa có thông tin",
            },
          },
          rentalFee: 1,
          electricityPrice: "$houseDetail.defaultElectricityCharge",
          waterPrice: "$houseDetail.defaultWaterCharge",
          utilities: 1,
          previousElectricityNumber: 1,
          previousWaterNumber: 1,
          currentElectricityNumber: 1,
          currentWaterNumber: 1,
          electricityUsage: {
            $max: [
              {
                $subtract: [
                  { $ifNull: ["$currentElectricityNumber", 0] },
                  { $ifNull: ["$previousElectricityNumber", 0] },
                ],
              },
              0,
            ],
          },
          waterUsage: {
            $max: [
              {
                $subtract: [
                  { $ifNull: ["$currentWaterNumber", 0] },
                  { $ifNull: ["$previousWaterNumber", 0] },
                ],
              },
              0,
            ],
          },
          electricityCost: "$electricityCharge",
          waterCost: "$waterCharge",
          utilitiesCost: {
            $cond: { if: { $isArray: "$utilities" }, then: { $sum: "$utilities.value" }, else: 0 },
          },
          totalAmount: 1,
          isSelected: { $literal: false },
        },
      },
      { $sort: { createDate: -1 } },
    ];
    return await invoiceModel.aggregate(pipeline);
  };

  // Update a draft invoice — frontend passes recalculated values, we skip the pre-save hook
  updateProcessingInvoice = async (invoiceId: string, data: any) => {
    const exists = await invoiceModel.findOne({
      _id: new Types.ObjectId(invoiceId),
      status: "processing",
    });
    if (!exists) throw new Error("INVOICE_NOT_FOUND_OR_INVALID_STATUS");
    const fields: Record<string, any> = {};
    const pick = (k: string) => {
      if (data[k] !== undefined) fields[k] = data[k];
    };
    [
      "rentalFee",
      "currentElectricityNumber",
      "currentWaterNumber",
      "electricityCharge",
      "waterCharge",
      "utilities",
      "totalAmount",
    ].forEach(pick);
    return await invoiceModel.findByIdAndUpdate(invoiceId, { $set: fields }, { new: true });
  };

  getInvoicesByTenant = async (userId: string) => {
    const member = await roomMemberModel.findOne({
      userId: new Types.ObjectId(userId),
      status: "Đang Thuê",
    });
    if (!member) throw new Error("ROOM_NOT_FOUND");

    const pipeline: PipelineStage[] = [
      {
        $match: {
          roomId: member.roomId,
          status: { $in: ["payment-processing", "tenant-confirmed"] },
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
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
          status: 1,
          utilities: 1,
          rentalFee: 1,
          previousElectricityNumber: 1,
          currentElectricityNumber: 1,
          previousWaterNumber: 1,
          currentWaterNumber: 1,
          electricityCharge: 1,
          waterCharge: 1,
          transactionImage: 1,
          totalAmount: 1,
          createDate: 1,
          roomId: {
            $mergeObjects: ["$roomDetail", { houseId: "$houseDetail" }],
          },
        },
      },
      { $sort: { createDate: -1 } },
    ];

    return await invoiceModel.aggregate(pipeline);
  };

  tenantConfirmInvoice = async (invoiceId: string, transactionImageBase64?: string) => {
    const invoice = await invoiceModel.findOne({
      _id: new Types.ObjectId(invoiceId),
      status: "payment-processing",
    });
    if (!invoice) throw new Error("INVOICE_NOT_FOUND_OR_INVALID_STATUS");

    if (transactionImageBase64) {
      const res = await uploadImage(transactionImageBase64, 1, false);
      invoice.transactionImage = res.secure_url;
    }

    invoice.status = "tenant-confirmed";
    await invoice.save();
    return invoice;
  };

  landlordAcceptInvoice = async (invoiceId: string) => {
    const invoice = await invoiceModel.findOne({
      _id: new Types.ObjectId(invoiceId),
      status: "tenant-confirmed",
    });
    if (!invoice) throw new Error("INVOICE_NOT_FOUND_OR_INVALID_STATUS");

    invoice.status = "completed";
    await invoice.save();

    const member = await roomMemberModel.findOne({
      roomId: invoice.roomId,
      role: "TENANT",
      status: "Đang Thuê",
    });
    if (member) {
      await paymentModel.create({
        userId: member.userId,
        invoiceId: invoice._id,
      });
    }

    const utilitiesTotal = invoice.utilities?.reduce((sum, u) => sum + (u.value ?? 0), 0) ?? 0;
    const nextInvoice = new invoiceModel({
      roomId: invoice.roomId,
      status: "processing",
      rentalFee: invoice.rentalFee ?? 0,
      previousElectricityNumber: invoice.currentElectricityNumber ?? 0,
      currentElectricityNumber: invoice.currentElectricityNumber ?? 0,
      previousWaterNumber: invoice.currentWaterNumber ?? 0,
      currentWaterNumber: invoice.currentWaterNumber ?? 0,
      electricityCharge: 0,
      waterCharge: 0,
      utilities: invoice.utilities ?? [],
      totalAmount: (invoice.rentalFee ?? 0) + utilitiesTotal,
    });

    await invoiceModel.insertMany([nextInvoice]);
    return invoice;
  };

  getFilteredInvoices = async (filters: {
    landLordId?: string;
    houseId?: string;
    month?: any;
    year?: any;
    status?: string;
  }) => {
    const { houseId, status, landLordId } = filters;
    const month = filters.month ? parseInt(filters.month) : undefined;
    const year = filters.year ? parseInt(filters.year) : undefined;

    const query: any = {};

    if (status && status !== "all") {
      if (status === "paid") {
        query.status = "completed";
      } else if (status === "unpaid") {
        query.status = { $in: ["processing", "payment-processing", "tenant-confirmed"] };
      }
    }

    if (month || year) {
      const y = year || new Date().getFullYear();
      const m = month || new Date().getMonth() + 1;
      const startDate = new Date(y, m - 1, 1);
      const endDate = new Date(y, m, 0, 23, 59, 59);
      query.createDate = { $gte: startDate, $lte: endDate };
    }

    const pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
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
    ];

    if (landLordId) {
      pipeline.push({
        $match: { "houseDetail.landlordId": new mongoose.Types.ObjectId(landLordId) },
      });
    }

    if (houseId && houseId !== "all") {
      pipeline.push({
        $match: { "roomDetail.houseId": new mongoose.Types.ObjectId(houseId) },
      });
    }

    pipeline.push({ $sort: { createDate: -1 } });

    pipeline.push({
      $project: {
        _id: 1,
        status: 1,
        utilities: 1,
        rentalFee: 1,
        previousElectricityNumber: 1,
        currentElectricityNumber: 1,
        previousWaterNumber: 1,
        currentWaterNumber: 1,
        electricityCharge: 1,
        waterCharge: 1,
        transactionImage: 1,
        totalAmount: 1,
        createDate: 1,
        roomId: {
          $mergeObjects: ["$roomDetail", { houseId: "$houseDetail" }],
        },
      },
    });

    return await invoiceModel.aggregate(pipeline);
  };

  updateInvoiceWithZalo = async (data: InvoiceZalo) => {
    const user = await userModel.findOne({ phoneNumber: data.phoneNumber });
    if (!user) throw new Error("User not found");

    const room_member = await roomMemberModel.findOne({ userId: user._id });
    if (!room_member) throw new Error("Room member not found");

    const invoice = await invoiceModel.findOne({
      roomId: room_member.roomId,
      status: "processing",
    });
    if (!invoice) throw new Error("No processing invoice found for this room");

    if (data.electricImage) {
      const res = await uploadImage(data.electricImage, 1, false);
      invoice.electricityImage = res.secure_url;
    }
    if (data.waterImage) {
      const res = await uploadImage(data.waterImage, 1, false);
      invoice.waterImage = res.secure_url;

      invoice.currentWaterNumber = Number(data.waterNumber);
      invoice.currentElectricityNumber = Number(data.electricNumber);

      await invoice.save();
      return invoice;
    }
  };
}
