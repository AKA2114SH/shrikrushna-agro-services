import { NextRequest, NextResponse } from 'next/server';
import { processIncomingWhatsAppMessage, getWhatsAppHistory } from '@/lib/whatsapp';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone') || undefined;
    const history = getWhatsAppHistory(phone);
    return NextResponse.json({ history });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch WhatsApp history' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromPhone, senderName, message } = body;

    if (!fromPhone || !message) {
      return NextResponse.json({ error: 'fromPhone and message are required.' }, { status: 400 });
    }

    const response = await processIncomingWhatsAppMessage({
      id: `wa_${Date.now()}`,
      fromPhone,
      senderName: senderName || 'शेतकरी मित्र (Farmer)',
      message,
      timestamp: new Date().toISOString(),
      isSimulator: true,
    });

    return NextResponse.json({ success: true, response });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing WhatsApp message' }, { status: 500 });
  }
}
