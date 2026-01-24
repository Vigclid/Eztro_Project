import { MailService } from "./mail.service";
import { Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { userService } from "../users/user.service";

export class MailController {
  static sendTokenMail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log("[MAIL] /v1/mail/token called with:", email);
      if (!email || email.trim() === "") {
        return res.status(400).json(responseWrapper("error", "Email is required"));
      }
      const emailExists = await new userService().getByEmail(String(email));
      if (emailExists === null) {
        return res.status(404).json(responseWrapper("error", "Email not found"));
      }
      console.log("[MAIL] Email exists, sending token...");
      const token = await MailService.generateAndSendToken(String(email));
      return res
        .status(200)
        .json(responseWrapper("success", "Token sent successfully", { token }));
    } catch (error: any) {
      console.error("[MAIL] sendTokenMail error:", error);
      return res
        .status(500)
        .json(responseWrapper("error", error?.message || "Internal Server Error"));
    }
  };
}
