import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const quotations = store.getQuotations();
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

    let subtotal = 0;
    let taxAmount = 0;

    const quotationItems = items.map((item: any) => {
      const prod = store.getProductById(item.productId);
      const lineSubtotal = item.quantity * item.unitPrice;
      const lineTax = (lineSubtotal * (item.gstRate || 0)) / 100;
      subtotal += lineSubtotal;
      taxAmount += lineTax;

      return {
        id: `qi_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        productId: item.productId,
        productName: prod ? prod.nameMr : item.productName || 'Product',
        packSize: prod ? prod.packSize : item.packSize || 'Standard',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        discountPercent: Number(item.discountPercent || 0),
        gstRate: Number(item.gstRate || 0),
        taxAmount: lineTax,
        totalPrice: lineSubtotal + lineTax,
      };
    });

    const grandTotal = Math.round(subtotal + taxAmount - Number(discountAmount) + Number(deliveryCharges));

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + validDays);

    const newQuotation = store.createQuotation({
      customerId,
      customerName,
      customerPhone,
      customerVillage: customerVillage || 'Sinnar',
      subtotal,
      discountAmount: Number(discountAmount),
      taxAmount,
      deliveryCharges: Number(deliveryCharges),
      grandTotal,
      validUntil: validUntilDate.toISOString(),
      status: user ? 'SENT' : 'DRAFT',
      notes,
      terms,
      items: quotationItems,
      createdByName: user ? `${user.name} (${user.role})` : 'Online Farmer Portal',
      isDemo: user ? user.isDemo ?? store.isDemoActive() : store.isDemoActive(),
    });

    await logAuditEvent({
      user,
      action: 'CREATE',
      entity: 'QUOTATION',
      entityId: newQuotation.id,
      newData: { quotationNumber: newQuotation.quotationNumber, grandTotal },
    });

    return NextResponse.json({ success: true, quotation: newQuotation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create quotation' }, { status: 500 });
  }
}
