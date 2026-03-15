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

    async getAllHousesByLandlordId(signal?: AbortSignal) {
        try {
            const res = await apiService.get(`${houseApi}landlord/all`, { signal })
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

export const putHouseApi = {

    async updateHouse(houseId: string, houseData: any) {
        try {
            const res = await apiService.put(
                `${houseApi}${houseId}`,
                houseData
            )
            return res.data
        } catch (err: any) {
            throw err;
        }
    }
}