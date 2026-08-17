import { NextResponse } from 'next/server';
import { getRecentAuditLogs } from '@/lib/audit';
import { getCurrentUser, checkPermission } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!checkPermission(user.role, 'canManageSettings')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const logs = getRecentAuditLogs(100);
    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching audit logs' }, { status: 500 });
  }
}
