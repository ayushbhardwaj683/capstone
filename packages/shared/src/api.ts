import type { FormAnalytics, FormInsight, FormResponse } from "./response";
import type { FormSchema } from "./form";

export interface ApiMessage {
  message: string;
}

export interface AuthPayload {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface FormListItem {
  id: string;
  title: string;
  customSlug: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormDetailPayload {
  form: FormSchema;
}

export interface ResponseListPayload {
  responses: FormResponse[];
}

export interface AnalyticsPayload {
  analytics: FormAnalytics;
}

export interface InsightPayload {
  insights: FormInsight;
}
