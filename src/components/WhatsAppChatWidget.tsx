'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, ExternalLink, Sparkles, Languages, Check, Phone } from 'lucide-react';
import store, { Product } from '@/lib/store';

type SupportedLang = 'mr' | 'hi' | 'en';

export default function WhatsAppChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatLang, setChatLang] = useState<SupportedLang>('mr');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'राम राम शेतकरी मित्र! 🙏 मी श्री कृष्ण ॲग्रोचा AI कृषी सहाय्यक आहे.\n\nआमच्याकडे सर्व खते, कीटकनाशके, बुरशीनाशके व बियाणे उपलब्ध आहेत. आपण कोणत्याही औषधाचे नाव, चालू दर, साठा किंवा पिकावरील रोगांविषयी येथे विचारू शकता.',
      time: 'आत्ताच',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Intelligent Local & Hybrid Agro AI Engine
  const generateAgroReply = (query: string, lang: SupportedLang): string => {
    const q = query.toLowerCase();
    const prods = store.getProducts();

    // 1. Check Product Specific Queries
    for (const p of prods) {
      const matchMr = p.nameMr.toLowerCase().split(' ').some((word) => word.length > 2 && q.includes(word.toLowerCase()));
      const matchEn = p.nameEn.toLowerCase().split(' ').some((word) => word.length > 2 && q.includes(word.toLowerCase()));
      const matchTechnical = p.technicalName && q.includes(p.technicalName.toLowerCase());

      // Direct exact matches
      const is191919 = (q.includes('19:19:19') || q.includes('१९:१९:१९')) && p.sku.includes('191919');
      const is05234 = (q.includes('0:52:34') || q.includes('०:५२:३४') || q.includes('00:52:34')) && p.sku.includes('05234');
      const is126100 = (q.includes('12:61:00') || q.includes('१२:६१:००')) && p.sku.includes('126100');
      const is0050 = (q.includes('0:0:50') || q.includes('०:०:५०')) && p.sku.includes('0050');
      const isNativo = (q.includes('नॅटिव्हो') || q.includes('nativo')) && p.nameEn.includes('Nativo');
      const isCoragen = (q.includes('कोराजन') || q.includes('coragen')) && p.nameEn.includes('Coragen');
      const isAmistar = (q.includes('अमिस्टार') || q.includes('ॲमिस्टार') || q.includes('amistar')) && p.nameEn.includes('Amistar');
      const isDelegate = (q.includes('डेलिगेट') || q.includes('delegate')) && p.nameEn.includes('Delegate');
      const isAlika = (q.includes('अलिका') || q.includes('alika')) && p.nameEn.includes('Alika');
      const isJump = (q.includes('जम्प') || q.includes('jump')) && p.nameEn.includes('Jump');
      const isIsabion = (q.includes('इसाबियन') || q.includes('isabion')) && p.nameEn.includes('Isabion');
      const isDouble = (q.includes('डबल') || q.includes('double')) && p.nameEn.includes('Double');
      const isZinc = (q.includes('झिंक') || q.includes('zinc')) && p.nameEn.includes('Zinc');
      const isBoron = (q.includes('बोरॉन') || q.includes('boron')) && p.nameEn.includes('Boron');
      const isDap = (q.includes('dap') || q.includes('डीएपी')) && p.sku.includes('DAP');
      const isUrea = (q.includes('urea') || q.includes('युरिया')) && p.sku.includes('UREA');
      const isAdvantaOnion = (q.includes('प्रशांत') || (q.includes('कांदा') && q.includes('बियाणे'))) && p.sku.includes('ONION');
      const isTarga = (q.includes('टरगा') || q.includes('targa')) && p.sku.includes('TRG');

      if (
        is191919 || is05234 || is126100 || is0050 || isNativo || isCoragen ||
        isAmistar || isDelegate || isAlika || isJump || isIsabion || isDouble ||
        isZinc || isBoron || isDap || isUrea || isAdvantaOnion || isTarga
      ) {
        if (lang === 'mr') {
          return `✅ **${p.nameMr}** उपलब्ध आहे!\n\n• **पॅकिंग:** ${p.packSize}\n• **चालू विक्री दर:** ₹${p.sellingPrice}\n• **उपलब्ध साठा:** ${p.totalStock} ${p.unit} (थेट सिन्नर दुकानात उपलब्ध)\n• **घटक:** ${p.technicalName || 'प्रमाणित कृषी घटक'}\n• **फवारणी / वापर प्रमाण:** ${p.dosageGuide}\n• **उपयुक्त पिके:** ${p.targetCrops}`;
        } else if (lang === 'hi') {
          return `✅ **${p.nameMr} (${p.nameEn})** उपलब्ध है!\n\n• **पैकिंग:** ${p.packSize}\n• **बिक्री मूल्य:** ₹${p.sellingPrice}\n• **दुकान में स्टॉक:** ${p.totalStock} ${p.unit}\n• **तकनीकी घटक:** ${p.technicalName || 'प्रमाणित कृषि उत्पाद'}\n• **उपयोग मात्रा:** ${p.dosageGuide}\n• **अनुशंसित फसलें:** ${p.targetCrops}`;
        } else {
          return `✅ **${p.nameEn}** is available in stock!\n\n• **Pack Size:** ${p.packSize}\n• **Current Selling Price:** ₹${p.sellingPrice}\n• **Available Stock:** ${p.totalStock} ${p.unit} in Sinnar store\n• **Active Ingredient:** ${p.technicalName}\n• **Dosage Guide:** ${p.dosageGuide}\n• **Target Crops:** ${p.targetCrops}`;
        }
      }
    }

    // 2. Crop Disease & Solutions Matching
    if (q.includes('करपा') || q.includes('karpa') || q.includes('blight') || q.includes('डाग')) {
      if (lang === 'mr') {
        return `🌿 **कांदा व भाजीपाला करपा रोग निवारण:**\n\n१. **बायर नॅटिव्हो (Nativo 100g):** ₹७६० (प्रमाण: ०.५ ग्रॅम/लिटर)\n२. **सिंजेन्टा ॲमिस्टार टॉप (200ml):** ₹७८० (प्रमाण: १ मिली/लिटर)\n३. **युपीएल साफ (Saaf 500g):** ₹३६० (प्रमाण: २ ग्रॅम/लिटर)\n\n👉 सोबत **सुपर सिलिकॉन स्टीकर (५ मिली/पंप)** अवश्य वापरावे जेणेकरून औषध पावसाने धुतले जात नाही.`;
      } else if (lang === 'hi') {
        return `🌿 **झुलसा / करपा रोग नियंत्रण उपाय:**\n\n१. **बायर नैटिवो (Nativo 100g):** ₹७६० (मात्रा: ०.५ ग्राम/लीटर)\n२. **सिंजेंटा एमिस्टार टॉप (200ml):** ₹७८० (मात्रा: १ मिली/लीटर)\n३. **यूपीएल साफ (Saaf 500g):** ₹३६०\n\n👉 इसके साथ सिलिकॉन स्टिकर अवश्य मिलाएं।`;
      } else {
        return `🌿 **Blight / Purple Blotch (Karpa) Control:**\n\n1. **Bayer Nativo (100g):** ₹760 (Dose: 0.5g / Liter)\n2. **Syngenta Amistar Top (200ml):** ₹780 (Dose: 1ml / Liter)\n3. **UPL Saaf (500g):** ₹360 (Dose: 2g / Liter)\n\nAlways add Silicone Spreader (0.5ml/L) for maximum leaf penetration.`;
      }
    }

    if (q.includes('थ्रिप्स') || q.includes('thrips') || q.includes('बोकड्या') || q.includes('रसशोषक')) {
      if (lang === 'mr') {
        return `🐛 **कांदा थ्रिप्स (बोकड्या) व रसशोषक कीड नियंत्रण:**\n\n१. **कॉर्टेव्हा डेलिगेट (Delegate 100ml):** ₹१,४५० (प्रमाण: ०.९ मिली/लिटर) - हट्टी थ्रिप्सवर रामबाण.\n२. **बायर जम्प (Jump 40g):** ₹३४० (प्रमाण: ०.३ ग्रॅम/लिटर)\n३. **सिंजेन्टा अलिका (Alika 100ml):** ₹३९० (प्रमाण: ०.५ मिली/लिटर)\n४. **बायर कॉनफिडोर (100ml):** ₹३८०`;
      } else {
        return `🐛 **Onion Thrips & Sucking Pest Management:**\n\n1. **Corteva Delegate (100ml):** ₹1,450 (Dose: 0.9 ml / Liter) - Instant knockdown.\n2. **Bayer Jump (40g):** ₹340 (Dose: 0.3 g / Liter)\n3. **Syngenta Alika (100ml):** ₹390 (Dose: 0.5 ml / Liter)`;
      }
    }

    if (q.includes('फुगवण') || q.includes('fugvan') || q.includes('bulb') || q.includes('size')) {
      if (lang === 'mr') {
        return `🧅 **कांदा गाठ फुगवण व फळ वजन वाढवण्यासाठी शिफारस:**\n\n१. **महाधन ०:५२:३४ (1 Kg):** ₹२१० (प्रमाण: ५-७ ग्रॅम/लिटर फवारणी किंवा ४ किलो ठिबक)\n२. **गोदरेज डबल टॉनिक (250ml):** ₹३२० (प्रमाण: ०.५ मिली/लिटर)\n३. **महाधन ०:०:५० (1 Kg):** ₹१८० (काढणीपूर्वी रंग व टिकवण क्षमतेसाठी)\n४. **बोरॉन २०% (500g):** ₹२२०`;
      } else {
        return `🧅 **Onion Bulb Formation & Sizing Package:**\n\n1. **Mahadhan 0:52:34 (1 Kg):** ₹210 (5-7g / Liter)\n2. **Godrej Double Tonic (250ml):** ₹320 (0.5ml / Liter)\n3. **Mahadhan 0:0:50 (1 Kg):** ₹180 (Luster & Storage quality)\n4. **Boron 20% (500g):** ₹220`;
      }
    }

    if (q.includes('द्राक्ष') || q.includes('grape') || q.includes('डावणी') || q.includes('भुरी')) {
      return `🍇 **द्राक्ष बाग पीक संरक्षण शिफारस:**\n\n• **डावणी नियंत्रण:** सिंजेन्टा रिडोमिल गोल्ड (₹१,१५० / ५०० ग्रॅम, २.५ ग्रॅम/लिटर)\n• **भुरी नियंत्रण:** बायर नॅटिव्हो (₹७६० / १०० ग्रॅम)\n• **कॅल्शियम व बोरॉन पोषण:** यारालिवा नायट्राबोर (₹१,९५० / २५ किलो बॅग)\n• तज्ञ सल्लागार: जगदीश बोडके (8888474456).`;
    }

    if (q.includes('टोमॅटो') || q.includes('tomato') || q.includes('अळी') || q.includes('armyworm')) {
      return `🍅 **टोमॅटो फळपोखरणारी अळी व कीड नियंत्रण:**\n\n• **एफएमसी कोराजन (60ml):** ₹९४० (प्रमाण: ०.३ मिली/लिटर पाणी)\n• **सिंजेन्टा अभिनव टोमॅटो बियाणे:** ₹८५० (१० ग्रॅम पाकीट)\n• **सिंजेन्टा इसाबियन टॉनिक (500ml):** ₹४८० (फुलगळ रोखण्यासाठी व नवीन फुटीसाठी).`;
    }

    // Default Comprehensive Fallback
    if (lang === 'mr') {
      return `नमस्कार! श्री कृष्ण ॲग्रो सर्व्हिसेस सिन्नर येथे खालील सर्व उत्पादने चालू दरात उपलब्ध आहेत:\n\n• **विद्राव्य खते:** १९:१९:१९ (₹१९०), ०:५२:३४ (₹२१०), १२:६१:०० (₹२४०), ०:०:५० (₹१८०)\n• **बुरशीनाशके:** नॅटिव्हो (₹७६०), ॲमिस्टार टॉप (₹७८०), रिडोमिल (₹१,१५०), साफ (₹३६०)\n• **कीटकनाशके:** कोराजन (₹९४०), डेलिगेट (₹१,४५०), अलिका (₹३९०), जम्प (₹३४०)\n• **बियाणे:** अडव्हांटा प्रशांत कांदा (₹१,४५०), पायोनिअर मका (₹१,२८०)\n\nआपण कोणत्याही विशिष्ट औषधाचे नाव टाकून अचूक माहिती विचारू शकता.`;
    } else if (lang === 'hi') {
      return `नमस्ते! श्री कृष्ण एग्रो सर्विसेज सिन्नर में सभी प्रमाणित उर्वरक, कीटनाशक व बीज उचित दरों पर उपलब्ध हैं:\n\n• 19:19:19 (₹190), 0:52:34 (₹210), 12:61:00 (₹240)\n• नैटिवो (₹760), कोराजन (₹940), डेलिगेट (₹1,450), अलिका (₹390)\n• प्याज बीज व टॉनिक उचित मूल्य पर उपलब्ध हैं।`;
    } else {
      return `Hello! At Shri Krishna Agro Services Sinnar, all fertilizers, fungicides, insecticides, tonics, and certified seeds are available at fair market prices.\n\n• WSF: 19:19:19 (₹190), 0:52:34 (₹210), 12:61:00 (₹240), 0:0:50 (₹180)\n• Crop Protection: Nativo (₹760), Coragen (₹940), Delegate (₹1,450), Alika (₹390)\n• Seeds: Advanta Onion (₹1,450), Pioneer Maize (₹1,280)\n\nPlease ask about any specific chemical, brand, or crop problem!`;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: 'आत्ताच' }]);
    setLoading(true);

    setTimeout(() => {
      const reply = generateAgroReply(userText, chatLang);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: reply, time: 'आत्ताच' },
      ]);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Chat Box */}
      {isOpen ? (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-80 sm:w-96 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-agro-950 via-agro-900 to-agro-800 text-white p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-agro-700 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-xs sm:text-sm">श्री कृष्ण ॲग्रो AI कृषी सहाय्यक</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ऑनलाइन • २४/७ तत्पर पीक सल्ला</span>
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

          {/* Language Selector Bar */}
          <div className="bg-emerald-950/90 text-white px-3 py-1.5 flex items-center justify-between text-[11px] border-b border-emerald-800">
            <span className="text-emerald-300 font-bold flex items-center gap-1">
              <Languages className="w-3.5 h-3.5" />
              <span>भाषा निवडा:</span>
            </span>
            <div className="flex items-center gap-1">
              {(['mr', 'hi', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setChatLang(l)}
                  className={`px-2 py-0.5 rounded font-extrabold transition ${
                    chatLang === l
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                  }`}
                >
                  {l === 'mr' ? 'मराठी' : l === 'hi' ? 'हिंदी' : 'EN'}
                </button>
              ))}
            </div>
          </div>

          {/* Message Stream */}
          <div className="p-3 h-80 overflow-y-auto space-y-2.5 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 whitespace-pre-line leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-agro-800 text-white rounded-br-none'
                      : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1.5 text-right ${
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
                <div className="bg-white border border-slate-200 rounded-xl p-2 text-slate-600 text-xs flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-agro-700 animate-spin" />
                  <span>माहिती व चालू दर तपासत आहे...</span>
                </div>
              </div>
            )}
          </div>

          {/* Direct WhatsApp Call Bar */}
          <div className="bg-emerald-50 px-3 py-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-900 font-bold">थेट तज्ञांशी बोला:</span>
            <a
              href="https://wa.me/918605620843?text=नमस्कार%2C%20मला%20खत%20व%20औषधांविषयी%20माहिती%20हवी%20आहे."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-800 font-extrabold hover:underline flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded"
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
              placeholder={
                chatLang === 'mr'
                  ? 'उदा. १९:१९:१९ चा दर काय आहे किंवा करप्यावर काय मारू?'
                  : chatLang === 'hi'
                  ? 'उदा. 19:19:19 का क्या भाव है?'
                  : 'E.g. Price of Nativo or 19:19:19?'
              }
              className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-agro-600 shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-agro-800 hover:bg-agro-900 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Floating Trigger Button */
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-agro-900 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border-2 border-white group"
          title="WhatsApp AI सल्लागार"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white"></span>
          </div>
          <span className="hidden sm:inline font-extrabold text-xs">
            व्हॉट्सॲप AI असिस्टंट
          </span>
        </button>
      )}
    </div>
  );
}
