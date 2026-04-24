import { z } from "zod";

const optionSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string()
});

const conditionalRuleSchema = z.object({
  sourceFieldId: z.string(),
  operator: z.enum(["equals", "not_equals", "contains", "greater_than", "less_than"]),
  value: z.union([z.string(), z.number(), z.boolean()])
});

const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum([
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
  ]),
  label: z.string().min(1),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(optionSchema).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  allowMultiple: z.boolean().optional(),
  rules: z.array(conditionalRuleSchema).optional()
});

export const createFormSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
  fields: z.array(formFieldSchema),
  settings: z.object({
    customSlug: z.string().min(3).max(120),
    expiresAt: z.string().datetime().optional(),
    responseLimit: z.number().int().positive().optional(),
    requireAuth: z.boolean().default(false),
    passwordProtected: z.boolean().default(false),
    accessPassword: z.string().min(6).optional(),
    allowResponseEditing: z.boolean().default(false)
  })
});

export const updateFormSchema = createFormSchema.partial();

export const submitResponseSchema = z.object({
  answers: z.array(
    z.object({
      fieldId: z.string(),
      value: z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string())])
    })
  )
});
