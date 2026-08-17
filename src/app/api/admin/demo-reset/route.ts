import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getCurrentUser, checkPermission } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canManageSettings')) {
      return NextResponse.json({ error: 'Forbidden: Owner permission required.' }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'CLEAN_PRODUCTION') {
      store.cleanProductionDatabase();
      await logAuditEvent({
        user,
        action: 'DATABASE_CLEANED_FOR_PRODUCTION',
        entity: 'SYSTEM',
        newData: { status: 'All demo records purged. Production virgin state initialized.' },
      });
      return NextResponse.json({
        success: true,
        message: 'Production database initialized cleanly. All demo data purged.',
        isDemoActive: store.isDemoActive(),
      });
    }

    if (action === 'RESET_DEMO') {
      store.resetDemoData();
      await logAuditEvent({
        user,
        action: 'DEMO_DATA_RESET',
        entity: 'SYSTEM',
        newData: { status: 'Sinnar agricultural demo dataset restored.' },
      });
      return NextResponse.json({
        success: true,
        message: 'Demo dataset restored with realistic Sinnar agricultural catalog.',
        isDemoActive: store.isDemoActive(),
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error executing reset action' }, { status: 500 });
  }
}
