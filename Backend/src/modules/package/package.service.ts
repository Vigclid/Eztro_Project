import { GenericService } from "../../core/services/base.service";
import packageModel, {IPackage} from "./package.model";

export class packageService extends GenericService<IPackage> {
    constructor() {
        super(packageModel)
    }

    getAllPackages = async () => {
        return await packageModel.find();
    }

    getPackageById = async (id: string) => {
        return await packageModel.findById(id);
    }
}
