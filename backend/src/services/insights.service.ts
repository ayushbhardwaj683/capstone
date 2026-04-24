import { env } from "../config/env";
import { FormModel } from "../models/Form";
import { ResponseModel } from "../models/Response";
import { ApiError } from "../utils/apiError";
import { getFormAnalytics } from "./analytics.service";

interface FormInsight {
  summary: string;
  bulletPoints: string[];
  topCompliments: string[];
  topConcerns: string[];
  recommendation: string;
  sentiment: "positive" | "mixed" | "negative";
  analyzedResponses: number;
  generatedAt: string;
}

function stripCodeFence(value: string) {
  return value.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

function normalizeInsight(raw: any, analyzedResponses: number): FormInsight {
  const sentiment = raw?.sentiment;

  return {
    summary: typeof raw?.summary === "string" ? raw.summary : "AI summary unavailable.",
    bulletPoints: Array.isArray(raw?.bulletPoints) ? raw.bulletPoints.map((item: unknown) => String(item)).slice(0, 5) : [],
    topCompliments: Array.isArray(raw?.topCompliments) ? raw.topCompliments.map((item: unknown) => String(item)).slice(0, 4) : [],
    topConcerns: Array.isArray(raw?.topConcerns) ? raw.topConcerns.map((item: unknown) => String(item)).slice(0, 4) : [],
    recommendation: typeof raw?.recommendation === "string" ? raw.recommendation : "Review the repeated concerns and improve the lowest-rated experience areas first.",
    sentiment: sentiment === "positive" || sentiment === "mixed" || sentiment === "negative" ? sentiment : "mixed",
    analyzedResponses: Number(raw?.analyzedResponses ?? analyzedResponses),
    generatedAt: new Date().toISOString()
  };
}

export async function generateFormInsights(formId: string): Promise<FormInsight> {
  if (!env.geminiApiKey) {
    throw new ApiError(503, "GEMINI_API_KEY is missing. Add it to generate AI insights.");
  }

  const form = await FormModel.findById(formId).lean();

  if (!form) {
    throw new ApiError(404, "Form not found.");
  }

  const responses = await ResponseModel.find({ formId }).sort({ submittedAt: -1 }).limit(50).lean();

  if (!responses.length) {
    throw new ApiError(400, "No responses available yet for AI analysis.");
  }

  const analytics = await getFormAnalytics(formId);
  const fieldLabelMap = new Map(form.fields.map((field) => [field.id, field.label]));
  const qualitativeResponses = responses.map((response: any) => ({
    submittedAt: response.submittedAt,
    answers: response.answers.map((answer: any) => ({
      fieldId: answer.fieldId,
      label: fieldLabelMap.get(answer.fieldId) ?? answer.fieldId,
      value: answer.value
    }))
  }));

  const prompt = {
    task: "Analyze form responses and return concise business-ready insights.",
    instructions: [
      "Return valid JSON only.",
      "Keep summary to 2-3 sentences.",
      "Generate 3-5 bullet points with percentages or counts when supported by the data.",
      "Highlight compliments, concerns, and one practical recommendation.",
      "Do not invent facts beyond the provided data."
    ],
    expectedJsonShape: {
      summary: "string",
      bulletPoints: ["string"],
      topCompliments: ["string"],
      topConcerns: ["string"],
      recommendation: "string",
      sentiment: "positive | mixed | negative",
      analyzedResponses: "number"
    },
    form: {
      title: form.title,
      description: form.description,
      fields: form.fields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        options: field.options?.map((option) => option.label) ?? []
      }))
    },
    analytics,
    recentResponses: qualitativeResponses
  };

  const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: [
                "You are an expert survey analyst. Produce short, accurate JSON summaries for demo dashboards.",
                JSON.stringify(prompt)
              ].join("\n\n")
            }
          ]
        }
      ]
    })
  });

  const payload = await apiResponse.json().catch(() => null);

  if (!apiResponse.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? String((payload as { error?: { message?: string } }).error?.message ?? "Failed to generate AI insights.")
        : "Failed to generate AI insights.";

    throw new ApiError(apiResponse.status, message);
  }

  const content = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof content !== "string") {
    throw new ApiError(502, "The AI provider returned an empty insights response.");
  }

  try {
    return normalizeInsight(JSON.parse(stripCodeFence(content)), responses.length);
  } catch {
    throw new ApiError(502, "The AI provider returned an invalid insights payload.");
  }
}
