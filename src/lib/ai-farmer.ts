import store from './store';

export interface FarmerAIMessageInput {
  phone: string;
  senderName?: string;
  message: string;
}

export interface FarmerAIMessageOutput {
  reply: string;
  toolCalled: string;
  intent: string;
}

// Bounded Safe Tool Implementations
function searchProductsTool(query: string) {
  const products = store.getProducts();
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.nameMr.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      (p.technicalName && p.technicalName.toLowerCase().includes(q))
  );
}

function checkStockTool(query: string) {
  const matches = searchProductsTool(query);
  if (matches.length === 0) return null;
  return matches.map((m) => ({
    name: m.nameMr,
    brand: m.brandName,
    pack: m.packSize,
    sellingPrice: m.sellingPrice,
    mrp: m.mrp,
    isAvailable: m.totalStock > 0,
    stockQuantity: m.totalStock,
  }));
}

export async function handleFarmerAIMessage({
  phone,
  senderName = 'शेतकरी मित्र',
  message,
}: FarmerAIMessageInput): Promise<FarmerAIMessageOutput> {
  const text = message.toLowerCase().trim();
  const profile = store.getProfile();

  // 1. Greeting & Business Information
  if (
    text.includes('नमस्कार') ||
    text.includes('राम राम') ||
    text.includes('hello') ||
    text.includes('hi') ||
    text.includes('start')
  ) {
    return {
      reply: `राम राम ${senderName}! 🙏\nश्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर मध्ये आपले सहर्ष स्वागत आहे.\n\nआम्ही आपल्याला खालील बाबतीत मदत करू शकतो:\n१. खते, औषधे व बियाण्यांची उपलब्धता व दर तपासणे\n२. डिजिटल कोटेशन तयार करणे\n३. कृषी तज्ञांचा सल्ला मिळवणे\n\nआपल्याला कोणत्या खताची किंवा औषधाची माहिती हवी आहे?`,
      toolCalled: 'getBusinessIntro',
      intent: 'GREETING',
    };
  }

  // 2. Location & Timings
  if (
    text.includes('पत्ता') ||
    text.includes('कुठे') ||
    text.includes('दुकान') ||
    text.includes('वेळ') ||
    text.includes('location') ||
    text.includes('address') ||
    text.includes('timing')
  ) {
    return {
      reply: `📍 *दुकान पत्ता*: ${profile.address}, ${profile.village}, जि. ${profile.district}.\n⏰ *वेळ*: ${profile.businessTimings}\n📞 *संपर्क*: शुभम गमाणे (${profile.phonePrimary}) / जगदीश बोडके (${profile.phoneSecondary})\n\nआपण दुकानात प्रत्यक्ष भेट देऊनही दर्जेदार कृषी निविष्ठा खरेदी करू शकता.`,
      toolCalled: 'getStoreLocation',
      intent: 'STORE_INFO',
    };
  }

  // 3. Agronomist / Expert Advice Escalation
  if (
    text.includes('तज्ञ') ||
    text.includes('सल्ला') ||
    text.includes('रोग') ||
    text.includes('करपा') ||
    text.includes('थ्रिप्स') ||
    text.includes('अळी') ||
    text.includes('expert') ||
    text.includes('doctor') ||
    text.includes('disease')
  ) {
    return {
      reply: `🌾 *कृषी तज्ञ थेट मार्गदर्शन*:\nपिकांवरील अचूक रोगनिदान व शास्त्रोक्त फवारणी सल्ल्यासाठी आमच्या B.Sc Agri तज्ञांशी थेट संपर्क साधा:\n\n👨‍🌾 *शुभम गमाणे* (B.Sc Agri): ${profile.phonePrimary}\n👨‍🌾 *जगदीश बोडके* (B.Sc Agri): ${profile.phoneSecondary}\n\nआपण पिकाचे किंवा रोगाचे फोटो या व्हॉट्सॲपवर पाठवू शकता. आमचे तज्ञ त्वरित उपाययोजना सुचवतील.`,
      toolCalled: 'escalateToAgronomist',
      intent: 'AGRONOMIST_ESCALATION',
    };
  }

  // 4. Product Stock & Price Inquiries
  const productKeywords = [
    '19:19:19',
    '0:52:34',
    '10:26:26',
    'dap',
    'नॅटिव्हो',
    'nativo',
    'अॅमिस्टार',
    'amistar',
    'नायट्राबोर',
    'nitrabor',
    'कोराजन',
    'coragen',
    'कांदा',
    'onion',
    'बियाणे',
    'खत',
    'झिंक',
    'zinc',
    'खते',
  ];

  const matchedKeyword = productKeywords.find((kw) => text.includes(kw));

  if (matchedKeyword || text.includes('भाव') || text.includes('दर') || text.includes('price') || text.includes('stock')) {
    const searchTarget = matchedKeyword || text.replace(/भाव|दर|price|stock|आहे का|rate/gi, '').trim();
    const results = checkStockTool(searchTarget || '19:19:19');

    if (results && results.length > 0) {
      let replyList = `🌿 *श्री कृष्ण ॲग्रो - उत्पादन दर व उपलब्धता:*\n\n`;
      results.slice(0, 3).forEach((item, idx) => {
        replyList += `${idx + 1}. *${item.name}* (${item.pack})\n   💰 दर: ₹${item.sellingPrice} (MRP: ₹${item.mrp})\n   📦 स्थिती: ${item.isAvailable ? '✅ दुकानात उपलब्ध आहे' : '⏳ मागणीवर उपलब्ध'}\n\n`;
      });
      replyList += `आपल्याला या उत्पादनांचे अधिकृत कोटेशन हवे असल्यास "कोटेशन पाठवा" असा मेसेज करा.`;

      return {
        reply: replyList,
        toolCalled: 'checkStockAndPrice',
        intent: 'PRODUCT_INQUIRY',
      };
    }
  }

  // 5. Create Quotation Request
  if (text.includes('कोटेशन') || text.includes('quotation') || text.includes('quote') || text.includes('दरपत्रक')) {
    return {
      reply: `📋 *कोटेशन विनंती नोंदवली गेली आहे!* 🙏\n\nआपले नाव: ${senderName}\nमोबाईल: ${phone}\n\nआमचे तज्ञ शुभम गमाणे व जगदीश बोडके आपल्या मागणीनुसार अधिकृत संगणकीय कोटेशन (PDF) तयार करून त्वरित या व्हॉट्सॲपवर पाठवतील.\n\nकाही विशेष सूचना असल्यास नक्की कळवा.`,
      toolCalled: 'createQuotationRequest',
      intent: 'QUOTATION_REQUEST',
    };
  }

  // 6. Default Fallback
  return {
    reply: `आपला संदेश मिळाला आहे. श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर तर्फे आम्ही लवकरच आपल्याशी संपर्क करू.\n\nत्वरित मदतीसाठी कॉल करा: ${profile.phonePrimary} / ${profile.phoneSecondary}.`,
    toolCalled: 'defaultFallback',
    intent: 'GENERAL_INQUIRY',
  };
}
