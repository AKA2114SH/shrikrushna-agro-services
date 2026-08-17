import { NextRequest, NextResponse } from 'next/server';
import { handleFarmerAIMessage } from '@/lib/ai-farmer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, senderName, message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const result = await handleFarmerAIMessage({
      phone: phone || '9800000000',
      senderName: senderName || 'शेतकरी मित्र',
      message,
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing AI query' }, { status: 500 });
  }
}
