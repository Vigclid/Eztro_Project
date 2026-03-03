"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.houseController = void 0;
const base_controller_1 = require("../../core/controllers/base.controller");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiResponseWrapper_1 = require("../../interfaces/wrapper/ApiResponseWrapper");
class houseController extends base_controller_1.GenericController {
    constructor(houseService) {
        super(houseService);
        this.getHouseById = async (req, res) => {
            try {
                const { id } = req.params;
                const result = await this.HouseService.getHouseById(id);
                return res
                    .status(200)
                    .json((0, ApiResponseWrapper_1.responseWrapper)("success", "Thanh cong", result));
            }
            catch (err) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", err));
            }
        };
        this.getAllHousesByLandlordId = async (req, res) => {
            try {
                const { id } = jsonwebtoken_1.default.decode(req.headers["authorization"]?.split(" ")[1]);
                const result = await this.HouseService.getAllHousesByLandlordId(id);
                return res
                    .status(200)
                    .json((0, ApiResponseWrapper_1.responseWrapper)("success", "Thanh cong", result));
            }
            catch (err) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", err));
            }
        };
        this.createNewHouse = async (req, res) => {
            try {
                const { id } = jsonwebtoken_1.default.decode(req.headers["authorization"]?.split(" ")[1]);
                req.body.landlordId = id;
                const result = await this.HouseService.createNewHouse(req.body);
                return res
                    .status(201)
                    .json((0, ApiResponseWrapper_1.responseWrapper)("success", "Tạo Cụm Trọ Thành Công", result));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.HouseService = houseService;
    }
}
exports.houseController = houseController;
