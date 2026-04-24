// import type { Request, Response } from "express";
// import {
//   createForm,
//   getFormForOwner,
//   getPublicFormBySlug,
//   listFormsForUser,
//   publishForm,
//   updateForm
// } from "../services/form.service";
// import { getFormAnalytics } from "../services/analytics.service";

// export async function listFormsController(req: Request, res: Response) {
//   const forms = await listFormsForUser(req.user!.sub);
//   return res.status(200).json({ forms });
// }

// export async function createFormController(req: Request, res: Response) {
//   const form = await createForm(req.user!.sub, req.body);
//   return res.status(201).json({ form });
// }

// export async function getFormController(req: Request, res: Response) {
//   const formId = String(req.params.formId);
//   const form = await getFormForOwner(formId, req.user!.sub);
//   return res.status(200).json({ form });
// }

// export async function updateFormController(req: Request, res: Response) {
//   const formId = String(req.params.formId);
//   const form = await updateForm(formId, req.user!.sub, req.body);
//   return res.status(200).json({ form });
// }

// export async function publishFormController(req: Request, res: Response) {
//   const formId = String(req.params.formId);
//   const form = await publishForm(formId, req.user!.sub);
//   return res.status(200).json({ form });
// }

// export async function getPublicFormController(req: Request, res: Response) {
//   const slug = String(req.params.slug);
//   const form = await getPublicFormBySlug(slug);
//   return res.status(200).json({ form });
// }

// export async function getFormAnalyticsController(req: Request, res: Response) {
//   const formId = String(req.params.formId);
//   await getFormForOwner(formId, req.user!.sub);
//   const analytics = await getFormAnalytics(formId);
//   return res.status(200).json({ analytics });
// }








import type { Request, Response } from "express";
import {
  createForm,
  getFormForOwner,
  getPublicFormBySlug,
  listFormsForUser,
  publishForm,
  updateForm
} from "../services/form.service";
import { generateAiFormDraft } from "../services/ai-form.service";
import { getFormAnalytics } from "../services/analytics.service";
import { generateFormInsights } from "../services/insights.service";
import { listResponses } from "../services/response.service";

export async function listFormsController(req: Request, res: Response) {
  const forms = await listFormsForUser(req.user!.sub);
  return res.status(200).json({ forms });
}

export async function createFormController(req: Request, res: Response) {
  const form = await createForm(req.user!.sub, req.body);
  return res.status(201).json({ form });
}

export async function generateAiFormController(req: Request, res: Response) {
  const draft = await generateAiFormDraft(req.body);
  return res.status(200).json({ draft });
}

export async function getFormController(req: Request, res: Response) {
  const formId = String(req.params.formId);
  const form = await getFormForOwner(formId, req.user!.sub);
  return res.status(200).json({ form });
}

export async function updateFormController(req: Request, res: Response) {
  const formId = String(req.params.formId);
  const form = await updateForm(formId, req.user!.sub, req.body);
  return res.status(200).json({ form });
}

export async function publishFormController(req: Request, res: Response) {
  const formId = String(req.params.formId);
  const form = await publishForm(formId, req.user!.sub);
  return res.status(200).json({ form });
}

export async function getPublicFormController(req: Request, res: Response) {
  const slug = String(req.params.slug);
  const form = await getPublicFormBySlug(slug);

  if (!form) {
    return res.status(404).json({ message: "Form not found." });
  }

  // Check Form Expiry Date
  if (form.settings?.expiresAt) {
    if (new Date() > new Date(form.settings.expiresAt)) {
      return res.status(403).json({ message: "This form is no longer accepting responses (Expired)." });
    }
  }

  // Check Response Limit Capacity
  if (form.settings?.responseLimit && form.settings.responseLimit > 0) {
    const responses = await listResponses(String(form._id)); // Changed form.id to String(form._id)
    if (responses.length >= form.settings.responseLimit) {
      return res.status(403).json({ message: "This form has reached its maximum capacity for responses." });
    }
  }

  return res.status(200).json({ form });
}

export async function getFormAnalyticsController(req: Request, res: Response) {
  const formId = String(req.params.formId);
  await getFormForOwner(formId, req.user!.sub);
  const analytics = await getFormAnalytics(formId);
  return res.status(200).json({ analytics });
}

export async function generateFormInsightsController(req: Request, res: Response) {
  const formId = String(req.params.formId);
  await getFormForOwner(formId, req.user!.sub);
  const insights = await generateFormInsights(formId);
  return res.status(200).json({ insights });
}
