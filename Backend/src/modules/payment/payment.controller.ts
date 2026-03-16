import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { paymentService } from "./payment.service";

const PaymentService = new paymentService();

export const getMyPaymentsAsTenant = async (req: Request, res: Response) => {
  const { id } = jwt.decode(
    req.headers["authorization"]?.split(" ")[1] as string
  ) as { id: string };
  try {
    const result = await PaymentService.getPaymentsByTenant(id);
    return res
      .status(200)
      .json(
        responseWrapper("success", "Lấy lịch sử thanh toán thành công", result)
      );
  } catch (err: any) {
    res.status(500).json(responseWrapper("error", "Lỗi server", err));
  }
};
