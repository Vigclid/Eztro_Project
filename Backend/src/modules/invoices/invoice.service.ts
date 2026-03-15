import { GenericService } from "../../core/services/base.service";
import { uploadImage } from "../../utils/imageUtils";
import roomMemberModel from "../rooms/roomMember.model";
import userModel from "../users/user.model";
import invoiceModel, { IInvoice, InvoiceZalo } from "./invoice.model";
import mongoose, { PipelineStage } from "mongoose";
import roomModel from "../rooms/room.model";


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

  getFilteredInvoices = async (filters: {
    landLordId?: string; // Thêm tham số này vào filter
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
      query.status = status === "paid" ? "completed" : "processing";
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
        previousElectricityNumber: 1,
        currentElectricityNumber: 1,
        previousWaterNumber: 1,
        currentWaterNumber: 1,
        electricityCharge: 1,
        waterCharge: 1,
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
    }

    invoice.currentWaterNumber = Number(data.waterNumber);
    invoice.currentElectricityNumber = Number(data.electricNumber);

    await invoice.save();
    return invoice;
  };

  getRoomsForInvoiceCreation = async (houseId: string) => {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          houseId: new mongoose.Types.ObjectId(houseId),
        },
      },
      {
        $lookup: {
          from: "houses",
          localField: "houseId",
          foreignField: "_id",
          as: "houseInfo",
        },
      },
      { $unwind: "$houseInfo" },
      {
        $lookup: {
          from: "room_members",
          let: { roomId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$roomId", "$$roomId"] },
                role: "TENANT",
                status: "Đang Thuê",
              },
            },
          ],
          as: "realTenantMember",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "realTenantMember.userId",
          foreignField: "_id",
          as: "realTenantUser",
        },
      },
      {
        $lookup: {
          from: "invoices",
          let: { roomId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$roomId", "$$roomId"] } } },
            { $sort: { createDate: -1 } },
            { $limit: 1 },
          ],
          as: "latestInvoice",
        },
      },
      // BƯỚC TRUNG GIAN: Xử lý hết các giá trị null/undefined và tính Usage
      {
        $addFields: {
          safePreviousElectricity: {
            $ifNull: [{ $arrayElemAt: ["$latestInvoice.currentElectricityNumber", 0] }, 0]
          },
          safePreviousWater: {
            $ifNull: [{ $arrayElemAt: ["$latestInvoice.currentWaterNumber", 0] }, 0]
          },
          safeCurrentElectricity: { $ifNull: ["$currentElectricityNumber", 0] },
          safeCurrentWater: { $ifNull: ["$currentWaterNumber", 0] },
          safeElectricityPrice: { $ifNull: ["$houseInfo.defaultElectricityCharge", 0] },
          safeWaterPrice: { $ifNull: ["$houseInfo.defaultWaterCharge", 0] },
          safeRentalFee: { $ifNull: ["$rentalFee", 0] }
        }
      },
      {
        $addFields: {
          calcElectricityUsage: {
            $max: [{ $subtract: ["$safeCurrentElectricity", "$safePreviousElectricity"] }, 0]
          },
          calcWaterUsage: {
            $max: [{ $subtract: ["$safeCurrentWater", "$safePreviousWater"] }, 0]
          },
          calcUtilitiesCost: {
            $cond: {
              if: { $isArray: "$houseInfo.defaultUtilitesCharge" },
              then: { $sum: "$houseInfo.defaultUtilitesCharge.value" },
              else: 0
            }
          }
        }
      },
      // BƯỚC CUỐI: Project kết quả sạch
      {
        $project: {
          roomId: "$_id",
          roomName: "$roomName",
          rentalFee: "$safeRentalFee",
          tenantName: {
            $cond: {
              if: { $gt: [{ $size: "$realTenantUser" }, 0] },
              then: {
                $concat: [
                  { $arrayElemAt: ["$realTenantUser.lastName", 0] },
                  " ",
                  { $arrayElemAt: ["$realTenantUser.firstName", 0] },
                ],
              },
              else: {
                $cond: {
                  if: { $gt: [{ $size: "$virtualTenants" }, 0] },
                  then: { $arrayElemAt: ["$virtualTenants.tenantName", 0] },
                  else: "Chưa có thông tin",
                },
              },
            },
          },

          electricityPrice: "$safeElectricityPrice",
          waterPrice: "$safeWaterPrice",
          utilities: { $ifNull: ["$houseInfo.defaultUtilitesCharge", []] },

          previousElectricityNumber: "$safePreviousElectricity",
          previousWaterNumber: "$safePreviousWater",
          currentElectricityNumber: "$safeCurrentElectricity",
          currentWaterNumber: "$safeCurrentWater",

          electricityUsage: "$calcElectricityUsage",
          waterUsage: "$calcWaterUsage",

          electricityCost: { $multiply: ["$calcElectricityUsage", "$safeElectricityPrice"] },
          waterCost: { $multiply: ["$calcWaterUsage", "$safeWaterPrice"] },
          utilitiesCost: "$calcUtilitiesCost",

          totalAmount: {
            $add: [
              "$safeRentalFee",
              { $multiply: ["$calcElectricityUsage", "$safeElectricityPrice"] },
              { $multiply: ["$calcWaterUsage", "$safeWaterPrice"] },
              "$calcUtilitiesCost"
            ]
          },
        },
      },
    ];

    return await roomModel.aggregate(pipeline);
  };
}
