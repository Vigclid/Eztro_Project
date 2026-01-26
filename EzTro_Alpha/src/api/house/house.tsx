import * as FileSystem from "expo-file-system/legacy";
import { apiService } from "../../service/apiService";
import { IHouse } from '../../types/house'
import { ApiResponse } from "../../types/app.common";

const houseApi = "v1/houses/";

export const getHouseApi = {

}

export const postHouseApi = {
    async createHouse(houseData: any) {
        try {
            const res = await apiService.post(
                houseApi,
                houseData
            ) 
            return res.data
        } catch (err: any) {
            throw err;
        }
    } 
}