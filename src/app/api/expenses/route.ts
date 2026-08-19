import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/lib/db-service';
import { getCurrentUser, checkPermission } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!checkPermission(user.role, 'canManageExpenses')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const expenses = await DatabaseService.getExpenses();
    return NextResponse.json({ expenses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canManageExpenses')) {
      await logAuditEvent({
        user,
        action: 'ACCESS_DENIED',
        entity: 'EXPENSE_RECORD',
        newData: { reason: 'Unauthorized role' },
      });
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to record expenses.' }, { status: 403 });
    }

    const body = await req.json();
    const { category, amount, paymentMethod, vendor, notes, expenseDate } = body;

    if (!category || !amount) {
      return NextResponse.json({ error: 'Category and amount are required.' }, { status: 400 });
    }

    const newExpense = await DatabaseService.createExpense({
      category,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'CASH',
      vendor: vendor || 'Vendor',
      notes,
      expenseDate: expenseDate || new Date().toISOString(),
      recordedByName: `${user.name} (${user.role})`,
      isDemo: user.isDemo ?? false,
    });

    await logAuditEvent({
      user,
      action: 'EXPENSE_RECORDED',
      entity: 'EXPENSE',
      entityId: newExpense.id,
      newData: { category: newExpense.category, amount: newExpense.amount, vendor: newExpense.vendor },
    });

    return NextResponse.json({ success: true, expense: newExpense });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error recording expense' }, { status: 500 });
  }
}
