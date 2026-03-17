import { GenericService } from "../../core/services/base.service";
import houseModel, { IHouse } from "./house.model";
import mongoose from "mongoose";
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

    getHouseToDelete = async (landlordId: string) => {
        return await houseModel.aggregate([
            {
                $match: { landlordId: new mongoose.Types.ObjectId(landlordId) }
            },
            {
                $lookup: {
                    from: 'rooms',
                    localField: '_id',
                    foreignField: 'houseId',
                    as: 'rooms'
                }
            },
            {
                $project: {
                    _id: 1,
                    houseName: 1,
                    address: 1,
                    totalRooms: { $size: '$rooms' },
                    rentedRooms: {
                        $size: {
                            $filter: {
                                input: '$rooms',
                                as: 'room',
                                cond: { $eq: ['$$room.status', 'Đang Thuê'] }
                            }
                        }
                    }
                }
            }
        ])
    }

    deleteHouse = async (id: string) => {
        return await houseModel.findByIdAndDelete(id)
    }

    addUtilityCharge = async (houseId: string, utility: { key: string, value: number }) => {
        return await houseModel.findByIdAndUpdate(
            houseId,
            { $push: { defaultUtilitesCharge: utility } },
            { new: true }
        );
    };

    editUtilityCharge = async (houseId: string, oldKey: string, newUtility: { key: string, value: number }) => {
        return await houseModel.findOneAndUpdate(
            { _id: houseId, "defaultUtilitesCharge.key": oldKey },
            {
                $set: {
                    "defaultUtilitesCharge.$.key": newUtility.key,
                    "defaultUtilitesCharge.$.value": newUtility.value
                }
            },
            { new: true }
        );
    };

    removeUtilityCharge = async (houseId: string, key: string) => {
        return await houseModel.findByIdAndUpdate(
            houseId,
            { $pull: { defaultUtilitesCharge: { key: key } } },
            { new: true }
        );
    };
}