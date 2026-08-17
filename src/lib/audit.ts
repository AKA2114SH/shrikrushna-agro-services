import { AuthUser } from './auth';

export interface AuditLogEntry {
  id: string;
  userId?: string | null;
  userName?: string | null;
  userRole?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  oldData?: any;
  newData?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
  isDemo: boolean;
  createdAt: string;
}

// In-memory / data-layer audit buffer for instant retrieval and DB sync
const auditMemoryBuffer: AuditLogEntry[] = [];

export async function logAuditEvent({
  user,
  action,
  entity,
  entityId,
  oldData,
  newData,
  ipAddress,
  userAgent,
  isDemo = false,
}: {
  user?: AuthUser | null;
  action: string;
  entity: string;
  entityId?: string | null;
  oldData?: any;
  newData?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
  isDemo?: boolean;
}): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: user?.id || null,
    userName: user?.name || 'System / Public',
    userRole: user?.role || 'ANONYMOUS',
    action,
    entity,
    entityId: entityId || null,
    oldData: oldData ? JSON.stringify(oldData) : null,
    newData: newData ? JSON.stringify(newData) : null,
    ipAddress: ipAddress || '127.0.0.1',
    userAgent: userAgent || 'App Client',
    isDemo: isDemo ?? user?.isDemo ?? false,
    createdAt: new Date().toISOString(),
  };

  auditMemoryBuffer.unshift(entry);
  if (auditMemoryBuffer.length > 500) {
    auditMemoryBuffer.pop();
  }

  return entry;
}

export function getRecentAuditLogs(limit = 50, filterDemo?: boolean): AuditLogEntry[] {
  if (filterDemo !== undefined) {
    return auditMemoryBuffer.filter(log => log.isDemo === filterDemo).slice(0, limit);
  }
  return auditMemoryBuffer.slice(0, limit);
}
