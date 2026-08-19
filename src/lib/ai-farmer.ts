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

function normalizeQuery(input: string): string {
  const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  let res = input.toLowerCase();
  marathiDigits.forEach((d, idx) => {
    res = res.replaceAll(d, String(idx));
  });
  return res;
}

// Bounded Safe Tool Implementations
function searchProductsTool(query: string) {
  const products = store.getProducts();
  const rawQ = query.toLowerCase();
  const normQ = normalizeQuery(query);

  return products.filter((p) => {
    const pNameMr = p.nameMr.toLowerCase();
    const pNameEn = p.nameEn.toLowerCase();
    const pBrand = p.brandName.toLowerCase();
    const pTech = (p.technicalName || '').toLowerCase();

    return (
      pNameMr.includes(rawQ) ||
      pNameMr.includes(normQ) ||
      pNameEn.includes(rawQ) ||
      pNameEn.includes(normQ) ||
      pBrand.includes(rawQ) ||
      pBrand.includes(normQ) ||
      pTech.includes(rawQ) ||
      pTech.includes(normQ)
    );
  });
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
  const normalizedText = normalizeQuery(text);
  const profile = store.getProfile();

  // [SAFETY DEFENSE 1] Prompt Injection, Secret Leakage & System Prompt Protection
  if (
    text.includes('system prompt') ||
    text.includes('ignore') ||
    text.includes('credential') ||
    text.includes('credentials') ||
    text.includes('api key') ||
    text.includes('api_key') ||
    text.includes('secret') ||
    text.includes('password') ||
    text.includes('jwt') ||
    text.includes('drop table') ||
    text.includes('select * from')
  ) {
    return {
      reply: `सुरक्षा नियमांनुसार अंतर्गत सिस्टिम माहिती किंवा सिक्रेट्स उघड करता येत नाहीत. आम्ही आपल्याला खते, औषधे व शेतीविषयक माहितीसाठी मदत करण्यास तयार आहोत.`,
      toolCalled: 'rejectPromptInjection',
      intent: 'SECURITY_VIOLATION_BLOCKED',
    };
  }

  // [SAFETY DEFENSE 2] Confidential Dealer Margins, Purchase Costs & Wholesale Pricing Protection
  if (
    text.includes('purchase price') ||
    text.includes('purchaseprice') ||
    text.includes('खरेदी किंमत') ||
    text.includes('dealer margin') ||
    text.includes('margin') ||
    text.includes('margins') ||
    text.includes('wholesale') ||
    text.includes('cost price') ||
    text.includes('supplier price') ||
    text.includes('सप्लायर दर') ||
    text.includes('दुकानदार नफा')
  ) {
    return {
      reply: `गोपनीयता धोरणानुसार अंतर्गत खरेदी किंमत किंवा डीलर मार्जिन उपलब्ध केले जात नाही. आपण दुकानातील अधिकृत किरकोळ विक्री दर (Retail Selling Price) तपासू शकता.`,
      toolCalled: 'maskConfidentialMargins',
      intent: 'CONFIDENTIAL_MARGIN_MASKED',
    };
  }

  // [SAFETY DEFENSE 3] Hazardous Agrochemical / Unlicensed Chemical Cocktails Protection
  if (
    text.includes('विष') ||
    text.includes('poison') ||
    text.includes('घातक मिश्रण') ||
    text.includes('unregistered chemical') ||
    text.includes('overdose') ||
    text.includes('जास्त प्रमाण')
  ) {
    return {
      reply: `⚠️ *कृषी सुरक्षा सूचना*: अनधिकृत कीटकनाशक किंवा अतिप्रमाणात फवारणी पिकांसाठी अत्यंत घातक ठरू शकते. अचूक आणि सुरक्षित रासायनिक शिफारशींसाठी कृपया आमचे B.Sc Agri तज्ञ शुभम गमाणे (${profile.phonePrimary}) यांच्याशी थेट बोला.`,
      toolCalled: 'chemicalSafetyWarning',
      intent: 'CHEMICAL_SAFETY_REFUSAL',
    };
  }

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
    '19 19 19',
    '19-19-19',
    '0:52:34',
    '12:61:00',
    '0:0:50',
    '10:26:26',
    'dap',
    'युरिया',
    'urea',
    'नॅटिव्हो',
    'nativo',
    'अॅमिस्टार',
    'amistar',
    'नायट्राबोर',
    'nitrabor',
    'कोराजन',
    'coragen',
    'डेलिगेट',
    'delegate',
    'अलिका',
    'alika',
    'कॉनफिडोर',
    'confidor',
    'कांदा',
    'झिंक',
    'zinc',
    'बोरॉन',
    'boron',
    'इसाबियन',
    'isabion',
  ];

  const matchedKeyword = productKeywords.find(
    (kw) => text.includes(kw) || normalizedText.includes(kw)
  );

  if (
    matchedKeyword ||
    text.includes('भाव') ||
    text.includes('दर') ||
    text.includes('price') ||
    text.includes('stock') ||
    normalizedText.includes('19:19:19')
  ) {
    const cleanedTarget = normalizedText
      .replace(/भाव|दर|price|stock|आहे का|काय आहे|उपलब्ध|पाहिजे|हवे|rate/gi, '')
      .trim();
    const searchTarget = matchedKeyword || cleanedTarget || '19:19:19';
    const results = checkStockTool(searchTarget);

    if (results && results.length > 0) {
      let replyList = `🌿 *श्री कृष्ण ॲग्रो - उत्पादन दर व उपलब्धता:*\n\n`;
      results.slice(0, 3).forEach((item, idx) => {
        replyList += `${idx + 1}. *${item.name}* (${item.pack})\n   💰 चालू दर: ₹${item.sellingPrice} (MRP: ₹${item.mrp})\n   📦 स्थिती: ${item.isAvailable ? '✅ दुकानात उपलब्ध आहे' : '❌ शिल्लक नाही (सध्या उपलब्ध नाही)'}\n\n`;
      });
      replyList += `आपल्याला या उत्पादनांचे अधिकृत कोटेशन हवे असल्यास "कोटेशन पाठवा" असा मेसेज करा.`;

      return {
        reply: replyList,
        toolCalled: 'checkStockAndPrice',
        intent: 'PRODUCT_INQUIRY',
      };
    }

    return {
      reply: `आपण विचारलेले उत्पादन सध्या सिस्टिममध्ये आढळले नाही. कृपया अचूक नाव तपासा किंवा थेट शुभम गमाणे (${profile.phonePrimary}) यांच्याशी संपर्क साधा.`,
      toolCalled: 'productNotFound',
      intent: 'PRODUCT_NOT_FOUND',
    };
  }

  // 5. Quotation Request Trigger
  if (
    text.includes('कोटेशन') ||
    text.includes('दरपत्रक') ||
    text.includes('quotation') ||
    text.includes('quote') ||
    text.includes('bill')
  ) {
    return {
      reply: `📋 *डिजिटल कोटेशन तयार करण्यासाठी:*\nकृपया आपल्याला हवी असलेली उत्पादने व प्रमाण (उदा. ५ बॅग युरिया, २ बाटल्या कोराजन) पाठवा. आमची सिस्टिम आपल्याला लगेच संगणकीय दरपत्रक तयार करून देईल.`,
      toolCalled: 'requestQuotationDetails',
      intent: 'QUOTATION_REQUEST',
    };
  }

  // Default fallback with human escalation
  return {
    reply: `आपल्या संदेशाबद्दल धन्यवाद. अधिक सविस्तर माहिती व मदतीसाठी कृपया आमचे तज्ञ शुभम गमाणे (${profile.phonePrimary}) किंवा जगदीश बोडके (${profile.phoneSecondary}) यांच्याशी संपर्क साधा.`,
    toolCalled: 'generalFallback',
    intent: 'FALLBACK',
  };
}
