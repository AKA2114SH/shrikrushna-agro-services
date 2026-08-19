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
      action,
      quotationId,
      status,
      paymentMethod,
      paidAmount,
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

    // Action 1: Convert Quotation to Sale
    if (action === 'CONVERT_TO_SALE') {
      if (!user) {
        return NextResponse.json({ error: 'Authentication required to convert quotation to sale.' }, { status: 401 });
      }
      if (user.role === 'AGRONOMIST') {
        return NextResponse.json({ error: 'Forbidden: Agronomists cannot finalize POS sales.' }, { status: 403 });
      }
      if (!quotationId) {
        return NextResponse.json({ error: 'Quotation ID is required for conversion.' }, { status: 400 });
      }

      const convertResult = await DatabaseService.convertQuotationToSale({
        quotationIdOrNumber: quotationId,
        paymentMethod: paymentMethod || 'CASH',
        paidAmount: paidAmount !== undefined ? Number(paidAmount) : undefined,
        createdByName: `${user.name} (${user.role})`,
      });

      if (!convertResult.success) {
        return NextResponse.json({ error: convertResult.error || 'Quotation conversion failed.' }, { status: 400 });
      }

      await logAuditEvent({
        user,
        action: 'QUOTATION_CONVERTED_TO_SALE',
        entity: 'QUOTATION',
        entityId: quotationId,
        newData: { saleId: convertResult.sale?.id, invoiceNumber: convertResult.sale?.invoiceNumber },
      });

      return NextResponse.json({ success: true, sale: convertResult.sale });
    }

    // Action 2: Update Status
    if (action === 'UPDATE_STATUS') {
      if (!user) {
        return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
      }
      if (!quotationId || !status) {
        return NextResponse.json({ error: 'Quotation ID and new status required.' }, { status: 400 });
      }
      const updated = await DatabaseService.updateQuotationStatus(quotationId, status);
      if (!updated) {
        return NextResponse.json({ error: 'Quotation not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, status });
    }

    // Action 3: Create Quotation
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
    return NextResponse.json({ error: err.message || 'Failed to process quotation request' }, { status: 500 });
  }
}
