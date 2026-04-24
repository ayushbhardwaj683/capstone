export interface ResponseAnswer {
  fieldId: string;
  value: string | string[] | number | boolean | null;
}

export interface FormResponse {
  id: string;
  formId: string;
  submittedBy?: string;
  answers: ResponseAnswer[];
  submittedAt: string;
}

export interface FormAnalytics {
  totalResponses: number;
  lastSubmissionAt?: string;
  responseTrend: Array<{
    label: string;
    count: number;
  }>;
  fieldBreakdown: Array<{
    fieldId: string;
    label: string;
    type: string;
    options?: Array<{
      label: string;
      value: string;
      count: number;
    }>;
  }>;
}

export interface FormInsight {
  summary: string;
  bulletPoints: string[];
  topCompliments: string[];
  topConcerns: string[];
  recommendation: string;
  sentiment: "positive" | "mixed" | "negative";
  analyzedResponses: number;
  generatedAt: string;
}
