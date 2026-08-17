'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, PhoneCall, ExternalLink, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WhatsAppChatWidget() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'राम राम शेतकरी मित्र! 🙏 मी श्री कृष्ण ॲग्रोचा AI असिस्टंट आहे. खतांचे दर, औषधांची उपलब्धता किंवा कोटेशनसाठी येथे विचारा.',
      time: 'आत्ताच',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: 'आत्ताच' }]);
    setLoading(true);

    try {
      const res = await fetch('/api/whatsapp/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPhone: '9800000000',
          senderName: 'वेबसाइट शेतकरी',
          message: userText,
        }),
      });
      const data = await res.json();
      if (data.success && data.response?.replyText) {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: data.response.replyText, time: 'आत्ताच' },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'आपला संदेश मिळाला. त्वरित मदतीसाठी शुभम गमाणे (8605620843) किंवा जगदीश बोडके (8888474456) यांना कॉल करा.',
            time: 'आत्ताच',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'कृपया थेट व्हॉट्सॲपवर संपर्क करा: +91 8605620843',
          time: 'आत्ताच',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Chat Box */}
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 w-80 sm:w-96 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-agro-800 to-agro-900 text-white p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm">श्री कृष्ण ॲग्रो - AI सहाय्यक</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ऑनलाइन • B.Sc Agri प्रमाणीत</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-200 hover:text-white p-1 rounded-lg"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message Stream */}
          <div className="p-3 h-72 overflow-y-auto space-y-2.5 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-2.5 whitespace-pre-line leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-agro-700 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-xl p-2 text-slate-500 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-agro-600 animate-spin" />
                  <span>माहिती तपासत आहे...</span>
                </div>
              </div>
            )}
          </div>

          {/* Direct WhatsApp App Button */}
          <div className="bg-emerald-50 px-3 py-1.5 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-900 font-medium">थेट WhatsApp ॲप उघडा:</span>
            <a
              href="https://wa.me/918605620843?text=नमस्कार%2C%20मला%20खत%20व%20औषधांविषयी%20माहिती%20हवी%20आहे."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>+91 8605620843</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="उदा. १९:१९:१९ चा दर काय आहे?"
              className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-agro-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-agro-700 hover:bg-agro-800 disabled:opacity-50 text-white p-2 rounded-lg transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Floating Trigger Button */
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-agro-800 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border-2 border-white group"
          title="WhatsApp AI सल्लागार"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white"></span>
          </div>
          <span className="hidden sm:inline font-bold text-xs">
            व्हॉट्सॲप AI असिस्टंट
          </span>
        </button>
      )}
    </div>
  );
}
