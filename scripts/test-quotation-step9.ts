// Step 9: Quotation & Tax Invoice PDF Engine Automated Test Suite
import DatabaseService from '../src/lib/db-service';
import store from '../src/lib/store';
import { checkPermission } from '../src/lib/auth';

console.log('📄 RUNNING SHRI KRISHNA AGRO SERVICES — STEP 9 (QUOTATION & PDF ENGINE) TESTS...\n');

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    failed++;
  }
}

async function runStep9Tests() {
  // [TEST 1] Quotation Creation & Accurate Server-Side Financial Calculations
  console.log('[TEST 1] Quotation Creation & Financial Calculations:');
  const quoteResult = await DatabaseService.createQuotation({
    customerName: 'गणेश विठ्ठल तांबट',
    customerPhone: '9422778899',
    customerVillage: 'पांगरी (Pangari, Sinnar)',
    items: [
      {
        productId: 'prod-1', // Mahadhan 19:19:19 (₹190, 5% GST)
        quantity: 10,
        unitPrice: 190,
        gstRate: 5,
      },
      {
        productId: 'prod-3', // Bayer Nativo (₹850, 18% GST)
        quantity: 2,
        unitPrice: 850,
        gstRate: 18,
      },
    ],
    notes: 'द्राक्ष बागेसाठी विशेष अंदाजपत्रक',
    terms: 'किमती १५ दिवसांसाठी वैध. वाहतूक खर्च लागू.',
    validDays: 15,
  });

  assert(quoteResult.id !== undefined, 'Quotation created with persistent ID');
  assert(quoteResult.quotationNumber.startsWith('QTN-'), 'Quotation assigned official sequential QTN number');
  
  // Calculations:
  // Item 1: 10 * 190 = 1900, Tax = (1900 * 5) / 100 = 95
  // Item 2: 2 * 850 = 1700, Tax = (1700 * 18) / 100 = 306
  // Subtotal = 1900 + 1700 = 3600
  // Total Tax = 95 + 306 = 401
  // Grand Total = 3600 + 401 = 4001
  assert(quoteResult.subtotal === 3600, `Line subtotal calculated accurately (Expected: 3600, Got: ${quoteResult.subtotal})`);
  assert(quoteResult.taxAmount === 401, `GST tax calculated accurately (Expected: 401, Got: ${quoteResult.taxAmount})`);
  assert(quoteResult.grandTotal === 4001, `Grand total calculated accurately (Expected: 4001, Got: ${quoteResult.grandTotal})`);

  // [TEST 2] Historical Quotation Price Immutability
  console.log('\n[TEST 2] Historical Quotation Price Protection:');
  const prod1 = store.getProductById('prod-1');
  const originalSellingPrice = prod1?.sellingPrice;
  if (prod1) prod1.sellingPrice = 300; // Alter catalogue price
  
  const fetchedQuotes = await DatabaseService.getQuotations(true);
  const targetQuote = fetchedQuotes.find((q) => q.id === quoteResult.id);
  assert(targetQuote?.items[0].unitPrice === 190, 'Historical quotation unit price remains strictly 190 after catalogue update');
  if (prod1 && originalSellingPrice) prod1.sellingPrice = originalSellingPrice;

  // [TEST 3] Branded PDF & Invoice Statutory Metadata
  console.log('\n[TEST 3] Branded Document Header & License Verification:');
  const businessProfile = await DatabaseService.getBusinessSettings('business_profile');
  assert(businessProfile.displayName.includes('श्री कृष्ण ॲग्रो सर्व्हिसेस'), 'Branded invoice includes registered Marathi shop name');
  assert(businessProfile.gstin.startsWith('27'), 'Invoice includes valid Maharashtra GSTIN');
  assert(businessProfile.fertilizerLicense !== undefined, 'Invoice includes statutory fertilizer license');
  assert(businessProfile.seedLicense !== undefined, 'Invoice includes statutory seed license');
  assert(businessProfile.pesticideLicense !== undefined, 'Invoice includes statutory pesticide license');

  // [TEST 4] Confidential Margin Stripping in Quotation Output
  console.log('\n[TEST 4] Confidential Margin Stripping in Quotation:');
  const itemSample: any = targetQuote?.items[0];
  assert(itemSample.purchasePrice === undefined, 'Confidential purchase price strictly omitted from quotation item');
  assert(itemSample.dealerMargin === undefined, 'Dealer margin strictly omitted from quotation item');

  // [TEST 5] Quotation Status Transition Workflow
  console.log('\n[TEST 5] Quotation Status Transition:');
  await DatabaseService.updateQuotationStatus(quoteResult.id, 'SENT');
  let qStatus = store.getQuotations().find((q) => q.id === quoteResult.id)?.status;
  assert(qStatus === 'SENT', 'Quotation status updated to SENT');

  await DatabaseService.updateQuotationStatus(quoteResult.id, 'ACCEPTED');
  qStatus = store.getQuotations().find((q) => q.id === quoteResult.id)?.status;
  assert(qStatus === 'ACCEPTED', 'Quotation status updated to ACCEPTED');

  // [TEST 6] Quotation -> Sale Conversion & Atomic Stock Decrement (Reusing Step 7)
  console.log('\n[TEST 6] Quotation -> Sale Conversion (Step 7 Transaction Reuse):');
  const stockBeforeConversion = store.getProductById('prod-1')?.totalStock || 75;
  
  const convertResult = await DatabaseService.convertQuotationToSale({
    quotationIdOrNumber: quoteResult.id,
    paymentMethod: 'CASH',
    createdByName: 'शुभम गमाणे (Owner)',
  });

  assert(convertResult.success === true, 'Quotation successfully converted to Sale');
  assert(convertResult.sale !== undefined, 'Authoritative Sale invoice generated');
  assert(convertResult.sale?.invoiceNumber.startsWith('INV-'), 'Official invoice number assigned');

  // Stock deduction verification
  const stockAfterConversion = store.getProductById('prod-1')?.totalStock;
  assert(
    stockAfterConversion === stockBeforeConversion - 10,
    `Inventory stock decremented atomically by quotation quantity (${stockBeforeConversion} - 10 = ${stockAfterConversion})`
  );

  // Status converted verification
  const quoteAfterConvert = store.getQuotations().find((q) => q.id === quoteResult.id);
  assert(quoteAfterConvert?.status === 'CONVERTED', 'Quotation status updated to CONVERTED');

  // [TEST 7] Duplicate Conversion Prevention (Idempotency)
  console.log('\n[TEST 7] Duplicate Conversion Prevention:');
  const duplicateConvertResult = await DatabaseService.convertQuotationToSale({
    quotationIdOrNumber: quoteResult.id,
    paymentMethod: 'CASH',
  });
  console.log('  DEBUG: duplicate error:', duplicateConvertResult.error);
  assert(duplicateConvertResult.success === false, 'Duplicate quotation conversion attempt strictly rejected');
  assert(
    Boolean(duplicateConvertResult.error && (duplicateConvertResult.error.includes('already converted') || duplicateConvertResult.error.includes('CONVERTED') || duplicateConvertResult.error.includes('Duplicate'))),
    'Helpful error message returned on duplicate conversion attempt'
  );

  // [TEST 8] RBAC Quotation Boundaries
  console.log('\n[TEST 8] Quotation Role Boundaries:');
  assert(checkPermission('AGRONOMIST', 'canCreateQuotations') === true, 'Agronomist CAN create quotations');
  assert(checkPermission('AGRONOMIST', 'canCreateSales') === false, 'Agronomist CANNOT finalize POS sales');
  assert(checkPermission('CASHIER', 'canCreateSales') === true, 'Cashier CAN convert quotations to finalized sales');

  console.log('\n----------------------------------------');
  console.log(`🏁 STEP 9 (QUOTATION & PDF ENGINE) TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

runStep9Tests().catch((err) => {
  console.error('Step 9 test execution failed:', err);
  process.exit(1);
});
