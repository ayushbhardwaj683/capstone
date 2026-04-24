import { Schema, model, Types } from "mongoose";

const fieldOptionSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const conditionalRuleSchema = new Schema(
  {
    sourceFieldId: { type: String, required: true },
    operator: {
      type: String,
      enum: ["equals", "not_equals", "contains", "greater_than", "less_than"],
      required: true
    },
    value: { type: Schema.Types.Mixed, required: true }
  },
  { _id: false }
);

const formFieldSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: [
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
      ],
      required: true
    },
    label: { type: String, required: true },
    description: { type: String },
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    options: { type: [fieldOptionSchema], default: [] },
    min: { type: Number },
    max: { type: Number },
    allowMultiple: { type: Boolean, default: false },
    rules: { type: [conditionalRuleSchema], default: [] }
  },
  { _id: false }
);

const collaboratorSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["owner", "editor", "viewer"],
      required: true
    }
  },
  { _id: false }
);

const formSettingsSchema = new Schema(
  {
    isPublished: { type: Boolean, default: false },
    customSlug: { type: String, required: true },
    expiresAt: { type: Date },
    responseLimit: { type: Number },
    requireAuth: { type: Boolean, default: false },
    passwordProtected: { type: Boolean, default: false },
    accessPasswordHash: { type: String },
    allowResponseEditing: { type: Boolean, default: false }
  },
  { _id: false }
);

const formSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    fields: {
      type: [formFieldSchema],
      default: []
    },
    collaborators: {
      type: [collaboratorSchema],
      default: []
    },
    settings: {
      type: formSettingsSchema,
      required: true
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },
    version: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

formSchema.index({ ownerId: 1, createdAt: -1 });
formSchema.index({ "settings.customSlug": 1 }, { unique: true });

export const FormModel = model("Form", formSchema);