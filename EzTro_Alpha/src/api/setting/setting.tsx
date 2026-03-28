import { apiService } from "../../service/apiService";

const settingApi = "v1/settings";

export const getSettingApi = {

    async getMySetting(signal?: AbortSignal) {
        try {
            const res = await apiService.get(`${settingApi}/me`, { signal })
            return res.data
        } catch (err: any) {
            throw err
        }
    }
}

export const patchSettingApi = {
    async updateSetting(data: any) {
        try {
            const res = await apiService.patch(`${settingApi}/me`, data)
            return res.data
        } catch (err: any) {
            throw err
        }
    }
}