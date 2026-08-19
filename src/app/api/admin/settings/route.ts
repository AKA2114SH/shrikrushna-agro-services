import DatabaseService from '@/lib/db-service';
import store from '@/lib/store';
import { getCurrentUser, checkPermission } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const profile = await DatabaseService.getBusinessSettings();
    return NextResponse.json({ profile, isDemoActive: store.isDemoActive() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching settings' }, { status: 500 });
  }
}

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
    const updatedProfile = await DatabaseService.updateBusinessSettings('business_profile', body);

    await logAuditEvent({
      user,
      action: 'SETTINGS_UPDATED',
      entity: 'BUSINESS_PROFILE',
      newData: body,
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error saving settings' }, { status: 500 });
  }
}
