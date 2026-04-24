import { Router } from "express";
import { sendOtpController, verifyOtpController } from "../controllers/otp.controller";

export const otpRouter = Router();

otpRouter.post("/send", sendOtpController);
otpRouter.post("/verify", verifyOtpController);