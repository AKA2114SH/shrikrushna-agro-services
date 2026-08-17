import store from './store';
import { handleFarmerAIMessage } from './ai-farmer';

export interface WhatsAppMessagePayload {
  id: string;
  fromPhone: string;
  senderName: string;
  message: string;
  timestamp: string;
  isSimulator?: boolean;
}

export interface WhatsAppResponsePayload {
  toPhone: string;
  replyText: string;
  toolUsed?: string;
  timestamp: string;
}

// Conversation Memory for simulated & live sessions
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
  // 1. Record inbound message in history
  messageHistory.push({
    id: payload.id || `wa_in_${Date.now()}`,
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

  // 3. Record outbound response
  messageHistory.push({
    id: `wa_out_${Date.now()}`,
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
