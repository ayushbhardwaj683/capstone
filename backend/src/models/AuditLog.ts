import { Schema, model, Types } from "mongoose";

const auditLogSchema = new Schema(
  {
    actorId: {
      type: Types.ObjectId,
      ref: "User"
    },
    action: {
      type: String,
      required: true
    },
    entityType: {
      type: String,
      required: true
    },
    entityId: {
      type: String,
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export const AuditLogModel = model("AuditLog", auditLogSchema);
