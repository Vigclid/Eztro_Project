
import { apiService } from "../../service/apiService";

const invoiceApi = "v1/invoices/";

export const getInvoiceApi = {

    async getInvoiceById(invoiceId: string | undefined) {
        try {
            const res = await apiService.get(`${invoiceApi}${invoiceId}`)
            return res.data
        } catch (err: any) {
            throw err
        }
    },

    async getAllInvoicesByRoomId(roomId: string | undefined) {
        try {
            const res = await apiService.get(`${invoiceApi}room/${roomId}`)
            return res.data
        } catch (err: any) {
            throw err
        }
    },

    async getInvoicesByFilter(filter: any) {
        try {
            const res = await apiService.get(`${invoiceApi}filter/all`, { params: filter })
            return res.data
        } catch (err: any) {
            throw err
        }
    },

    async getRoomsForInvoiceCreation(houseId: string | undefined, signal?: AbortSignal) {
        try {
            const res = await apiService.get(`${invoiceApi}house/${houseId}`, { signal })
            return res.data
        } catch (err: any) {
            throw err
        }
    },

    async getMyInvoicesAsTenant() {
        try {
            const res = await apiService.get(`${invoiceApi}tenant/my`)
            return res.data
        } catch (err: any) {
            throw err
        }
    },
}

export const postInvoiceApi = {
    async createNewInvoice(invoiceData: any) {
        try {
            const res = await apiService.post(
                invoiceApi,
                invoiceData
            )
            return res.data
        } catch (err: any) {
            throw err;
        }
    },
    async createNewInvoices(invoicesData: any[]) {
        try {
            const res = await apiService.post(
                `${invoiceApi}create/many`,
                invoicesData
            )
            return res.data
        } catch (err: any) {
            throw err;
        }
    },
}

export const patchInvoiceApi = {
    // Landlord: finalize one or many invoices processing → payment-processing
    async finalizeInvoices(invoiceIds: string[]) {
        try {
            const res = await apiService.patch(`${invoiceApi}finalize/many`, { invoiceIds })
            return res.data
        } catch (err: any) {
            throw err;
        }
    },

    // Tenant: upload transaction image + confirm payment → tenant-confirmed
    async tenantConfirmInvoice(invoiceId: string, transactionImage?: string) {
        try {
            const res = await apiService.patch(`${invoiceApi}${invoiceId}/tenant-confirm`, {
                transactionImage,
            })
            return res.data
        } catch (err: any) {
            throw err;
        }
    },

    // Landlord: accept tenant-confirmed invoice → completed + auto-create next invoice
    async landlordAcceptInvoice(invoiceId: string) {
        try {
            const res = await apiService.patch(`${invoiceApi}${invoiceId}/accept`, {})
            return res.data
        } catch (err: any) {
            throw err;
        }
    },
}
