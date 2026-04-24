import { Router } from "express";
import {
  createFormController,
  generateAiFormController,
  getFormAnalyticsController,
  getFormController,
  getPublicFormController,
  generateFormInsightsController,
  listFormsController,
  publishFormController,
  updateFormController
} from "../controllers/form.controller";
import { listResponsesController } from "../controllers/response.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { validateBody } from "../middleware/validation.middleware";
import { aiGenerateFormSchema } from "../validators/ai.validators";
import { createFormSchema, updateFormSchema } from "../validators/form.validators";

export const formRouter = Router();
export const publicFormRouter = Router();

formRouter.use(requireAuth);
formRouter.get("/", asyncHandler(listFormsController));
formRouter.post("/ai-generate", validateBody(aiGenerateFormSchema), asyncHandler(generateAiFormController));
formRouter.post("/", validateBody(createFormSchema), asyncHandler(createFormController));
formRouter.get("/:formId", asyncHandler(getFormController));
formRouter.patch("/:formId", validateBody(updateFormSchema), asyncHandler(updateFormController));
formRouter.post("/:formId/publish", asyncHandler(publishFormController));
formRouter.get("/:formId/responses", asyncHandler(listResponsesController));
formRouter.get("/:formId/analytics", asyncHandler(getFormAnalyticsController));
formRouter.post("/:formId/insights", asyncHandler(generateFormInsightsController));

publicFormRouter.get("/:slug", asyncHandler(getPublicFormController));
