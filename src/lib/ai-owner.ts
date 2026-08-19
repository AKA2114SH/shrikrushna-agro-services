import DatabaseService from './db-service';

export interface OwnerAIQueryInput {
  query: string;
}

export interface OwnerAIQueryOutput {
  answerMr: string;
  answerEn: string;
  toolUsed: string;
  dataSummary: any;
}

export async function handleOwnerAIQuery({
  query,
}: OwnerAIQueryInput): Promise<OwnerAIQueryOutput> {
  const q = query.toLowerCase().trim();

  // [SAFETY DEFENSE 1] Mutation Prevention & Read-Only Enforcement
  if (
    q.includes('delete') ||
    q.includes('drop') ||
    q.includes('update') ||
    q.includes('insert') ||
    q.includes('alter') ||
    q.includes('कमी करा') ||
    q.includes('काढून टाका') ||
    q.includes('बदला') ||
    q.includes('डिलीट')
  ) {
    return {
      answerMr: `⚠️ *सुरक्षा मर्यादा*: ओनर एआय असिस्टंट फक्त व्यावसायिक आकडेवारी आणि विश्लेषणासाठी (Read-Only) आहे. ईआरपी मधील डेटा बदलण्यासाठी किंवा डिलीट करण्यासाठी कृपया अधिकृत ॲडमिन स्क्रीनचा वापर करा.`,
      answerEn: `⚠️ *Security Boundary*: Owner AI is strictly a read-only business intelligence assistant. Direct database mutations or record deletions are prohibited via AI interface.`,
      toolUsed: 'blockDataMutation',
      dataSummary: { error: 'MUTATION_BLOCKED' },
    };
  }

  // Fetch live transactional data from PostgreSQL via DatabaseService
  const kpi = await DatabaseService.getFinancialKPIs();
  const products = await DatabaseService.getProducts(true);
  const customers = await DatabaseService.getCustomers(true);
  const sales = await DatabaseService.getSales(true);
  const expenses = await DatabaseService.getExpenses(true);

  // 1. Sales Query (विक्री)
  if (
    q.includes('विक्री') ||
    q.includes('सेल') ||
    q.includes('sales') ||
    q.includes('today') ||
    q.includes('आज') ||
    q.includes('revenue')
  ) {
    const totalSales = sales.reduce((acc, s) => acc + s.grandTotal, 0);
    return {
      answerMr: `📊 *एकूण नोंदवलेली विक्री*: ₹${totalSales.toLocaleString('en-IN')}\n\n• एकूण बिले (Invoices): ${sales.length}\n• सरासरी बिल आकार: ₹${sales.length > 0 ? Math.round(totalSales / sales.length).toLocaleString('en-IN') : 0}`,
      answerEn: `📊 *Total Sales Recorded*: ₹${totalSales.toLocaleString('en-IN')}\n\n• Total Invoices: ${sales.length}\n• Average Ticket Size: ₹${sales.length > 0 ? Math.round(totalSales / sales.length).toLocaleString('en-IN') : 0}`,
      toolUsed: 'getSalesSummary',
      dataSummary: { totalSales, count: sales.length },
    };
  }

  // 2. Profit & Net Margin Query (नफा / मार्जिन)
  if (
    q.includes('नफा') ||
    q.includes('profit') ||
    q.includes('मार्जिन') ||
    q.includes('margin') ||
    q.includes('हिशोब')
  ) {
    return {
      answerMr: `💰 *नफा व तोटा विश्लेषण (Live Net Profit)*:\n\n• एकूण महसूल (Revenue): ₹${kpi.totalRevenue.toLocaleString('en-IN')}\n• माल खरेदी किंमत (COGS): ₹${kpi.totalCOGS.toLocaleString('en-IN')}\n• ढोबळ नफा (Gross Profit): ₹${kpi.grossProfit.toLocaleString('en-IN')}\n• एकूण खर्च (Expenses): ₹${kpi.totalExpenses.toLocaleString('en-IN')}\n• **निव्वळ नफा (Net Profit): ₹${kpi.netProfit.toLocaleString('en-IN')}** (${kpi.netMarginPercent}% मार्जिन)`,
      answerEn: `💰 *Profit & Loss Analysis*:\n\n• Total Revenue: ₹${kpi.totalRevenue.toLocaleString('en-IN')}\n• Cost of Goods Sold: ₹${kpi.totalCOGS.toLocaleString('en-IN')}\n• Gross Profit: ₹${kpi.grossProfit.toLocaleString('en-IN')}\n• Operating Expenses: ₹${kpi.totalExpenses.toLocaleString('en-IN')}\n• **Net Profit: ₹${kpi.netProfit.toLocaleString('en-IN')}** (${kpi.netMarginPercent}% Net Margin)`,
      toolUsed: 'getNetProfitReport',
      dataSummary: {
        revenue: kpi.totalRevenue,
        cogs: kpi.totalCOGS,
        grossProfit: kpi.grossProfit,
        expenses: kpi.totalExpenses,
        netProfit: kpi.netProfit,
        margin: kpi.netMarginPercent,
      },
    };
  }

  // 3. Low Stock / Reorder Alert (कमी माल / संपत आलेला स्टॉक)
  if (
    q.includes('कमी') ||
    q.includes('स्टॉक') ||
    q.includes('माल') ||
    q.includes('low stock') ||
    q.includes('stock')
  ) {
    const lowStockItems = products.filter((p) => p.totalStock <= p.minStockLevel);
    let mrList = `⚠️ *पुनर्खरेदी आवश्यक असणारा कमी स्टॉक (${lowStockItems.length} उत्पादने)*:\n\n`;
    let enList = `⚠️ *Low Stock Items Needing Reorder (${lowStockItems.length} items)*:\n\n`;

    lowStockItems.forEach((p, idx) => {
      mrList += `${idx + 1}. *${p.nameMr}* — शिल्लक: ${p.totalStock} ${p.unit} (किमान पातळी: ${p.minStockLevel})\n`;
      enList += `${idx + 1}. *${p.nameEn}* — Stock: ${p.totalStock} ${p.unit} (Min: ${p.minStockLevel})\n`;
    });

    if (lowStockItems.length === 0) {
      mrList = `✅ सध्या सर्व उत्पादनांचा स्टॉक पुरेसा आहे. कोणतीही वस्तू किमान मर्यादेखाली नाही.`;
      enList = `✅ All items are currently well-stocked above minimum thresholds.`;
    }

    return {
      answerMr: mrList,
      answerEn: enList,
      toolUsed: 'getLowStockAlerts',
      dataSummary: lowStockItems,
    };
  }

  // 4. Expiry Alert (एक्सपायरी बॅच)
  if (
    q.includes('एक्सपायरी') ||
    q.includes('तारीख') ||
    q.includes('मुदत') ||
    q.includes('expiry') ||
    q.includes('expire')
  ) {
    const now = new Date().getTime();
    const sixtyDaysMs = 60 * 24 * 60 * 60 * 1000;
    const expiring: any[] = [];

    products.forEach((p) => {
      p.batches.forEach((b) => {
        if (b.expiryDate) {
          const diff = new Date(b.expiryDate).getTime() - now;
          if (diff <= sixtyDaysMs && b.currentStock > 0) {
            expiring.push({
              productNameMr: p.nameMr,
              productNameEn: p.nameEn,
              batch: b.batchNumber,
              expiryDate: b.expiryDate,
              stock: b.currentStock,
              unit: p.unit,
            });
          }
        }
      });
    });

    let mrText = `⏳ *पुढील ६० दिवसांत मुदत संपणाऱ्या बॅचेस (${expiring.length})*:\n\n`;
    let enText = `⏳ *Batches Expiring in Next 60 Days (${expiring.length})*:\n\n`;

    expiring.forEach((item, idx) => {
      mrText += `${idx + 1}. *${item.productNameMr}*\n   बॅच: ${item.batch} | मुदत: ${item.expiryDate} | शिल्लक: ${item.stock} ${item.unit}\n`;
      enText += `${idx + 1}. *${item.productNameEn}*\n   Batch: ${item.batch} | Exp: ${item.expiryDate} | Stock: ${item.stock} ${item.unit}\n`;
    });

    if (expiring.length === 0) {
      mrText = `✅ पुढील ६० दिवसांत कोणतीही बॅच एक्सपायर होत नाही.`;
      enText = `✅ No batches are expiring in the next 60 days.`;
    }

    return {
      answerMr: mrText,
      answerEn: enText,
      toolUsed: 'getExpiringBatches',
      dataSummary: expiring,
    };
  }

  // 5. Customer Outstanding / Khata Query (शेतकरी उधारी)
  if (
    q.includes('उधारी') ||
    q.includes('खाते') ||
    q.includes('khata') ||
    q.includes('outstanding') ||
    q.includes('बाकी')
  ) {
    const debtors = customers.filter((c) => c.outstandingBalance > 0);
    const totalDue = debtors.reduce((acc, c) => acc + c.outstandingBalance, 0);

    let mrKhata = `📋 *शेतकरी उधारी (Khata) येणे बाकी*: एकूण ₹${totalDue.toLocaleString('en-IN')}\n\n`;
    let enKhata = `📋 *Farmer Outstanding Balances*: Total ₹${totalDue.toLocaleString('en-IN')}\n\n`;

    debtors.forEach((c, idx) => {
      mrKhata += `${idx + 1}. *${c.name}* (${c.village}) — ₹${c.outstandingBalance.toLocaleString('en-IN')}\n`;
      enKhata += `${idx + 1}. *${c.name}* (${c.village}) — ₹${c.outstandingBalance.toLocaleString('en-IN')}\n`;
    });

    return {
      answerMr: mrKhata,
      answerEn: enKhata,
      toolUsed: 'getCustomerKhataSummary',
      dataSummary: { totalDue, count: debtors.length, debtors },
    };
  }

  // 6. Default Business Intelligence Overview
  return {
    answerMr: `🌾 *श्री कृष्ण ॲग्रो - बिझनेस असिस्टंट ओव्हरव्ह्यू*:\n\n• एकूण विक्री: ₹${kpi.totalRevenue.toLocaleString('en-IN')}\n• निव्वळ नफा: ₹${kpi.netProfit.toLocaleString('en-IN')}\n• शेतकरी उधारी येणे: ₹${kpi.totalCustomerOutstanding.toLocaleString('en-IN')}\n• सप्लायर देणे: ₹${kpi.totalSupplierOutstanding.toLocaleString('en-IN')}\n• कमी स्टॉक अलर्ट: ${kpi.lowStockCount} आयटम्स\n\nअधिक माहितीसाठी विचारा: *"विक्री किती?", "कमी माल कोणता?", "उधारी दाखव", "नफा किती?"*`,
    answerEn: `🌾 *Shri Krishna Agro - Business Intelligence Overview*:\n\n• Total Revenue: ₹${kpi.totalRevenue.toLocaleString('en-IN')}\n• Net Profit: ₹${kpi.netProfit.toLocaleString('en-IN')}\n• Farmer Receivables: ₹${kpi.totalCustomerOutstanding.toLocaleString('en-IN')}\n• Supplier Payables: ₹${kpi.totalSupplierOutstanding.toLocaleString('en-IN')}\n• Low Stock Alerts: ${kpi.lowStockCount} items\n\nAsk me anytime about sales, inventory, net profit, or customer khata.`,
    toolUsed: 'getGeneralBusinessOverview',
    dataSummary: kpi,
  };
}
