import { FormModel } from "../models/Form";
import { ResponseModel } from "../models/Response";
import { ApiError } from "../utils/apiError";
import { logAuditEvent } from "./audit.service";

export async function listResponses(formId: string) {
  return ResponseModel.find({ formId }).sort({ submittedAt: -1 }).lean();
}

export async function submitPublicResponse(
  slug: string,
  payload: { answers: Array<{ fieldId: string; value: unknown }> },
  meta: { ipAddress?: string; userAgent?: string; submittedBy?: string }
) {
  const form = await FormModel.findOne({ "settings.customSlug": slug, status: "published" });

  if (!form) {
    throw new ApiError(404, "Published form not found.");
  }

  if (form.settings.expiresAt && form.settings.expiresAt.getTime() < Date.now()) {
    throw new ApiError(410, "This form has expired.");
  }

  if (form.settings.responseLimit) {
    const responseCount = await ResponseModel.countDocuments({ formId: form.id });
    if (responseCount >= form.settings.responseLimit) {
      throw new ApiError(409, "This form has reached its response limit.");
    }
  }

  const response = await ResponseModel.create({
    formId: form.id,
    submittedBy: meta.submittedBy,
    answers: payload.answers,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent
  });

  await logAuditEvent({
    actorId: meta.submittedBy,
    action: "response.submitted",
    entityType: "form",
    entityId: form.id,
    metadata: { responseId: response.id }
  });

  return response;
}
