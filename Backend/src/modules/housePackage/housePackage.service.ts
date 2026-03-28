import { GenericService } from "../../core/services/base.service";
import housePackageModel, { IHousePackage } from "./housePackage.model";
import packageModel, {IPackage} from "../package/package.model";

export class housePackageService extends GenericService<IHousePackage> {
    constructor() {
        super(housePackageModel)
    }

    createNewHousePackage = async (data: Partial<IHousePackage>) => {
        const packageInfo = await packageModel.findById(data.packageId);
        
        if (!packageInfo) {
            throw new Error("Package không tồn tại!");
        }

        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + packageInfo.duration);

        const newHousePackage = new housePackageModel({
            ...data,
            expirationDate,
        });

        return await newHousePackage.save();
    }

    updateHousePackageByHouseId = async (houseId: string, newPackageId: string) => {
        const [currentHousePackage, newPackage] = await Promise.all([
            housePackageModel.findOne({houseId: houseId}).populate('packageId'),
            packageModel.findById(newPackageId)
        ]);

        if (!currentHousePackage) throw new Error("Không tìm thấy gói của nhà trọ này!");
        if (!newPackage) throw new Error("Gói mới không tồn tại!");

        const currentPackage = currentHousePackage.packageId as IPackage;

        const now = new Date();
        const baseDate = currentHousePackage.expirationDate > now 
            ? new Date(currentHousePackage.expirationDate) 
            : now;

        baseDate.setMonth(baseDate.getMonth() + newPackage.duration);

        if (newPackage.price > currentPackage.price) {
            currentHousePackage.packageId = newPackage._id;
        }
        currentHousePackage.expirationDate = baseDate;

        return await currentHousePackage.save();
    }

    getCurrentHousePackageByHouseId = async (houseId: string) => {
        const now = new Date();

        const activePackage = await housePackageModel
            .findOne({
                houseId: houseId,
                expirationDate: { $gte: now },
            })
            .sort({ expirationDate: -1, createDate: -1 })
            .populate("packageId");

        if (activePackage) return activePackage;

        return housePackageModel
            .findOne({ houseId: houseId })
            .sort({ expirationDate: -1, createDate: -1 })
            .populate("packageId");
    }

    getAllHousePackages = async () => {
        return await housePackageModel
            .find()
            .populate("userId", "firstName lastName email")
            .populate("houseId", "houseName address")
            .populate("packageId", "packageName price duration maxRoom")
            .sort({ createDate: -1 });
    }

    getRevenueByMonth = async () => {
        const result = await housePackageModel.aggregate([
            {
                $lookup: {
                    from: "packages",
                    localField: "packageId",
                    foreignField: "_id",
                    as: "packageInfo"
                }
            },
            {
                $unwind: "$packageInfo"
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createDate" },
                        month: { $month: "$createDate" }
                    },
                    revenue: { $sum: "$packageInfo.price" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        return result;
    }

    getTotalRevenue = async () => {
        const result = await housePackageModel.aggregate([
            {
                $lookup: {
                    from: "packages",
                    localField: "packageId",
                    foreignField: "_id",
                    as: "packageInfo"
                }
            },
            {
                $unwind: "$packageInfo"
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$packageInfo.price" },
                    totalPackages: { $sum: 1 }
                }
            }
        ]);

        return result[0] || { totalRevenue: 0, totalPackages: 0 };
    }

    getRevenueByDay = async () => {
        const result = await housePackageModel.aggregate([
            {
                $lookup: {
                    from: "packages",
                    localField: "packageId",
                    foreignField: "_id",
                    as: "packageInfo"
                }
            },
            {
                $unwind: "$packageInfo"
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createDate" },
                        month: { $month: "$createDate" },
                        day: { $dayOfMonth: "$createDate" }
                    },
                    revenue: { $sum: "$packageInfo.price" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
            }
        ]);

        return result;
    }
}