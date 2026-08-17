import store, { Quotation, Sale } from './store';

export function generatePrintableQuotationHTML(quotation: Quotation): string {
  const profile = store.getProfile();

  return `
<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <title>Quotation ${quotation.quotationNumber} - Shri Krishna Agro Services</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; color: #1e293b; line-height: 1.5; }
    .header-box { border-bottom: 2px solid #047857; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-title { font-size: 24px; font-weight: bold; color: #064e3b; margin: 0; }
    .brand-sub { font-size: 14px; color: #059669; margin: 2px 0 0 0; }
    .meta-box { font-size: 12px; color: #475569; }
    .quote-title-badge { display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 4px 12px; font-weight: bold; border-radius: 4px; font-size: 14px; }
    .party-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; font-size: 13px; }
    .party-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
    .table-custom { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    .table-custom th { background: #064e3b; color: white; text-align: left; padding: 8px 12px; }
    .table-custom td { border-bottom: 1px solid #e2e8f0; padding: 8px 12px; }
    .table-custom tr:nth-child(even) { background: #f8fafc; }
    .total-box { margin-left: auto; width: 280px; font-size: 13px; margin-bottom: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .grand-total { font-weight: bold; font-size: 16px; color: #064e3b; border-top: 2px solid #047857; padding-top: 6px; }
    .footer-box { border-top: 1px dashed #cbd5e1; padding-top: 16px; margin-top: 30px; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; }
    .sig-box { text-align: center; margin-top: 20px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <h1 class="brand-title">श्री कृष्ण ॲग्रो सर्व्हिसेस (Shri Krishna Agro Services)</h1>
      <p class="brand-sub">विश्वासू कृषी निविष्ठा व आधुनिक पीक सल्ला केंद्र</p>
      <p class="meta-box" style="margin-top: 6px;">
        पत्ता: ${profile.address}, ${profile.village}, जि. ${profile.district} (PIN: ${profile.pincode})<br>
        मोबाईल: ${profile.phonePrimary} / ${profile.phoneSecondary} | GSTIN: ${profile.gstin}<br>
        खत परवाना: ${profile.fertilizerLicense} | बियाणे परवाना: ${profile.seedLicense} | कीटकनाशक: ${profile.pesticideLicense}
      </p>
    </div>
    <div style="text-align: right;">
      <span class="quote-title-badge">अधिकृत दरपत्रक (ESTIMATE / QUOTATION)</span>
      <p style="margin: 8px 0 0 0; font-weight: bold; font-size: 14px; color: #0f172a;">क्रमांक: ${quotation.quotationNumber}</p>
      <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">दिनांक: ${new Date(quotation.createdAt).toLocaleDateString('en-IN')}</p>
      <p style="margin: 2px 0 0 0; font-size: 12px; color: #b45309;">वैधता: ${new Date(quotation.validUntil).toLocaleDateString('en-IN')} पर्यंत</p>
    </div>
  </div>

  <div class="party-grid">
    <div class="party-card">
      <strong style="color: #065f46;">शेतकऱ्याचे नाव व तपशील (Customer / Farmer):</strong><br>
      <strong>${quotation.customerName}</strong><br>
      मोबाईल: ${quotation.customerPhone}<br>
      गाव: ${quotation.customerVillage || 'सिन्नर परिसर'}
    </div>
    <div class="party-card">
      <strong style="color: #065f46;">बँक व डिजिटल पेमेंट तपशील:</strong><br>
      बँक: ${profile.bankName} | A/C: ${profile.bankAccountNo}<br>
      IFSC: ${profile.bankIfsc} (${profile.bankBranch})<br>
      UPI ID: <strong>${profile.upiId}</strong>
    </div>
  </div>

  <table class="table-custom">
    <thead>
      <tr>
        <th style="width: 40px;">अ.क्र.</th>
        <th>उत्पादनाचे नाव व तपशील</th>
        <th>पॅकिंग</th>
        <th style="text-align: right;">नग/प्रमाण</th>
        <th style="text-align: right;">दर (₹)</th>
        <th style="text-align: right;">GST</th>
        <th style="text-align: right;">एकूण रक्कम (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${quotation.items
        .map(
          (item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${item.productName}</strong></td>
          <td>${item.packSize}</td>
          <td style="text-align: right;">${item.quantity}</td>
          <td style="text-align: right;">₹${item.unitPrice.toLocaleString('en-IN')}</td>
          <td style="text-align: right;">${item.gstRate}%</td>
          <td style="text-align: right; font-weight: bold;">₹${item.totalPrice.toLocaleString('en-IN')}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="total-box">
    <div class="total-row">
      <span>एकूण उप-रक्कम (Subtotal):</span>
      <span>₹${quotation.subtotal.toLocaleString('en-IN')}</span>
    </div>
    <div class="total-row">
      <span>GST कर (Tax):</span>
      <span>₹${quotation.taxAmount.toLocaleString('en-IN')}</span>
    </div>
    ${
      quotation.discountAmount > 0
        ? `
    <div class="total-row" style="color: #059669;">
      <span>सूट (Discount):</span>
      <span>- ₹${quotation.discountAmount.toLocaleString('en-IN')}</span>
    </div>
    `
        : ''
    }
    <div class="total-row grand-total">
      <span>अंतिम एकूण रक्कम:</span>
      <span>₹${quotation.grandTotal.toLocaleString('en-IN')}</span>
    </div>
  </div>

  <div style="font-size: 12px; background: #fffbeb; border: 1px solid #fde68a; padding: 10px; border-radius: 6px; margin-bottom: 20px;">
    <strong>नियम व अटी:</strong> ${quotation.terms || 'दरपत्रकातील दर चालू बाजारभावानुसार असून १५ दिवसांसाठी वैध आहेत. मालाची पोहोच सिन्नर गोडावूनमधून.'}<br>
    ${quotation.notes ? `<strong>विशेष सूचना:</strong> ${quotation.notes}` : ''}
  </div>

  <div class="footer-box">
    <div>
      <em>हे संगणकीय कोटेशन श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर तर्फे जारी केले आहे.</em>
    </div>
    <div class="sig-box">
      <strong>अधिकृत स्वाक्षरी / शिक्का</strong><br>
      <span style="font-size: 11px; color: #475569;">${quotation.createdByName}</span><br>
      <span style="font-size: 10px; color: #047857;">श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर</span>
    </div>
  </div>

  <div class="no-print" style="margin-top: 24px; text-align: center;">
    <button onclick="window.print()" style="background: #047857; color: white; padding: 10px 24px; font-size: 14px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🖨️ प्रिंट / PDF सेव्ह करा</button>
  </div>
</body>
</html>
  `;
}

export function generatePrintableInvoiceHTML(sale: Sale): string {
  const profile = store.getProfile();

  return `
<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice ${sale.invoiceNumber} - Shri Krishna Agro Services</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; color: #1e293b; line-height: 1.5; }
    .header-box { border-bottom: 2px solid #047857; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-title { font-size: 22px; font-weight: bold; color: #064e3b; margin: 0; }
    .brand-sub { font-size: 13px; color: #059669; margin: 2px 0 0 0; }
    .meta-box { font-size: 12px; color: #475569; }
    .invoice-badge { display: inline-block; background: #064e3b; color: white; padding: 4px 12px; font-weight: bold; border-radius: 4px; font-size: 13px; }
    .party-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; font-size: 13px; }
    .party-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
    .table-custom { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    .table-custom th { background: #0f172a; color: white; text-align: left; padding: 8px 12px; }
    .table-custom td { border-bottom: 1px solid #e2e8f0; padding: 8px 12px; }
    .table-custom tr:nth-child(even) { background: #f8fafc; }
    .total-box { margin-left: auto; width: 280px; font-size: 13px; margin-bottom: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .grand-total { font-weight: bold; font-size: 16px; color: #064e3b; border-top: 2px solid #047857; padding-top: 6px; }
    .footer-box { border-top: 1px dashed #cbd5e1; padding-top: 16px; margin-top: 30px; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; }
    .sig-box { text-align: center; margin-top: 20px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <h1 class="brand-title">श्री कृष्ण ॲग्रो सर्व्हिसेस (Shri Krishna Agro Services)</h1>
      <p class="brand-sub">कृषी निविष्ठा, बियाणे, खते व औषधे विक्री केंद्र</p>
      <p class="meta-box" style="margin-top: 6px;">
        पत्ता: ${profile.address}, ${profile.village}, जि. ${profile.district}<br>
        मोबाईल: ${profile.phonePrimary} | GSTIN: ${profile.gstin}<br>
        FL: ${profile.fertilizerLicense} | SL: ${profile.seedLicense} | PL: ${profile.pesticideLicense}
      </p>
    </div>
    <div style="text-align: right;">
      <span class="invoice-badge">TAX INVOICE / कर पावती</span>
      <p style="margin: 8px 0 0 0; font-weight: bold; font-size: 14px;">बिल क्र: ${sale.invoiceNumber}</p>
      <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">दिनांक: ${new Date(sale.createdAt).toLocaleDateString('en-IN')}</p>
      <p style="margin: 2px 0 0 0; font-size: 12px; color: #047857; font-weight: bold;">पेमेंट: ${sale.paymentMethod} (${sale.paymentStatus})</p>
    </div>
  </div>

  <div class="party-grid">
    <div class="party-card">
      <strong style="color: #065f46;">ग्राहकाचे नाव:</strong> <strong>${sale.customerName}</strong><br>
      मोबाईल: ${sale.customerPhone || 'N/A'}<br>
      गाव: ${sale.customerVillage || 'सिन्नर'}
    </div>
    <div class="party-card">
      <strong style="color: #065f46;">पेमेंट स्थिती:</strong><br>
      जमा रक्कम (Paid): ₹${sale.paidAmount.toLocaleString('en-IN')}<br>
      बाकी रक्कम (Balance): <strong>₹${sale.balanceAmount.toLocaleString('en-IN')}</strong>
    </div>
  </div>

  <table class="table-custom">
    <thead>
      <tr>
        <th style="width: 40px;">अ.क्र.</th>
        <th>मालाचे नाव</th>
        <th>बॅच क्र.</th>
        <th style="text-align: right;">प्रमाण</th>
        <th style="text-align: right;">दर (₹)</th>
        <th style="text-align: right;">GST</th>
        <th style="text-align: right;">रक्कम (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${sale.items
        .map(
          (item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${item.productName}</strong></td>
          <td>${item.batchNumber || '-'}</td>
          <td style="text-align: right;">${item.quantity}</td>
          <td style="text-align: right;">₹${item.unitPrice.toLocaleString('en-IN')}</td>
          <td style="text-align: right;">${item.gstRate}%</td>
          <td style="text-align: right; font-weight: bold;">₹${item.totalPrice.toLocaleString('en-IN')}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="total-box">
    <div class="total-row">
      <span>उप-रक्कम (Subtotal):</span>
      <span>₹${sale.subtotal.toLocaleString('en-IN')}</span>
    </div>
    <div class="total-row">
      <span>GST कर:</span>
      <span>₹${sale.taxAmount.toLocaleString('en-IN')}</span>
    </div>
    ${
      sale.discountAmount > 0
        ? `
    <div class="total-row" style="color: #059669;">
      <span>सूट (Discount):</span>
      <span>- ₹${sale.discountAmount.toLocaleString('en-IN')}</span>
    </div>
    `
        : ''
    }
    <div class="total-row grand-total">
      <span>एकूण बिल रक्कम:</span>
      <span>₹${sale.grandTotal.toLocaleString('en-IN')}</span>
    </div>
  </div>

  <div class="footer-box">
    <div>
      <em>विकलेला माल परत घेतला जाणार नाही. कीटकनाशकांचा वापर कृषी तज्ञांच्या सल्ल्यानेच करावा.</em>
    </div>
    <div class="sig-box">
      <strong>श्री कृष्ण ॲग्रो सर्व्हिसेस</strong><br>
      <span style="font-size: 11px; color: #475569;">बिल बनवणारे: ${sale.createdByName}</span>
    </div>
  </div>

  <div class="no-print" style="margin-top: 24px; text-align: center;">
    <button onclick="window.print()" style="background: #047857; color: white; padding: 10px 24px; font-size: 14px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🖨️ बिल प्रिंट करा</button>
  </div>
</body>
</html>
  `;
}
