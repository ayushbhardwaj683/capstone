import { Router } from "express";
import { loginController, registerController } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validateBody } from "../middleware/validation.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validators";
import { otpRouter } from "./otp.routes";

export const authRouter = Router();
authRouter.use("/otp", otpRouter);
authRouter.post("/register", validateBody(registerSchema), asyncHandler(registerController));
authRouter.post("/login", validateBody(loginSchema), asyncHandler(loginController));
