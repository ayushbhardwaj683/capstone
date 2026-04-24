import { Schema, model, Types } from "mongoose";

const answerSchema = new Schema(
  {
    fieldId: { type: String, required: true },
    value: { type: Schema.Types.Mixed, default: null }
  },
  { _id: false }
);

const responseSchema = new Schema(
  {
    formId: {
      type: Types.ObjectId,
      ref: "Form",
      required: true,
      index: true
    },
    submittedBy: {
      type: Types.ObjectId,
      ref: "User"
    },
    answers: {
      type: [answerSchema],
      default: []
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  {
    timestamps: { createdAt: "submittedAt", updatedAt: false }
  }
);

responseSchema.index({ formId: 1, submittedAt: -1 });

export const ResponseModel = model("Response", responseSchema);
