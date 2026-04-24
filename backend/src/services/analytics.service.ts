import { FormModel } from "../models/Form";
import { ResponseModel } from "../models/Response";
import { ApiError } from "../utils/apiError";

interface AnalyticsResponse {
  answers: Array<{
    fieldId: string;
    value: unknown;
  }>;
  submittedAt?: Date | string;
}

export async function getFormAnalytics(formId: string) {
  const form = await FormModel.findById(formId).lean();

  if (!form) {
    throw new ApiError(404, "Form not found.");
  }

  const responses = (await ResponseModel.find({ formId }).sort({ submittedAt: 1 }).lean()) as AnalyticsResponse[];
  const trendBuckets = new Map<string, number>();

  responses.forEach((response) => {
    const label = new Date(response.submittedAt ?? Date.now()).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });

    trendBuckets.set(label, (trendBuckets.get(label) ?? 0) + 1);
  });

  const fieldBreakdown = form.fields.map((field) => {
    const options = (field.options ?? []).map((option) => {
      const count = responses.filter((response) =>
        response.answers.some((answer) => {
          if (answer.fieldId !== field.id) {
            return false;
          }

          if (Array.isArray(answer.value)) {
            return answer.value.map((entry) => String(entry)).includes(option.value);
          }

          return String(answer.value ?? "") === option.value;
        })
      ).length;

      return {
        label: option.label,
        value: option.value,
        count
      };
    });

    return {
      fieldId: field.id,
      label: field.label,
      type: field.type,
      options: options.length ? options : undefined
    };
  });

  return {
    totalResponses: responses.length,
    lastSubmissionAt: responses[responses.length - 1]?.submittedAt,
    responseTrend: Array.from(trendBuckets.entries()).map(([label, count]) => ({ label, count })),
    fieldBreakdown
  };
}
