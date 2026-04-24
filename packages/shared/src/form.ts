export type FieldType =
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

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface ConditionalRule {
  sourceFieldId: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: string | number | boolean;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];
  min?: number;
  max?: number;
  allowMultiple?: boolean;
  rules?: ConditionalRule[];
}

export interface Collaborator {
  userId: string;
  role: "owner" | "editor" | "viewer";
}

export interface FormSettings {
  isPublished: boolean;
  customSlug: string;
  expiresAt?: string;
  responseLimit?: number;
  requireAuth: boolean;
  passwordProtected: boolean;
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  fields: FormField[];
  collaborators: Collaborator[];
  settings: FormSettings;
  createdAt: string;
  updatedAt: string;
}
