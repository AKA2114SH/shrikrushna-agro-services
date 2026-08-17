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
    const customers = store.getCustomers();
    return NextResponse.json({ customers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canManageKhata')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { action, customerId, amount, paymentMethod, notes, ...customerData } = body;

    // Action 1: Settle / Record Payment against Khata
    if (action === 'RECORD_PAYMENT') {
      if (!customerId || !amount) {
        return NextResponse.json({ error: 'Customer ID and payment amount required.' }, { status: 400 });
      }
      const updatedCustomer = store.recordCustomerPayment(customerId, Number(amount), paymentMethod || 'CASH', notes);
      await logAuditEvent({
        user,
        action: 'PAYMENT_RECEIVED',
        entity: 'CUSTOMER_KHATA',
        entityId: customerId,
        newData: { amount, customerName: updatedCustomer?.name, newBalance: updatedCustomer?.outstandingBalance },
      });
      return NextResponse.json({ success: true, customer: updatedCustomer });
    }

    // Action 2: Add New Customer
    const newCustomer = store.addCustomer({
      ...customerData,
      outstandingBalance: Number(customerData.outstandingBalance || 0),
      creditLimit: Number(customerData.creditLimit || 50000),
      crops: customerData.crops || [],
      isDemo: user.isDemo ?? store.isDemoActive(),
    });

    await logAuditEvent({
      user,
      action: 'CUSTOMER_CREATED',
      entity: 'CUSTOMER',
      entityId: newCustomer.id,
      newData: { name: newCustomer.name, phone: newCustomer.phone, village: newCustomer.village },
    });

    return NextResponse.json({ success: true, customer: newCustomer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing customer request' }, { status: 500 });
  }
}
