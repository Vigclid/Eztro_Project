import { IPackage } from "./package.model";
import { GenericController } from "../../core/controllers/base.controller";
import { Request, Response } from "express";
import { packageService } from "./package.service";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class packageController extends GenericController<IPackage> {
    private PackageService: packageService
    constructor(packageService: packageService) {
        super(packageService)
        this.PackageService = packageService
    }

    getAllPackage = async (_req: Request, res: Response) => {
        try {
            const result = await this.PackageService.getAllPackages()
            return res
                .status(200)
                .json(responseWrapper("success", "Thanh cong", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err))
        }
    }

    getPackageById = async (req: Request, res: Response) => {
        try{
            const {id} = req.params
            const result = await this.PackageService.getPackageById(id)
            return res
            .status(200)
            .json(responseWrapper("success", "Thanh Cong", result));
        } catch(err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err))
        }
    }
}