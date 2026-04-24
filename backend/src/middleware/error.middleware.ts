import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";

export function errorMiddleware(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
