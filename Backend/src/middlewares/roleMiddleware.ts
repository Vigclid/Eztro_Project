import { Request, Response, NextFunction } from "express";
import { responseWrapper } from "../interfaces/wrapper/ApiResponseWrapper";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export function authorize(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    
    if (!role || !roles.includes(role)) {
      return res.status(403).json(responseWrapper("error", "Unauthorized"));
    }
    next();
  };
}
