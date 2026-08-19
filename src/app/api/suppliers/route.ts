// Suppliers Management & Ledger API Route
import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/lib/db-service';
import { getCurrentUser, checkPermission } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!checkPermission(user.role, 'canManagePurchases')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q')?.toLowerCase();

    let suppliers = await DatabaseService.getSuppliers();
    if (search) {
      suppliers = suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.phone.includes(search) ||
          (s.city && s.city.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ suppliers, total: suppliers.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canManagePurchases')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to manage suppliers.' }, { status: 403 });
    }

    const body = await req.json();
    const { action, supplierId, amount, paymentMethod, notes, ...supplierData } = body;

    // Action 1: Record payment to supplier (Disbursement)
    if (action === 'RECORD_PAYMENT') {
      if (!supplierId || !amount) {
        return NextResponse.json({ error: 'Supplier ID and payment amount required.' }, { status: 400 });
      }

      const result = await DatabaseService.recordSupplierPayment(
        supplierId,
        Number(amount),
        paymentMethod || 'BANK_TRANSFER',
        notes,
        undefined,
        user.id
      );

      if (!result.success) {
        return NextResponse.json({ error: result.error || 'Payment recording failed.' }, { status: 400 });
      }

      await logAuditEvent({
        user,
        action: 'SUPPLIER_PAYMENT_RECORDED',
        entity: 'SUPPLIER',
        entityId: supplierId,
        newData: { amount, newOutstanding: result.newOutstanding },
      });

      return NextResponse.json({ success: true, newOutstanding: result.newOutstanding });
    }

    // Action 2: Create new Supplier
    if (!supplierData.name || !supplierData.phone) {
      return NextResponse.json({ error: 'Supplier name and phone number are required.' }, { status: 400 });
    }

    const newSupplier = await DatabaseService.createSupplier({
      ...supplierData,
      outstandingPayable: Number(supplierData.outstandingPayable || 0),
      isDemo: user.isDemo ?? false,
    });

    await logAuditEvent({
      user,
      action: 'SUPPLIER_CREATED',
      entity: 'SUPPLIER',
      entityId: newSupplier.id,
      newData: { name: newSupplier.name, phone: newSupplier.phone, city: newSupplier.city },
    });

    return NextResponse.json({ success: true, supplier: newSupplier });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing supplier request' }, { status: 500 });
  }
}
