import bcrypt from "bcryptjs";
import { FormModel } from "../models/Form";
import { ApiError } from "../utils/apiError";
import { generateSlug } from "../utils/generateSlug";
import { logAuditEvent } from "./audit.service";

export async function listFormsForUser(userId: string) {
  return FormModel.find({
    $or: [{ ownerId: userId }, { "collaborators.userId": userId }]
  })
    .sort({ updatedAt: -1 })
    .lean();
}

export async function createForm(userId: string, payload: any) {
  const accessPasswordHash = payload.settings.accessPassword
    ? await bcrypt.hash(payload.settings.accessPassword, 10)
    : undefined;

  const form = await FormModel.create({
    title: payload.title,
    description: payload.description,
    ownerId: userId,
    fields: payload.fields,
    collaborators: [{ userId, role: "owner" }],
    settings: {
      isPublished: false,
      customSlug: generateSlug(payload.settings.customSlug || payload.title),
      expiresAt: payload.settings.expiresAt,
      responseLimit: payload.settings.responseLimit,
      requireAuth: payload.settings.requireAuth,
      passwordProtected: payload.settings.passwordProtected,
      accessPasswordHash,
      allowResponseEditing: payload.settings.allowResponseEditing
    }
  });

  await logAuditEvent({
    actorId: userId,
    action: "form.created",
    entityType: "form",
    entityId: form.id,
    metadata: { title: form.title }
  });

  return form;
}

export async function getFormForOwner(formId: string, userId: string) {
  const form = await FormModel.findById(formId).lean();

  if (!form) {
    throw new ApiError(404, "Form not found.");
  }

  const hasAccess =
    form.ownerId.toString() === userId ||
    form.collaborators.some((entry) => entry.userId.toString() === userId);

  if (!hasAccess) {
    throw new ApiError(403, "You do not have access to this form.");
  }

  return form;
}

export async function updateForm(formId: string, userId: string, payload: any) {
  const currentForm = await getFormForOwner(formId, userId);
  const update: Record<string, unknown> = {};

  if (payload.title !== undefined) {
    update.title = payload.title;
  }

  if (payload.description !== undefined) {
    update.description = payload.description;
  }

  if (payload.fields !== undefined) {
    update.fields = payload.fields;
    update.version = currentForm.version + 1;
  }

  if (payload.settings?.customSlug) {
    update["settings.customSlug"] = generateSlug(payload.settings.customSlug);
  }

  if (payload.settings?.expiresAt !== undefined) {
    update["settings.expiresAt"] = payload.settings.expiresAt;
  }

  if (payload.settings?.responseLimit !== undefined) {
    update["settings.responseLimit"] = payload.settings.responseLimit;
  }

  if (payload.settings?.requireAuth !== undefined) {
    update["settings.requireAuth"] = payload.settings.requireAuth;
  }

  if (payload.settings?.passwordProtected !== undefined) {
    update["settings.passwordProtected"] = payload.settings.passwordProtected;
  }

  if (payload.settings?.allowResponseEditing !== undefined) {
    update["settings.allowResponseEditing"] = payload.settings.allowResponseEditing;
  }

  if (payload.settings?.accessPassword) {
    update["settings.accessPasswordHash"] = await bcrypt.hash(payload.settings.accessPassword, 10);
  }

  const form = await FormModel.findByIdAndUpdate(formId, update, { new: true }).lean();

  if (!form) {
    throw new ApiError(404, "Form not found.");
  }

  await logAuditEvent({
    actorId: userId,
    action: "form.updated",
    entityType: "form",
    entityId: formId
  });

  return form;
}

export async function publishForm(formId: string, userId: string) {
  await getFormForOwner(formId, userId);

  const form = await FormModel.findByIdAndUpdate(
    formId,
    {
      status: "published",
      "settings.isPublished": true
    },
    { new: true }
  ).lean();

  if (!form) {
    throw new ApiError(404, "Form not found.");
  }

  await logAuditEvent({
    actorId: userId,
    action: "form.published",
    entityType: "form",
    entityId: formId
  });

  return form;
}

export async function getPublicFormBySlug(slug: string) {
  const form = await FormModel.findOne({ "settings.customSlug": slug, status: "published" }).lean();

  if (!form) {
    throw new ApiError(404, "Published form not found.");
  }

  return form;
}
