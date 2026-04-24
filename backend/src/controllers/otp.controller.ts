import { Request, Response } from "express";
import { sendOtp, verifyOtp } from "../services/otp.service";

export async function sendOtpController(req: Request, res: Response) {
  const { email } = req.body;
  const result = await sendOtp(email);
  return res.json(result);
}

export async function verifyOtpController(req: Request, res: Response) {
  const { email, otp } = req.body;
  const result = await verifyOtp(email, otp);
  return res.json(result);
}