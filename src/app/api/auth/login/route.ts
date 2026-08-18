import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, verifyPassword, hashPassword, AuthUser } from '@/lib/auth';
import store from '@/lib/store';
import { logAuditEvent } from '@/lib/audit';

// In-Memory Rate Limiting Guard (5 failed attempts per 15 minutes)
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function isRateLimited(key: string): boolean {
  const record = loginAttempts.get(key);
  if (!record) return false;
  if (Date.now() > record.lockedUntil) {
    loginAttempts.delete(key);
    return false;
  }
  return record.count >= 5;
}

function recordFailedAttempt(key: string) {
  const record = loginAttempts.get(key) || { count: 0, lockedUntil: Date.now() + 15 * 60 * 1000 };
  record.count += 1;
  record.lockedUntil = Date.now() + 15 * 60 * 1000;
  loginAttempts.set(key, record);
}

function resetAttempts(key: string) {
  loginAttempts.delete(key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password, pin } = body;

    const identifier = (phone || '').trim().toLowerCase();
    const secret = (password || pin || '').trim();

    if (!identifier || !secret) {
      return NextResponse.json(
        { error: 'मोबाईल नंबर आणि पासवर्ड/पिन आवश्यक आहे. (Phone and password are required)' },
        { status: 400 }
      );
    }

    // Check rate limit
    if (isRateLimited(identifier)) {
      return NextResponse.json(
        { error: 'वारंवार चुकीचे प्रयत्न. कृपया १५ मिनिटांनंतर पुन्हा प्रयत्न करा. (Too many failed attempts. Try again in 15 minutes)' },
        { status: 429 }
      );
    }

    // Lookup staff/owners in store
    const staffList = store.getStaff();
    const matchedStaff = staffList.find(
      (s) => s.phone.trim() === identifier || (s.email && s.email.toLowerCase() === identifier)
    );

    if (!matchedStaff) {
      recordFailedAttempt(identifier);
      return NextResponse.json(
        { error: 'अवैध मोबाईल नंबर किंवा पासवर्ड. (Invalid login credentials)' },
        { status: 401 }
      );
    }

    // Verify Password / PIN using bcrypt or seed hash
    let isPasswordValid = false;
    if (matchedStaff.passwordHash) {
      if (matchedStaff.passwordHash.startsWith('$2')) {
        isPasswordValid = await verifyPassword(secret, matchedStaff.passwordHash);
      } else {
        // Direct seed matching if hash is not yet bcrypt-migrated
        isPasswordValid = secret === matchedStaff.passwordHash || (matchedStaff.phone.endsWith(secret));
      }
    }

    if (!isPasswordValid) {
      recordFailedAttempt(identifier);
      return NextResponse.json(
        { error: 'अवैध मोबाईल नंबर किंवा पासवर्ड. (Invalid login credentials)' },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful login
    resetAttempts(identifier);

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
      secure: process.env.NODE_ENV === 'production',
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
    return NextResponse.json({ error: 'लॉगिन प्रक्रियेत त्रुटी आली. (Authentication failed)' }, { status: 500 });
  }
}
