import { IHousePackage } from "./housePackage.model";
import { GenericController } from "../../core/controllers/base.controller";
import { Request, Response } from "express";
import { housePackageService } from "./housePackage.service";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";

export class housePackageController extends GenericController<IHousePackage> {
    private HousePackageService: housePackageService
    constructor(housePackageService: housePackageService) {
        super(housePackageService)
        this.HousePackageService = housePackageService
    }

    createNewHousePackage = async (req: Request, res: Response) => {
        try {
            const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
                id: string;
            };
            req.body.userId = id
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

    getAllHousePackages = async (_req: Request, res: Response) => {
        try {
            const result = await this.HousePackageService.getAllHousePackages()
            return res
                .status(200)
                .json(responseWrapper("success", "Lấy danh sách gói nhà trọ thành công", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err));
        }
    }

    getRevenueByMonth = async (_req: Request, res: Response) => {
        try {
            const result = await this.HousePackageService.getRevenueByMonth()
            return res
                .status(200)
                .json(responseWrapper("success", "Lấy doanh thu theo tháng thành công", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err));
        }
    }

    getTotalRevenue = async (_req: Request, res: Response) => {
        try {
            const result = await this.HousePackageService.getTotalRevenue()
            return res
                .status(200)
                .json(responseWrapper("success", "Lấy tổng doanh thu thành công", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err));
        }
    }

    getRevenueByDay = async (_req: Request, res: Response) => {
        try {
            const result = await this.HousePackageService.getRevenueByDay()
            return res
                .status(200)
                .json(responseWrapper("success", "Lấy doanh thu theo ngày thành công", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err));
        }
    }
}