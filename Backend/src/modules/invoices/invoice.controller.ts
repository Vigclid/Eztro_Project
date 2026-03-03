import { IInvoice } from "./invoice.model";
import { GenericController } from "../../core/controllers/base.controller";
import { invoiceService } from "./invoice.service";
import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class invoiceController extends GenericController<IInvoice> {
    private InvoiceService: invoiceService
    constructor(invoiceService: invoiceService) {
        super(invoiceService)
        this.InvoiceService = invoiceService
    }

    getInvoiceById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this.InvoiceService.getInvoiceById(id)
            return res
                .status(200)
                .json(responseWrapper("success", "Thanh cong", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err))
        }
    }

    getAllInvoicesByRoomId = async (req: Request, res: Response) => {
        try {
            const { roomId } = req.params;
            const result = await this.InvoiceService.getAllInvoicesByRoomId(roomId)
            return res
                .status(200)
                .json(responseWrapper("success", "Thanh cong", result))
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", err))
        }
    }

    createNewInvoice = async (req: Request, res: Response) => {
        try {
            const result = await this.InvoiceService.createNewInvoice(req.body)
            return res
                .status(201)
                .json(responseWrapper("success", "Tạo Hóa Đơn Thành Công", result))
        } catch (error: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", error))
        }
    }

    createNewInvoices = async (req: Request, res: Response) => {
        try {
            const result = await this.InvoiceService.createNewInvoices(req.body)
            return res
                .status(201)
                .json(responseWrapper("success", "Tạo Hóa Đơn Thành Công", result))
        } catch (error: any) {
            res.status(500).json(responseWrapper("error", "Internal Server Error", error))
        }
    }

    getInvoicesByFilter = async (req: Request, res: Response) => {
        try {
            const filters = {
                houseId: req.query['params[houseId]'] as string,
                month: req.query['params[month]'] as string,
                year: req.query['params[year]'] as string,
                status: req.query['params[status]'] as string,
            };
            const result = await this.InvoiceService.getFilteredInvoices(filters);

            return res
                .status(200)
                .json(responseWrapper("success", "Lấy danh sách thành công", result));
        } catch (err: any) {
            res.status(500).json(responseWrapper("error", "Lỗi server", err));
        }
    }
}