import { IInvoice, InvoiceZalo } from "./invoice.model";
import { GenericController } from "../../core/controllers/base.controller";
import { invoiceService } from "./invoice.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { toLocalPhone } from "../../utils/dateFormarter";
import axios from "axios";

export class invoiceController extends GenericController<IInvoice> {
  private InvoiceService: invoiceService;
  constructor(invoiceService: invoiceService) {
    super(invoiceService);
    this.InvoiceService = invoiceService;
  }

  getInvoiceById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.InvoiceService.getInvoiceById(id);
      return res.status(200).json(responseWrapper("success", "Thanh cong", result));
    } catch (err: any) {
      res.status(500).json(responseWrapper("error", "Internal Server Error", err));
    }
  };

  getAllInvoicesByRoomId = async (req: Request, res: Response) => {
    try {
      const { roomId } = req.params;
      const result = await this.InvoiceService.getAllInvoicesByRoomId(roomId);
      return res.status(200).json(responseWrapper("success", "Thanh cong", result));
    } catch (err: any) {
      res.status(500).json(responseWrapper("error", "Internal Server Error", err));
    }
  };

  createNewInvoice = async (req: Request, res: Response) => {
    try {
      const result = await this.InvoiceService.createNewInvoice(req.body);
      return res.status(201).json(responseWrapper("success", "Tạo Hóa Đơn Thành Công", result));
    } catch (error: any) {
      res.status(500).json(responseWrapper("error", "Internal Server Error", error));
    }
  };

  createNewInvoices = async (req: Request, res: Response) => {
    try {
      const result = await this.InvoiceService.createNewInvoices(req.body);
      return res.status(201).json(responseWrapper("success", "Tạo Hóa Đơn Thành Công", result));
    } catch (error: any) {
      res.status(500).json(responseWrapper("error", "Internal Server Error", error));
    }
  };

  // PATCH /finalize/many — Landlord finalizes one or many invoices: processing → payment-processing
  finalizeInvoices = async (req: Request, res: Response) => {
    try {
      const { invoiceIds } = req.body as { invoiceIds: string[] };
      if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
        return res.status(400).json(responseWrapper("error", "invoiceIds là bắt buộc", null));
      }
      const result = await this.InvoiceService.finalizeInvoices(invoiceIds);
      return res.status(200).json(responseWrapper("success", "Chốt hóa đơn thành công", result));
    } catch (err: any) {
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };

  // GET /tenant/my — Tenant fetches their pending invoices
  getMyInvoicesAsTenant = async (req: Request, res: Response) => {
    const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
      id: string;
    };
    try {
      const result = await this.InvoiceService.getInvoicesByTenant(id);
      return res.status(200).json(responseWrapper("success", "Lấy danh sách thành công", result));
    } catch (err: any) {
      if (err.message === "ROOM_NOT_FOUND") {
        return res.status(404).json(responseWrapper("error", "Không tìm thấy phòng", null));
      }
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };

  // PATCH /:id/tenant-confirm — Tenant confirms payment with transaction image
  tenantConfirmInvoice = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { transactionImage } = req.body as { transactionImage?: string };
      const result = await this.InvoiceService.tenantConfirmInvoice(id, transactionImage);
      return res
        .status(200)
        .json(responseWrapper("success", "Xác nhận thanh toán thành công", result));
    } catch (err: any) {
      if (err.message === "INVOICE_NOT_FOUND_OR_INVALID_STATUS") {
        return res.status(404).json(responseWrapper("error", "Hóa đơn không hợp lệ", null));
      }
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };

  // PATCH /:id/accept — Landlord accepts tenant-confirmed invoice → completed + auto-creates next invoice
  landlordAcceptInvoice = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.InvoiceService.landlordAcceptInvoice(id);
      return res
        .status(200)
        .json(responseWrapper("success", "Xác nhận thu tiền thành công", result));
    } catch (err: any) {
      if (err.message === "INVOICE_NOT_FOUND_OR_INVALID_STATUS") {
        return res.status(404).json(responseWrapper("error", "Hóa đơn không hợp lệ", null));
      }
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };

  getInvoicesByFilter = async (req: Request, res: Response) => {
    const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
      id: string;
    };
    try {
      const filters = {
        landLordId: id,
        houseId: req.query["params[houseId]"] as string,
        month: req.query["params[month]"] as string,
        year: req.query["params[year]"] as string,
        status: req.query["params[status]"] as string,
      };
      const result = await this.InvoiceService.getFilteredInvoices(filters);
      return res.status(200).json(responseWrapper("success", "Lấy danh sách thành công", result));
    } catch (err: any) {
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };

  receiveInvocieFromZalo = async (req: Request, res: Response) => {
    try {
      const InvoiceBody = req.body as InvoiceZalo;
      const response = await axios.get("https://graph.zalo.me/v2.0/me/info", {
        params: {
          access_token: InvoiceBody.accessToken,
          code: InvoiceBody.phoneToken,
          secret_key: process.env.ZALO_SECRET_CODE,
        },
      });
      const phoneNumber = response.data.data.number;
      const result = await this.InvoiceService.updateInvoiceWithZalo({
        ...InvoiceBody,
        phoneNumber: toLocalPhone(phoneNumber),
      });
      return res
        .status(200)
        .json(responseWrapper("success", "Cập nhật hóa đơn thành công", result));
    } catch (err: any) {
      return res.status(200).json(responseWrapper("error", err.message, null));
    }
  };

  getRoomsForInvoiceCreation = async (req: Request, res: Response) => {
    try {
      const { houseId } = req.params;
      const result = await this.InvoiceService.getRoomsForInvoiceCreation(houseId);
      return res.status(200).json(responseWrapper("success", "Lấy danh sách phòng", result));
    } catch (err: any) {
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };
}
