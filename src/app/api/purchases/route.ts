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
    if (!checkPermission(user.role, 'canManagePurchases')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const purchases = store.getPurchases();
    return NextResponse.json({ purchases });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch purchases' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canManagePurchases')) {
      await logAuditEvent({
        user,
        action: 'ACCESS_DENIED',
        entity: 'PURCHASE_CREATE',
        newData: { reason: 'Unauthorized role' },
      });
      return NextResponse.json({ error: 'Forbidden: You do not have permission to record purchases.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      supplierId,
      invoiceNumber,
      items,
      freightCost = 0,
      otherCosts = 0,
      paymentMethod = 'BANK_TRANSFER',
      paidAmount = 0,
      notes,
    } = body;

    if (!supplierId || !invoiceNumber || !items || items.length === 0) {
      return NextResponse.json({ error: 'Supplier, invoice number and purchase items are required.' }, { status: 400 });
    }

    const result = store.recordPurchase({
      supplierId,
      invoiceNumber,
      items,
      freightCost: Number(freightCost),
      otherCosts: Number(otherCosts),
      paymentMethod,
      paidAmount: Number(paidAmount),
      notes,
      createdByName: `${user.name} (${user.role})`,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to record purchase.' }, { status: 400 });
    }

    await logAuditEvent({
      user,
      action: 'PURCHASE_RECORDED',
      entity: 'PURCHASE',
      entityId: result.purchase?.id,
      newData: {
        invoiceNumber: result.purchase?.invoiceNumber,
        grandTotal: result.purchase?.grandTotal,
        supplierName: result.purchase?.supplierName,
      },
    });

    return NextResponse.json({ success: true, purchase: result.purchase });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing purchase' }, { status: 500 });
  }
}
