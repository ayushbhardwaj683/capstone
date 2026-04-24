import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export async function registerController(req: Request, res: Response) {
  const payload = await registerUser(req.body);
  return res.status(201).json(payload);
}

export async function loginController(req: Request, res: Response) {
  const payload = await loginUser(req.body);
  return res.status(200).json(payload);
}
