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
    const sales = store.getSales();
    return NextResponse.json({ sales });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canCreateSales')) {
      await logAuditEvent({
        user,
        action: 'ACCESS_DENIED',
        entity: 'SALE_CREATE',
        newData: { reason: 'Unauthorized role' },
      });
      return NextResponse.json({ error: 'Forbidden: You do not have permission to create sales.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      customerId,
      customerName,
      customerPhone,
      customerVillage,
      items,
      discountAmount = 0,
      paymentMethod = 'CASH',
      paidAmount = 0,
      notes,
    } = body;

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json({ error: 'Customer name and sale items are required.' }, { status: 400 });
    }

    const result = store.createSale({
      customerId,
      customerName,
      customerPhone,
      customerVillage,
      items,
      discountAmount: Number(discountAmount),
      paymentMethod,
      paidAmount: Number(paidAmount),
      notes,
      createdByName: `${user.name} (${user.role})`,
      isDemo: user.isDemo ?? store.isDemoActive(),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Sale processing failed.' }, { status: 400 });
    }

    await logAuditEvent({
      user,
      action: 'SALE_CREATED',
      entity: 'SALE',
      entityId: result.sale?.id,
      newData: {
        invoiceNumber: result.sale?.invoiceNumber,
        grandTotal: result.sale?.grandTotal,
        paymentMethod: result.sale?.paymentMethod,
      },
    });

    return NextResponse.json({ success: true, sale: result.sale });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error creating sale' }, { status: 500 });
  }
}
