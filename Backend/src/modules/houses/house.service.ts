import { GenericService } from "../../core/services/base.service";
import houseModel, { IHouse } from "./house.model";
// import { uploadImage } from "../../utils/imageUtils";

export class houseService extends GenericService<IHouse> {
    constructor() {
        super(houseModel)
    }

    createNewHouse = async (data: Partial<IHouse>) => {
        const newHouse = new houseModel({
            ...data,
        })
        return (await houseModel.create(newHouse))
    };
}