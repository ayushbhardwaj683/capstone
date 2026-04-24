// import type { Request, Response } from "express";
// import { getFormForOwner } from "../services/form.service";
// import { listResponses, submitPublicResponse } from "../services/response.service";

// export async function listResponsesController(req: Request, res: Response) {
//   const formId = String(req.params.formId);
//   await getFormForOwner(formId, req.user!.sub);
//   const responses = await listResponses(formId);
//   return res.status(200).json({ responses });
// }

// export async function submitPublicResponseController(req: Request, res: Response) {
//   const slug = String(req.params.slug);
//   const response = await submitPublicResponse(slug, req.body, {
//     ipAddress: req.ip,
//     userAgent: req.get("user-agent") ?? undefined,
//     submittedBy: req.user?.sub
//   });

//   return res.status(201).json({ response });
// }








import type { Request, Response } from "express";
import { getFormForOwner, getPublicFormBySlug } from "../services/form.service";
import { listResponses, submitPublicResponse } from "../services/response.service";

export async function listResponsesController(req: Request, res: Response) {
  const formId = String(req.params.formId);
  await getFormForOwner(formId, req.user!.sub);
  const responses = await listResponses(formId);
  return res.status(200).json({ responses });
}

export async function submitPublicResponseController(req: Request, res: Response) {
  const slug = String(req.params.slug);

  // Fetch the form first to enforce limits on submission
  const form = await getPublicFormBySlug(slug);

  if (!form) {
    return res.status(404).json({ message: "Form not found." });
  }

  // Enforce Form Expiry Date on Submission
  if (form.settings?.expiresAt) {
    if (new Date() > new Date(form.settings.expiresAt)) {
      return res.status(403).json({ message: "Submission failed: This form has expired." });
    }
  }

  // Enforce Response Limit Capacity on Submission
  if (form.settings?.responseLimit && form.settings.responseLimit > 0) {
    const responses = await listResponses(String(form._id)); // Changed form.id to String(form._id)
    if (responses.length >= form.settings.responseLimit) {
      return res.status(403).json({ message: "Submission failed: This form is full." });
    }
  }

  // If validations pass, proceed with submission
  const response = await submitPublicResponse(slug, req.body, {
    ipAddress: req.ip,
    userAgent: req.get("user-agent") ?? undefined,
    submittedBy: req.user?.sub
  });

  return res.status(201).json({ response });
}