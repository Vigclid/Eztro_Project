import * as FileSystem from "expo-file-system/legacy";
import { apiService } from "../../service/apiService";

const houseApi = "v1/houses/";

export const getHouseApi = {

    async getHouseById(houseId: string | undefined) {
        try {
            const res = await apiService.get(`${houseApi}${houseId}`)
            return res.data
        } catch (err: any) {
            throw err
        }
    },

    async getAllHousesByLandlordId() {
        try {
            const res = await apiService.get(houseApi)
            return res.data
        } catch (err: any) {
            throw err
        }
    }
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