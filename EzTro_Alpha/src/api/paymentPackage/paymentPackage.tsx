import { apiService } from "../../service/apiService";

const paymentPackageApi = "v1/paymentPackages/";

export const getPaymentPackageApi = {
    async getPaymentPackageByUserId() {
        try {
            const res = await apiService.get(`${paymentPackageApi}me`);
            return res.data;

        } catch (err: any) {
            throw err;
        }
    },
    
}