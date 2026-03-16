import { GenericService } from "../../core/services/base.service";
import houseModel, { IHouse } from "./house.model";
// import { uploadImage } from "../../utils/imageUtils";

export class houseService extends GenericService<IHouse> {
    constructor() {
        super(houseModel)
    }

    getHouseById = async (id: string) => {
        return await houseModel.findById(id)
    }

    getAllHousesByLandlordId = async (landlordId: string) => {
        return await houseModel.find({ landlordId })
    }

    createNewHouse = async (data: Partial<IHouse>) => {
        const newHouse = new houseModel({
            ...data,
        })
        return (await houseModel.create(newHouse))
    };

    updateHouse = async (id: string, data: Partial<IHouse>) => {
        return await houseModel.findByIdAndUpdate(id, data, { new: true })
    }
}