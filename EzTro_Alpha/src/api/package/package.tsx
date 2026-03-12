import { apiService } from "../../service/apiService";

const packageApi = "v1/packages/";

export const getPackageApi = {

    async getAllPackages() {
        try {
            const res = await apiService.get(`${packageApi}`)
            return res.data
        } catch (err: any) {
            throw err
        }
    },

    async getPackageById(id: string | undefined) {
        try {
            const res = await apiService.get(`${packageApi}${id}`)
            return res.data
        } catch (err: any) {
            throw err
        }
    }
}