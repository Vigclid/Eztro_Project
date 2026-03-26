import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import logModel from "../modules/logs/log.model";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now(); // thời gian bắt đầu request
  const hasBody = ["POST", "PUT", "PATCH"].includes(req.method);

  let safeBody: any = {};
  if (hasBody && req.body && Object.keys(req.body).length > 0) {
    safeBody = { ...req.body };
    const sensitiveFields = ["password", "token", "otp", "secret", "privateKey"];
    for (const field of sensitiveFields) {
      if (safeBody[field]) safeBody[field] = "***hidden***";
    }
  }

  res.on("finish", () => {
    const duration = Date.now() - start;
    const clientIp =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;

    const origin = req.headers.origin || "unknown";
    const host = req.headers.host || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    const logData = {
      timestamp: new Date(),
      level: res.statusCode >= 400 ? "error" : "info",
      message: "HTTP Request",
      meta: {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        response_time: duration,
        ip: clientIp,
        origin,
        host,
        userAgent,
        body: hasBody ? safeBody : null,
      },
    };

    // Log to Winston
    logger.info("HTTP Request", logData.meta);

    // Save to MongoDB
    logModel.create(logData).catch((err) => {
      console.error("Error saving log to database:", err);
    });
  });

  next();
};

export default loggerMiddleware;
