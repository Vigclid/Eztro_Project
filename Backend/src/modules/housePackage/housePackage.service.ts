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
}