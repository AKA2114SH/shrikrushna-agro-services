import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, verifyPassword, AuthUser } from '@/lib/auth';
import store from '@/lib/store';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password, role } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }

    // Lookup staff in store
    const staffList = store.getStaff();
    const matchedStaff = staffList.find((s) => s.phone === phone || s.phone.includes(phone));

    if (!matchedStaff) {
      // In demo mode, allow convenient one-click authentication for pre-seeded staff roles
      const defaultRole = (role as any) || 'OWNER';
      const demoUser: AuthUser = {
        id: `user_demo_${Date.now()}`,
        name: defaultRole === 'OWNER' ? 'Shri Krishna Agro Owner' : defaultRole === 'AGRONOMIST' ? 'Shubham Gamane (B.Sc Agri)' : 'Staff Member',
        phone,
        email: 'staff@shrikrishnaagro.in',
        role: defaultRole,
        isDemo: true,
      };

      const token = await createSessionToken(demoUser);
      const res = NextResponse.json({ success: true, user: demoUser });
      res.cookies.set('sk_agro_session', token, {
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
      });

      await logAuditEvent({
        user: demoUser,
        action: 'LOGIN',
        entity: 'USER',
        entityId: demoUser.id,
        newData: { phone, role: demoUser.role },
        isDemo: true,
      });

      return res;
    }

    const authUser: AuthUser = {
      id: matchedStaff.id,
      name: matchedStaff.name,
      phone: matchedStaff.phone,
      email: matchedStaff.email,
      role: matchedStaff.role,
      isDemo: matchedStaff.isDemo,
    };

    const token = await createSessionToken(authUser);
    const response = NextResponse.json({ success: true, user: authUser });
    response.cookies.set('sk_agro_session', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    await logAuditEvent({
      user: authUser,
      action: 'LOGIN',
      entity: 'USER',
      entityId: authUser.id,
      newData: { phone: authUser.phone, role: authUser.role },
      isDemo: authUser.isDemo,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed.' }, { status: 500 });
  }
}
