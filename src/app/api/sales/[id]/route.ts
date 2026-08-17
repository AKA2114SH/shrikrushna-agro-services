import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { generatePrintableInvoiceHTML } from '@/lib/pdf';

export function generateStaticParams() {
  return [
    { id: 'sale-demo-1' },
    { id: 'sale-demo-2' },
    { id: 'INV-2026-0801' },
    { id: 'INV-2026-0802' },
  ];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const sales = store.getSales();
    const sale = sales.find((s) => s.id === id || s.invoiceNumber === id);

    if (!sale) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    if (searchParams.get('format') === 'html') {
      const html = generatePrintableInvoiceHTML(sale);
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return NextResponse.json({ sale });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching invoice' }, { status: 500 });
  }
}
