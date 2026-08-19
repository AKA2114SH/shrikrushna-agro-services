import { NextResponse } from 'next/server';
import DatabaseService from '@/lib/db-service';
import { getCurrentUser, checkPermission } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canViewProfit')) {
      await logAuditEvent({
        user,
        action: 'ACCESS_DENIED',
        entity: 'PROFIT_REPORT',
        newData: { reason: `Role ${user.role} denied access to profit reports.` },
      });
      return NextResponse.json(
        { error: 'Forbidden: You do not have authorization to view profit and financial margin reports.' },
        { status: 403 }
      );
    }

    const kpis = await DatabaseService.getFinancialKPIs();
    return NextResponse.json({ success: true, kpis });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error generating financial report' }, { status: 500 });
  }
}
