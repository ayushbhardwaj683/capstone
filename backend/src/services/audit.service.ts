import { AuditLogModel } from "../models/AuditLog";

interface AuditInput {
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(input: AuditInput) {
  await AuditLogModel.create(input);
}
