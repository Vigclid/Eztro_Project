import houseModel, { IHouse } from "./house.model";
import { GenericService } from "../../core/services/base.service";
import { GenericController } from "../../core/controllers/base.controller";

const houseService = new GenericService<IHouse>(houseModel)
export const houseController = new GenericController<IHouse>(houseService)