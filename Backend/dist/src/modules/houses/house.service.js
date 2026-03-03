"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.houseService = void 0;
const base_service_1 = require("../../core/services/base.service");
const house_model_1 = __importDefault(require("./house.model"));
// import { uploadImage } from "../../utils/imageUtils";
class houseService extends base_service_1.GenericService {
    constructor() {
        super(house_model_1.default);
        this.getHouseById = async (id) => {
            return await house_model_1.default.findById(id);
        };
        this.getAllHousesByLandlordId = async (landlordId) => {
            return await house_model_1.default.find({ landlordId });
        };
        this.createNewHouse = async (data) => {
            const newHouse = new house_model_1.default({
                ...data,
            });
            return (await house_model_1.default.create(newHouse));
        };
    }
}
exports.houseService = houseService;
