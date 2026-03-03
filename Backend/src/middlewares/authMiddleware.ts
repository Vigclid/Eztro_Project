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
  console.log('[AUTH MIDDLEWARE] Checking auth, header exists:', !!authHeader);
  
  const token = authHeader?.split(" ")[1];
  
  if (!token) {
    console.log('[AUTH MIDDLEWARE] No token, returning 401');
    return res.status(401).json(responseWrapper("error", "Token not found"));
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      console.log('[AUTH MIDDLEWARE] Token invalid:', err.message);
      return res.status(403).json(responseWrapper("error", "Invalid token"));
    }
    console.log('[AUTH MIDDLEWARE] Token valid, user role:', (decoded as any).role);
    req!.user = decoded as { id: number; role: string };
    next();
  });
}
