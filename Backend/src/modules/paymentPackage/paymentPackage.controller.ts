import { Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { PaymentPackageService } from "./paymentPackage.service";
import { IPaymentPackage } from "./paymentPackage.model";
import { GenericController } from "../../core/controllers/base.controller";
import jwt from "jsonwebtoken";

export class paymentPackageController extends GenericController<IPaymentPackage> {
    private PaymentPackageService: PaymentPackageService

    constructor(paymentPackageService: PaymentPackageService) {
        super(paymentPackageService);
        this.PaymentPackageService = paymentPackageService;
    }

    getPaymentPackageByUserId = async (req: Request, res: Response) => {
        try {
            const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
                id: string;
            };
            const result = await this.PaymentPackageService.getPaymentPackageByUserId(id);
            return res.status(200).json(responseWrapper("success", "Thanh cong", result));
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err));
        }
    }
}
