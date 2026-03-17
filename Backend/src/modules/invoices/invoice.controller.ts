import { IInvoice, InvoiceZalo } from "./invoice.model";
import { GenericController } from "../../core/controllers/base.controller";
import { invoiceService } from "./invoice.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { toLocalPhone } from "../../utils/dateFormarter";
import axios from "axios";
import { GEMINI_AI } from "../../utils/AI";

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

  finalizeInvoices = async (req: Request, res: Response) => {
    const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
      id: string;
    };
    try {
      const { invoiceIds } = req.body as { invoiceIds: string[] };
      if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
        return res.status(400).json(responseWrapper("error", "invoiceIds là bắt buộc", null));
      }
      const result = await this.InvoiceService.finalizeInvoices(invoiceIds, id);
      return res.status(200).json(responseWrapper("success", "Chốt hóa đơn thành công", result));
    } catch (err: any) {
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };

  getProcessingInvoicesByHouse = async (req: Request, res: Response) => {
    try {
      const { houseId } = req.params;
      const result = await this.InvoiceService.getProcessingInvoicesByHouse(houseId);
      return res.status(200).json(responseWrapper("success", "Lấy danh sách thành công", result));
    } catch (err: any) {
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };

  updateProcessingInvoice = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.InvoiceService.updateProcessingInvoice(id, req.body);
      return res.status(200).json(responseWrapper("success", "Cập nhật thành công", result));
    } catch (err: any) {
      if (err.message === "INVOICE_NOT_FOUND_OR_INVALID_STATUS") {
        return res.status(404).json(responseWrapper("error", "Hóa đơn không hợp lệ", null));
      }
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };

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

  getMyProcessingInvoice = async (req: Request, res: Response) => {
    const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as { id: string };
    try {
      const result = await this.InvoiceService.getProcessingInvoiceForTenant(id);
      return res.status(200).json(responseWrapper("success", "Lấy thành công", result ?? null));
    } catch (err: any) {
      if (err.message === "ROOM_NOT_FOUND") {
        return res.status(404).json(responseWrapper("error", "Không tìm thấy phòng", null));
      }
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };

  tenantSubmitMeterReading = async (req: Request, res: Response) => {
    const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as { id: string };
    try {
      const { waterNumber, waterImage, electricNumber, electricImage } = req.body;
      const result = await this.InvoiceService.submitMeterReadingByTenant(id, {
        waterNumber,
        waterImage,
        electricNumber,
        electricImage,
      });
      return res.status(200).json(responseWrapper("success", "Cập nhật chỉ số thành công", result));
    } catch (err: any) {
      if (err.message === "ROOM_NOT_FOUND") {
        return res.status(404).json(responseWrapper("error", "Không tìm thấy phòng", null));
      }
      if (err.message === "INVOICE_NOT_FOUND") {
        return res.status(404).json(responseWrapper("error", "Không có hóa đơn đang xử lý", null));
      }
      res.status(500).json(responseWrapper("error", "Lỗi server", err));
    }
  };

  getMyInvoicesAsZaloTenant = async (req: Request, res: Response) => {
    try {
      const { accessToken, phoneToken } = req.body as { accessToken: string; phoneToken: string };
      const response = await axios.get("https://graph.zalo.me/v2.0/me/info", {
        params: {
          access_token: accessToken,
          code: phoneToken,
          secret_key: process.env.ZALO_SECRET_CODE,
        },
      });
      const phoneNumber = toLocalPhone(response.data.data.number);
      const result = await this.InvoiceService.getInvoicesForZaloUser(phoneNumber);
      return res.status(200).json(responseWrapper("success", "Lấy danh sách thành công", result));
    } catch (err: any) {
      return res.status(200).json(responseWrapper("error", err.message, null));
    }
  };

  zaloConfirmInvoice = async (req: Request, res: Response) => {
    try {
      const { accessToken, phoneToken, transactionImage } = req.body as {
        accessToken: string;
        phoneToken: string;
        transactionImage?: string;
      };
      const { id } = req.params;
      const response = await axios.get("https://graph.zalo.me/v2.0/me/info", {
        params: {
          access_token: accessToken,
          code: phoneToken,
          secret_key: process.env.ZALO_SECRET_CODE,
        },
      });
      const phoneNumber = toLocalPhone(response.data.data.number);
      const result = await this.InvoiceService.zaloTenantConfirmInvoice(phoneNumber, id, transactionImage);
      return res.status(200).json(responseWrapper("success", "Xác nhận thanh toán thành công", result));
    } catch (err: any) {
      return res.status(200).json(responseWrapper("error", err.message, null));
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

  verifyTransactionImage = async (req: Request, res: Response) => {
    try {
      const { image, invoiceAmount } = req.body as {
        image: string;
        invoiceAmount: number;
      };

      if (!image) {
        return res.status(400).json(responseWrapper("error", "Thiếu ảnh để kiểm tra", null));
      }

      // Tách phần base64 và lấy mimeType
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] ?? "image/jpeg";

      const prompt = `You are verifying a payment receipt image for a Vietnamese rental property management app.

    Analyze the image and answer:
    1. Does this image look like a bank transfer receipt, payment confirmation, or transaction screenshot? (Vietnamese banking apps like VCB, BIDV, Techcombank, MoMo, ZaloPay, etc.)
    2. Is there a transaction amount visible? If so, what is it (in VND)?
    3. Does the visible amount approximately match ${invoiceAmount?.toLocaleString("vi-VN")} VND? (Allow ±5% tolerance)

    Respond strictly with the following JSON format:
    {
      "isTransactionReceipt": boolean,
      "detectedAmount": number | null,
      "amountMatches": boolean,
      "message": "short Vietnamese message for the user (max 80 chars)"
    }`;
      const model = GEMINI_AI.genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();

      const parsedResult = JSON.parse(responseText);

      return res.status(200).json(responseWrapper("success", "Kiểm tra xong", parsedResult));
    } catch (err: any) {
      console.error("Gemini Error:", err);
      res.status(500).json(responseWrapper("error", "Lỗi kiểm tra ảnh", null));
    }
  };
}
