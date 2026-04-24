import { env } from "../config/env";
import { ApiError } from "../utils/apiError";

type FieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "number"
  | "select"
  | "multi_select"
  | "checkbox"
  | "date"
  | "time"
  | "rating"
  | "linear_scale"
  | "file_upload"
  | "signature";

interface AiGeneratedField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  min?: number;
  max?: number;
}

interface AiGeneratedFormDraft {
  title: string;
  description: string;
  fields: AiGeneratedField[];
  settings: {
    customSlug: string;
    requireAuth: boolean;
    passwordProtected: boolean;
  };
}

function stripCodeFence(value: string) {
  return value.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function normalizeGeneratedDraft(raw: any): AiGeneratedFormDraft {
  const validTypes: FieldType[] = [
    "short_text",
    "long_text",
    "email",
    "phone",
    "number",
    "select",
    "multi_select",
    "checkbox",
    "date",
    "time",
    "rating",
    "linear_scale",
    "file_upload",
    "signature"
  ];

  const fields = Array.isArray(raw?.fields)
    ? raw.fields
        .map((field: any, index: number) => {
          const type = validTypes.includes(field?.type) ? field.type : "short_text";
          const options = Array.isArray(field?.options)
            ? field.options.map((option: any, optionIndex: number) => ({
                id: String(option?.id ?? `option_${index + 1}_${optionIndex + 1}`),
                label: String(option?.label ?? option?.value ?? `Option ${optionIndex + 1}`),
                value: String(option?.value ?? option?.label ?? `option_${optionIndex + 1}`)
              }))
            : undefined;

          return {
            id: String(field?.id ?? `field_${index + 1}`),
            type,
            label: String(field?.label ?? `Question ${index + 1}`),
            description: field?.description ? String(field.description) : undefined,
            placeholder: field?.placeholder ? String(field.placeholder) : undefined,
            required: Boolean(field?.required),
            options: options?.length ? options : undefined,
            min: typeof field?.min === "number" ? field.min : undefined,
            max: typeof field?.max === "number" ? field.max : undefined
          };
        })
        .slice(0, 15)
    : [];

  const title = String(raw?.title ?? "AI Generated Form");

  return {
    title,
    description: String(raw?.description ?? "Generated from your topic and requirements."),
    fields,
    settings: {
      customSlug: slugify(String(raw?.settings?.customSlug ?? title)) || "ai-generated-form",
      requireAuth: Boolean(raw?.settings?.requireAuth),
      passwordProtected: Boolean(raw?.settings?.passwordProtected)
    }
  };
}

export async function generateAiFormDraft(input: { topic: string; requirements?: string }) {
  if (!env.geminiApiKey) {
    throw new ApiError(503, "GEMINI_API_KEY is missing. Add it to generate AI forms.");
  }

  const prompt = {
    task: "Generate a form draft for a form builder app.",
    topic: input.topic,
    requirements: input.requirements ?? "",
    instructions: [
      "Return valid JSON only.",
      "Create a clear title and short description.",
      "Generate between 4 and 10 useful questions.",
      "Use realistic field types from the allowed list.",
      "Add options for select and multi_select fields.",
      "Keep the form practical and ready for manual editing."
    ],
    allowedFieldTypes: [
      "short_text",
      "long_text",
      "email",
      "phone",
      "number",
      "select",
      "multi_select",
      "checkbox",
      "date",
      "time",
      "rating",
      "linear_scale"
    ],
    expectedJsonShape: {
      title: "string",
      description: "string",
      fields: [
        {
          id: "string",
          type: "field type",
          label: "string",
          description: "optional string",
          placeholder: "optional string",
          required: true,
          options: [{ id: "string", label: "string", value: "string" }]
        }
      ],
      settings: {
        customSlug: "string",
        requireAuth: false,
        passwordProtected: false
      }
    }
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      generationConfig: {
        temperature: 0.35,
        responseMimeType: "application/json"
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: JSON.stringify(prompt)
            }
          ]
        }
      ]
    })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? String((payload as { error?: { message?: string } }).error?.message ?? "Failed to generate AI form.")
        : "Failed to generate AI form.";

    throw new ApiError(response.status, message);
  }

  const content = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof content !== "string") {
    throw new ApiError(502, "The AI provider returned an empty form draft.");
  }

  try {
    return normalizeGeneratedDraft(JSON.parse(stripCodeFence(content)));
  } catch {
    throw new ApiError(502, "The AI provider returned an invalid form draft payload.");
  }
}
