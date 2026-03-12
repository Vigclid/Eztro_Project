import { IHousePackage } from "./housePackage.model";
import { GenericController } from "../../core/controllers/base.controller";
import { Request, Response } from "express";
import { housePackageService } from "./housePackage.service";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class housePackageController extends GenericController<IHousePackage> {
    private HousePackageService: housePackageService
    constructor(housePackageService: housePackageService) {
        super(housePackageService)
        this.HousePackageService = housePackageService
    }

    createNewHousePackage = async (req: Request, res: Response) => {
        try {
            const result = await this.HousePackageService.createNewHousePackage(req.body)
            return res
                .status(201)
                .json(responseWrapper("success", "Mua gói thành công", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err));
        }
    }

    updateHousePackageByHouseId = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const { newPackageId } = req.body
            const result = await this.HousePackageService.updateHousePackageByHouseId(id, newPackageId)
            return res
                .status(200)
                .json(responseWrapper("success", "Thanh cong cap nhat", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err));
        }
    }
}