import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/lib/db-service';
import { getCurrentUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const quotations = await DatabaseService.getQuotations();
    return NextResponse.json({ quotations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch quotations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      customerId,
      customerName,
      customerPhone,
      customerVillage,
      items,
      discountAmount = 0,
      deliveryCharges = 0,
      notes,
      terms,
      validDays = 15,
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer name, phone and at least one item are required.' },
        { status: 400 }
      );
    }

    const newQuotation = await DatabaseService.createQuotation({
      customerId,
      customerName,
      customerPhone,
      customerVillage: customerVillage || 'Sinnar',
      discountAmount: Number(discountAmount),
      deliveryCharges: Number(deliveryCharges),
      notes,
      terms,
      validDays: Number(validDays),
      items,
      createdByName: user ? `${user.name} (${user.role})` : 'Online Farmer Portal',
      isDemo: user ? user.isDemo ?? false : false,
    });

    await logAuditEvent({
      user,
      action: 'CREATE',
      entity: 'QUOTATION',
      entityId: newQuotation.id,
      newData: { quotationNumber: newQuotation.quotationNumber, grandTotal: newQuotation.grandTotal },
    });

    return NextResponse.json({ success: true, quotation: newQuotation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create quotation' }, { status: 500 });
  }
}
