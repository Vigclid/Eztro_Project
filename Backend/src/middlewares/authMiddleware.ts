import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { responseWrapper } from "../interfaces/wrapper/ApiResponseWrapper";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json(responseWrapper("error", "Token not found"));
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json(responseWrapper("error", "Invalid token"));
    }
    req!.user = decoded as { id: number; role: string };
    next();
  });
}
