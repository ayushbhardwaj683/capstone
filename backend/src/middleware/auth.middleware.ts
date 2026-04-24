import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing bearer token."));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, env.jwtSecret) as Request["user"];
    req.user = payload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token."));
  }
}
