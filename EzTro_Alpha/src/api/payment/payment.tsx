import { apiService } from "../../service/apiService";

const paymentApi = "v1/payments/";

export const getPaymentApi = {
  async getMyPaymentsAsTenant() {
    try {
      const res = await apiService.get(`${paymentApi}tenant/me`);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },
};
