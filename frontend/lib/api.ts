import type {
  AuthPayload,
  FormAnalytics,
  FormInsight,
  FormField,
  FormListItem,
  FormResponse,
  FormSchema
} from "@form-builder/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export interface FormMutationInput {
  title: string;
  description?: string;
  fields: FormField[];
  settings: {
    customSlug: string;
    expiresAt?: string;
    responseLimit?: number;
    requireAuth: boolean;
    passwordProtected: boolean;
    accessPassword?: string;
    allowResponseEditing?: boolean;
  };
}

export interface AiFormDraft {
  title: string;
  description: string;
  fields: FormField[];
  settings: {
    customSlug: string;
    requireAuth: boolean;
    passwordProtected: boolean;
  };
}

async function apiFetch<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: init.cache ?? "no-store"
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `API request failed with status ${response.status}`;

    throw new Error(message);
  }

  return payload as T;
}

function normalizeField(raw: any): FormField {
  return {
    id: String(raw.id ?? raw._id),
    type: raw.type,
    label: raw.label,
    description: raw.description ?? undefined,
    placeholder: raw.placeholder ?? undefined,
    required: Boolean(raw.required),
    options: Array.isArray(raw.options)
      ? raw.options.map((option: any) => ({
          id: String(option.id ?? option._id ?? option.value),
          label: String(option.label ?? option.value),
          value: String(option.value ?? option.label)
        }))
      : undefined,
    min: raw.min ?? undefined,
    max: raw.max ?? undefined,
    allowMultiple: raw.allowMultiple ?? undefined,
    rules: Array.isArray(raw.rules)
      ? raw.rules.map((rule: any) => ({
          sourceFieldId: String(rule.sourceFieldId),
          operator: rule.operator,
          value: rule.value
        }))
      : undefined
  };
}

function normalizeForm(raw: any): FormSchema {
  return {
    id: String(raw.id ?? raw._id),
    title: String(raw.title ?? "Untitled Form"),
    description: raw.description ?? undefined,
    ownerId: String(raw.ownerId?._id ?? raw.ownerId ?? ""),
    fields: Array.isArray(raw.fields) ? raw.fields.map(normalizeField) : [],
    collaborators: Array.isArray(raw.collaborators)
      ? raw.collaborators.map((entry: any) => ({
          userId: String(entry.userId?._id ?? entry.userId ?? ""),
          role: entry.role
        }))
      : [],
    settings: {
      isPublished: Boolean(raw.settings?.isPublished || raw.status === "published"),
      customSlug: String(raw.settings?.customSlug ?? ""),
      expiresAt: raw.settings?.expiresAt ? new Date(raw.settings.expiresAt).toISOString() : undefined,
      responseLimit: raw.settings?.responseLimit ?? undefined,
      requireAuth: Boolean(raw.settings?.requireAuth),
      passwordProtected: Boolean(raw.settings?.passwordProtected)
    },
    createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : new Date().toISOString()
  };
}

function normalizeResponse(raw: any): FormResponse {
  return {
    id: String(raw.id ?? raw._id),
    formId: String(raw.formId?._id ?? raw.formId ?? ""),
    submittedBy: raw.submittedBy ? String(raw.submittedBy?._id ?? raw.submittedBy) : undefined,
    answers: Array.isArray(raw.answers)
      ? raw.answers.map((answer: any) => ({
          fieldId: String(answer.fieldId),
          value: answer.value ?? null
        }))
      : [],
    submittedAt: raw.submittedAt ? new Date(raw.submittedAt).toISOString() : new Date().toISOString()
  };
}

function normalizeAnalytics(raw: any): FormAnalytics {
  return {
    totalResponses: Number(raw.totalResponses ?? 0),
    lastSubmissionAt: raw.lastSubmissionAt ? new Date(raw.lastSubmissionAt).toISOString() : undefined,
    responseTrend: Array.isArray(raw.responseTrend)
      ? raw.responseTrend.map((point: any) => ({
          label: String(point.label),
          count: Number(point.count ?? 0)
        }))
      : [],
    fieldBreakdown: Array.isArray(raw.fieldBreakdown)
      ? raw.fieldBreakdown.map((field: any) => ({
          fieldId: String(field.fieldId),
          label: String(field.label),
          type: String(field.type),
          options: Array.isArray(field.options)
            ? field.options.map((option: any) => ({
                label: String(option.label),
                value: String(option.value),
                count: Number(option.count ?? 0)
              }))
            : undefined
        }))
      : []
  };
}

function normalizeInsight(raw: any): FormInsight {
  return {
    summary: String(raw.summary ?? ""),
    bulletPoints: Array.isArray(raw.bulletPoints) ? raw.bulletPoints.map((item: unknown) => String(item)) : [],
    topCompliments: Array.isArray(raw.topCompliments) ? raw.topCompliments.map((item: unknown) => String(item)) : [],
    topConcerns: Array.isArray(raw.topConcerns) ? raw.topConcerns.map((item: unknown) => String(item)) : [],
    recommendation: String(raw.recommendation ?? ""),
    sentiment: raw.sentiment === "positive" || raw.sentiment === "negative" ? raw.sentiment : "mixed",
    analyzedResponses: Number(raw.analyzedResponses ?? 0),
    generatedAt: raw.generatedAt ? new Date(raw.generatedAt).toISOString() : new Date().toISOString()
  };
}

export async function loginRequest(input: { email: string; password: string }) {
  return apiFetch<AuthPayload>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function registerRequest(input: { name: string; email: string; password: string }) {
  return apiFetch<AuthPayload>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function listFormsRequest(token: string): Promise<FormListItem[]> {
  const payload = await apiFetch<{ forms: any[] }>("/forms", { method: "GET" }, token);

  return (payload.forms ?? []).map((form) => {
    const normalized = normalizeForm(form);
    return {
      id: normalized.id,
      title: normalized.title,
      customSlug: normalized.settings.customSlug,
      isPublished: normalized.settings.isPublished,
      createdAt: normalized.createdAt,
      updatedAt: normalized.updatedAt
    };
  });
}

export async function getFormRequest(formId: string, token: string): Promise<FormSchema> {
  const payload = await apiFetch<{ form: any }>(`/forms/${formId}`, { method: "GET" }, token);
  return normalizeForm(payload.form);
}

export async function createFormRequest(input: FormMutationInput, token: string): Promise<FormSchema> {
  const payload = await apiFetch<{ form: any }>("/forms", {
    method: "POST",
    body: JSON.stringify(input)
  }, token);

  return normalizeForm(payload.form);
}

export async function generateAiFormRequest(input: { topic: string; requirements?: string }, token: string): Promise<AiFormDraft> {
  const payload = await apiFetch<{ draft: any }>("/forms/ai-generate", {
    method: "POST",
    body: JSON.stringify(input)
  }, token);

  return {
    title: String(payload.draft?.title ?? "AI Generated Form"),
    description: String(payload.draft?.description ?? ""),
    fields: Array.isArray(payload.draft?.fields) ? payload.draft.fields.map(normalizeField) : [],
    settings: {
      customSlug: String(payload.draft?.settings?.customSlug ?? "ai-generated-form"),
      requireAuth: Boolean(payload.draft?.settings?.requireAuth),
      passwordProtected: Boolean(payload.draft?.settings?.passwordProtected)
    }
  };
}

export async function updateFormRequest(formId: string, input: Partial<FormMutationInput>, token: string): Promise<FormSchema> {
  const payload = await apiFetch<{ form: any }>(`/forms/${formId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  }, token);

  return normalizeForm(payload.form);
}

export async function publishFormRequest(formId: string, token: string): Promise<FormSchema> {
  const payload = await apiFetch<{ form: any }>(`/forms/${formId}/publish`, {
    method: "POST"
  }, token);

  return normalizeForm(payload.form);
}

export async function getFormResponsesRequest(formId: string, token: string): Promise<FormResponse[]> {
  const payload = await apiFetch<{ responses: any[] }>(`/forms/${formId}/responses`, { method: "GET" }, token);
  return (payload.responses ?? []).map(normalizeResponse);
}

export async function getFormAnalyticsRequest(formId: string, token: string): Promise<FormAnalytics> {
  const payload = await apiFetch<{ analytics: any }>(`/forms/${formId}/analytics`, { method: "GET" }, token);
  return normalizeAnalytics(payload.analytics);
}

export async function generateFormInsightsRequest(formId: string, token: string): Promise<FormInsight> {
  const payload = await apiFetch<{ insights: any }>(`/forms/${formId}/insights`, { method: "POST" }, token);
  return normalizeInsight(payload.insights);
}

// export async function getPublicFormRequest(slug: string): Promise<FormSchema> {
//   const payload = await apiFetch<{ form: any }>(`/public/forms/${slug}`, { method: "GET" });
//   return normalizeForm(payload.form);
// }

export async function getPublicFormRequest(slug: string): Promise<FormSchema> {
  const payload = await apiFetch<{ form: any }>(`/public/forms/${slug}`, { method: "GET" });
  return normalizeForm(payload.form);
}

export async function submitPublicResponseRequest(
  slug: string,
  answers: Array<{ fieldId: string; value: string | string[] | number | boolean | null }>
) {
  // return apiFetch<{ response: FormResponse }>(`/public/forms/${slug}/submit`, {
  return apiFetch<{ response: FormResponse }>(`/public/forms/${slug}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers })
  });
}
export async function sendOtpRequest(email: string) {
  return apiFetch<{ message: string }>("/auth/otp/send", {
    method: "POST",
    body: JSON.stringify({ email })
  });
}

export async function verifyOtpRequest(email: string, otp: string) {
  return apiFetch<{ verified: boolean }>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ email, otp })
  });
}
