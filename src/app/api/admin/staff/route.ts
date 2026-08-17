import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getCurrentUser, checkPermission } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const staff = store.getStaff();
    return NextResponse.json({ staff });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching staff' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canManageStaff')) {
      return NextResponse.json({ error: 'Forbidden: Only Owner can manage staff accounts.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, phone, email, role, qualification } = body;

    if (!name || !phone || !role) {
      return NextResponse.json({ error: 'Name, phone and role are required.' }, { status: 400 });
    }

    const newStaff = store.addStaffMember({
      name,
      phone,
      email,
      role,
      qualification,
      isActive: true,
      isDemo: user.isDemo ?? store.isDemoActive(),
    });

    await logAuditEvent({
      user,
      action: 'STAFF_MEMBER_CREATED',
      entity: 'STAFF',
      entityId: newStaff.id,
      newData: { name: newStaff.name, phone: newStaff.phone, role: newStaff.role },
    });

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error creating staff member' }, { status: 500 });
  }
}
