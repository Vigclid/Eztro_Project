import { GenericService } from "../../core/services/base.service";
import paymentPackageModel, { IPaymentPackage } from "./paymentPackage.model";

export class PaymentPackageService extends GenericService<IPaymentPackage> {
    constructor() {
        super(paymentPackageModel);
    }

    getPaymentPackageByUserId = async (userId: string) => {
        return await paymentPackageModel.find({ userId }).populate("packageId");
    }
}