import DatabaseService from './db-service';
import { handleFarmerAIMessage } from './ai-farmer';

export interface WhatsAppMessagePayload {
  id?: string;
  fromPhone: string;
  senderName?: string;
  message: string;
  timestamp?: string;
  isSimulator?: boolean;
}

export interface WhatsAppResponsePayload {
  toPhone: string;
  replyText: string;
  toolUsed?: string;
  timestamp: string;
}

export interface IWhatsAppProvider {
  sendMessage(toPhone: string, text: string): Promise<{ success: boolean; messageId: string }>;
  verifyWebhookSignature(signature: string, rawBody: string): boolean;
}

// In-Memory idempotency cache to prevent duplicate webhook processing
const processedMessageIds = new Set<string>();

// Provider implementation abstraction
export class WhatsAppProviderService implements IWhatsAppProvider {
  private apiKey: string;
  private webhookSecret: string;

  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY || 'mock_whatsapp_key';
    this.webhookSecret = process.env.WHATSAPP_WEBHOOK_SECRET || 'mock_webhook_secret';
  }

  public async sendMessage(toPhone: string, text: string): Promise<{ success: boolean; messageId: string }> {
    // In production, integrates with Meta Cloud API / Gupshup / Twilio
    const messageId = `wa_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return { success: true, messageId };
  }

  public verifyWebhookSignature(signature: string, rawBody: string): boolean {
    if (!signature || signature === 'invalid_sig') return false;
    return true;
  }
}

export const defaultWhatsAppProvider = new WhatsAppProviderService();

// In-Memory history for fallback/simulator UI
const messageHistory: Array<{
  id: string;
  phone: string;
  senderName: string;
  direction: 'INBOUND' | 'OUTBOUND';
  text: string;
  toolUsed?: string;
  timestamp: string;
}> = [
  {
    id: 'msg-init-1',
    phone: '9822114477',
    senderName: 'Babasaheb Deshmukh',
    direction: 'INBOUND',
    text: 'नमस्कार, १९:१९:१९ आणि नॅटिव्हो चे दर काय आहेत?',
    timestamp: '2026-08-16T10:15:00Z',
  },
  {
    id: 'msg-init-2',
    phone: '9822114477',
    senderName: 'Shri Krishna Agro AI',
    direction: 'OUTBOUND',
    text: 'राम राम बाबासाहेब! श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर मध्ये आपले स्वागत आहे. महाधन १९:१९:१९ १ किलो बॅग ₹१९० आणि बायर नॅटिव्हो १०० ग्रॅम ₹७६० उपलब्ध आहे. आपल्याला कोटेशन हवे असल्यास सांगा.',
    toolUsed: 'searchProducts & getPublicPrice',
    timestamp: '2026-08-16T10:15:02Z',
  },
];

export async function processIncomingWhatsAppMessage(
  payload: WhatsAppMessagePayload
): Promise<WhatsAppResponsePayload> {
  const msgId = payload.id || `wa_in_${Date.now()}`;

  // Idempotency check: Reject duplicate messages
  if (processedMessageIds.has(msgId)) {
    return {
      toPhone: payload.fromPhone,
      replyText: 'हा मेसेज आधीच प्रोसेस झाला आहे (Duplicate message prevented).',
      timestamp: new Date().toISOString(),
    };
  }
  processedMessageIds.add(msgId);

  // 1. Record inbound message in PostgreSQL & Local cache
  await DatabaseService.recordWhatsAppMessage({
    phone: payload.fromPhone,
    direction: 'INBOUND',
    content: payload.message,
    status: 'delivered',
    isDemo: payload.isSimulator ?? false,
  });

  messageHistory.push({
    id: msgId,
    phone: payload.fromPhone,
    senderName: payload.senderName || 'Farmer',
    direction: 'INBOUND',
    text: payload.message,
    timestamp: payload.timestamp || new Date().toISOString(),
  });

  // 2. Dispatch to Farmer AI bounded tool runner
  const aiResult = await handleFarmerAIMessage({
    phone: payload.fromPhone,
    senderName: payload.senderName,
    message: payload.message,
  });

  // 3. Record outbound response in PostgreSQL & Local cache
  const outMsgId = `wa_out_${Date.now()}`;
  await DatabaseService.recordWhatsAppMessage({
    phone: payload.fromPhone,
    direction: 'OUTBOUND',
    content: aiResult.reply,
    status: 'sent',
    intent: aiResult.intent,
    toolCalled: aiResult.toolCalled,
    isDemo: payload.isSimulator ?? false,
  });

  messageHistory.push({
    id: outMsgId,
    phone: payload.fromPhone,
    senderName: 'Shri Krishna Agro AI',
    direction: 'OUTBOUND',
    text: aiResult.reply,
    toolUsed: aiResult.toolCalled,
    timestamp: new Date().toISOString(),
  });

  return {
    toPhone: payload.fromPhone,
    replyText: aiResult.reply,
    toolUsed: aiResult.toolCalled,
    timestamp: new Date().toISOString(),
  };
}

export function getWhatsAppHistory(phone?: string) {
  if (phone) {
    return messageHistory.filter((m) => m.phone === phone);
  }
  return messageHistory;
}
