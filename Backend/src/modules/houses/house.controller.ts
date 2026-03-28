import { IHouse } from "./house.model";
import { GenericController } from "../../core/controllers/base.controller";
import { houseService } from "./house.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { housePackageService } from "../housePackage/housePackage.service";


export class houseController extends GenericController<IHouse> {
    private HouseService: houseService
    private HousePackageService: housePackageService
    constructor(houseService: houseService, housePackageService: housePackageService) {
        super(houseService)
        this.HouseService = houseService
        this.HousePackageService = housePackageService
    }

    getHouseById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this.HouseService.getHouseById(id)
            if (!result) {
                return res.status(404).json(responseWrapper("error", "Không tìm thấy cụm trọ"));
            }
            const housePackage = await this.HousePackageService.getCurrentHousePackageByHouseId(id);

            const houseData = (result as any)?.toObject?.() || result;
            const packageData: any = (housePackage as any)?.packageId;

            const payload = {
                ...houseData,
                housePackage: housePackage
                    ? {
                        _id: (housePackage as any)?._id,
                        expirationDate: (housePackage as any)?.expirationDate,
                        createDate: (housePackage as any)?.createDate,
                        isExpired: new Date((housePackage as any)?.expirationDate) < new Date(),
                        package: packageData
                            ? {
                                _id: packageData?._id,
                                packageName: packageData?.packageName,
                                description: packageData?.description,
                                price: packageData?.price,
                                maxRoom: packageData?.maxRoom,
                                duration: packageData?.duration,
                                createDate: packageData?.createDate,
                            }
                            : null,
                    }
                    : null,
            };
            return res
                .status(200)
                .json(responseWrapper("success", "Thanh cong", payload))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err))
        }
    }

    getAllHousesByLandlordId = async (req: Request, res: Response) => {
        try {
            const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
                id: string;
            };
            const result = await this.HouseService.getAllHousesByLandlordId(id)
            return res
                .status(200)
                .json(responseWrapper("success", "Thanh cong", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err))
        }
    }

    createNewHouse = async (req: Request, res: Response) => {
        try {
            const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
                id: string;
            };
            req.body.landlordId = id;
            const result = await this.HouseService.createNewHouse(req.body)
            await this.HousePackageService.createNewHousePackage({ userId: req.body.landlordId, houseId: result._id, packageId: req.body.packageId })
            return res
                .status(201)
                .json(responseWrapper("success", "Tạo Cụm Trọ Thành Công", result))
        } catch (error: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", error))
        }
    }

    updateHouse = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const result = await this.HouseService.updateHouse(id, req.body)
            return res
                .status(200)
                .json(responseWrapper("success", "Thanh cong", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err))
        }
    }

    getHouseToDelete = async (req: Request, res: Response) => {
        try {
            const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
                id: string;
            };
            const result = await this.HouseService.getHouseToDelete(id)
            return res
                .status(200)
                .json(responseWrapper("success", "Thanh cong", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err))
        }
    }

    deleteHouse = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const result = await this.HouseService.deleteHouse(id)
            return res
                .status(200)
                .json(responseWrapper("success", "Thanh cong", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err))
        }
    }

    updateUtility = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { action, utility, oldKey, key } = req.body;

            let result;
            if (action === 'create') {
                result = await this.HouseService.addUtilityCharge(id, utility);
            } else if (action === 'edit') {
                result = await this.HouseService.editUtilityCharge(id, oldKey, utility);
            } else if (action === 'remove') {
                result = await this.HouseService.removeUtilityCharge(id, key);
            }

            return res.status(200).json(responseWrapper("success", "Cập nhật phí dịch vụ thành công", result));
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err));
        }
    };
}
