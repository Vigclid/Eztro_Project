import { IHouse } from "./house.model";
import { GenericController } from "../../core/controllers/base.controller";
import { houseService } from "./house.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class houseController extends GenericController<IHouse> {
    private HouseService: houseService
    constructor(houseService: houseService) {
        super(houseService)
        this.HouseService = houseService
    }

    createNewHouse = async (req: Request, res: Response) => {
        try {
            const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
                id: string;
            };
            req.body.landlordId = id;
            const result = await this.HouseService.createNewHouse(req.body)
            return res
                .status(201)
                .json(responseWrapper("success", "Tạo Cụm Trọ Thành Công", result))
        } catch (error: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", error))
        }
    }
}