import { IHouse } from "./house";
import { IPackage } from "./package";

export interface IPaymentPackage extends Document {
    _id: string;
    houseId: string | IHouse;
    packageId: IPackage;
    expirationDate: Date;
    createDate: Date;
}