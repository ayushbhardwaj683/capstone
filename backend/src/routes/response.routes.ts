import { Router } from "express";
import { submitPublicResponseController } from "../controllers/response.controller";
import { publicSubmissionLimiter } from "../middleware/rateLimiter";
import { asyncHandler } from "../utils/asyncHandler";
import { validateBody } from "../middleware/validation.middleware";
import { submitResponseSchema } from "../validators/form.validators";

export const responseRouter = Router();

responseRouter.post("/:slug/submit", publicSubmissionLimiter, validateBody(submitResponseSchema), asyncHandler(submitPublicResponseController));
