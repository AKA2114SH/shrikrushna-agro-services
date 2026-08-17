import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { generatePrintableQuotationHTML } from '@/lib/pdf';

export function generateStaticParams() {
  return [
    { id: 'quote-1' },
    { id: 'quote-2' },
    { id: 'QTN-2026-001' },
    { id: 'QTN-2026-002' },
  ];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const quotations = store.getQuotations();
    const quote = quotations.find((q) => q.id === id || q.quotationNumber === id);

    if (!quote) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    if (searchParams.get('format') === 'html') {
      const html = generatePrintableQuotationHTML(quote);
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return NextResponse.json({ quotation: quote });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching quotation' }, { status: 500 });
  }
}
