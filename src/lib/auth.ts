import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export type UserRole = 'OWNER' | 'MANAGER' | 'AGRONOMIST' | 'CASHIER' | 'ACCOUNTANT';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: UserRole;
  isDemo?: boolean;
}

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.GITHUB_PAGES !== 'true' &&
      process.env.NEXT_EXPORT !== 'true'
    ) {
      throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production!');
    }
    return new TextEncoder().encode('sk_agro_sinnar_dev_signing_key_32_bytes_min_secure!');
  }
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = 'sk_agro_session';

// Role Permission Definitions
export const ROLE_PERMISSIONS: Record<UserRole, {
  canViewProfit: boolean;
  canViewPurchaseMargins: boolean;
  canManageExpenses: boolean;
  canManageInventory: boolean;
  canAdjustStock: boolean;
  canCreateSales: boolean;
  canManageKhata: boolean;
  canCreateQuotations: boolean;
  canManagePurchases: boolean;
  canAccessOwnerAI: boolean;
  canManageStaff: boolean;
  canManageSettings: boolean;
}> = {
  OWNER: {
    canViewProfit: true,
    canViewPurchaseMargins: true,
    canManageExpenses: true,
    canManageInventory: true,
    canAdjustStock: true,
    canCreateSales: true,
    canManageKhata: true,
    canCreateQuotations: true,
    canManagePurchases: true,
    canAccessOwnerAI: true,
    canManageStaff: true,
    canManageSettings: true,
  },
  MANAGER: {
    canViewProfit: false,
    canViewPurchaseMargins: true,
    canManageExpenses: false,
    canManageInventory: true,
    canAdjustStock: true,
    canCreateSales: true,
    canManageKhata: true,
    canCreateQuotations: true,
    canManagePurchases: true,
    canAccessOwnerAI: false,
    canManageStaff: false,
    canManageSettings: false,
  },
  ACCOUNTANT: {
    canViewProfit: true,
    canViewPurchaseMargins: true,
    canManageExpenses: true,
    canManageInventory: true,
    canAdjustStock: false,
    canCreateSales: true,
    canManageKhata: true,
    canCreateQuotations: true,
    canManagePurchases: true,
    canAccessOwnerAI: false,
    canManageStaff: false,
    canManageSettings: false,
  },
  AGRONOMIST: {
    canViewProfit: false,
    canViewPurchaseMargins: false,
    canManageExpenses: false,
    canManageInventory: false,
    canAdjustStock: false,
    canCreateSales: false,
    canManageKhata: false,
    canCreateQuotations: true,
    canManagePurchases: false,
    canAccessOwnerAI: false,
    canManageStaff: false,
    canManageSettings: false,
  },
  CASHIER: {
    canViewProfit: false,
    canViewPurchaseMargins: false,
    canManageExpenses: false,
    canManageInventory: false,
    canAdjustStock: false,
    canCreateSales: true,
    canManageKhata: true,
    canCreateQuotations: true,
    canManagePurchases: false,
    canAccessOwnerAI: false,
    canManageStaff: false,
    canManageSettings: false,
  },
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    isDemo: user.isDemo ?? false,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecretKey());
}

export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return {
      id: payload.sub as string,
      name: payload.name as string,
      phone: payload.phone as string,
      email: (payload.email as string) || null,
      role: payload.role as UserRole,
      isDemo: Boolean(payload.isDemo),
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export function checkPermission(role: UserRole, permission: keyof typeof ROLE_PERMISSIONS['OWNER']): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return Boolean(perms[permission]);
}
