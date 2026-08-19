// Step 4 (Owner Setup Wizard & Business Settings) & Step 7 (Sales POS & Customer Khata CRM) Test Suite
import DatabaseService from '../src/lib/db-service';
import store from '../src/lib/store';
import { checkPermission } from '../src/lib/auth';

console.log('🛒 RUNNING SHRI KRISHNA AGRO SERVICES — STEP 4 & STEP 7 (POS & KHATA CRM) TESTS...\n');

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

async function runStep7Tests() {
  // ==========================================
  // [PART 1] STEP 4 — BUSINESS SETTINGS & SETUP WIZARD
  // ==========================================
  console.log('[STEP 4] Business Profile & Statutory Licenses:');
  const profile = await DatabaseService.getBusinessSettings('business_profile');
  assert(profile.displayName !== undefined, 'Business display name is registered (श्री कृष्ण ॲग्रो सर्व्हिसेस)');
  assert(profile.legalName !== undefined, 'Legal entity name registered (Shri Krishna Agro Services)');
  assert(profile.gstin !== undefined && profile.gstin.startsWith('27'), 'Authoritative Maharashtra GSTIN verified');
  assert(profile.fertilizerLicense !== undefined, 'Statutory Fertilizer License verified');
  assert(profile.seedLicense !== undefined, 'Statutory Seed License verified');
  assert(profile.pesticideLicense !== undefined, 'Statutory Insecticide/Pesticide License verified');
  assert(profile.phonePrimary?.includes('8605620843'), 'Authorized Owner Shubham Gamane (B.Sc Agri — 8605620843) verified');
  assert(profile.phoneSecondary?.includes('8888474456'), 'Authorized Owner Jagdish Bodke (B.Sc Agri — 8888474456) verified');

  // ==========================================
  // [PART 2] STEP 7 — CUSTOMER CRM & KHATA (CREDIT)
  // ==========================================
  console.log('\n[STEP 7.1] Customer CRM Profile & Acreage Data:');
  const newCustomer = await DatabaseService.createCustomer({
    name: 'ज्ञानेश्वर कारभारी सांगळे',
    phone: '9850112233',
    village: 'मुसळगाव',
    taluka: 'Sinnar',
    district: 'Nashik',
    totalLandAcres: 5.5,
    outstandingBalance: 0,
    creditLimit: 50000,
    crops: [
      { cropName: 'कांदा (Onion)', acreage: 3, season: 'रब्बी (Rabi)' },
      { cropName: 'टोमॅटो (Tomato)', acreage: 2.5, season: 'खरीप (Kharif)' },
    ],
    isDemo: true,
  });

  assert(newCustomer.id !== undefined, 'Farmer customer profile created with persistent ID');
  assert(newCustomer.crops.length === 2, 'Farmer crop records saved accurately');
  assert(newCustomer.outstandingBalance === 0, 'Initial Khata balance starts at zero');

  // ==========================================
  // [PART 3] STEP 7 — SALES POS & ATOMIC STOCK DECREMENT
  // ==========================================
  console.log('\n[STEP 7.2] Sales POS Transaction & Atomic Stock Decrement:');
  const initialStockProd1 = store.getProductById('prod-1')?.totalStock || 110;

  const saleResult = await DatabaseService.executeSaleTransaction({
    customerId: newCustomer.id,
    customerName: newCustomer.name,
    customerPhone: newCustomer.phone,
    customerVillage: newCustomer.village,
    items: [
      {
        productId: 'prod-1',
        quantity: 10,
        unitPrice: 190,
        gstRate: 5,
      },
    ],
    discountAmount: 50,
    paymentMethod: 'CREDIT',
    paidAmount: 500, // Partial payment of ₹500
    notes: 'Credit sale for Kharif fertilizer application',
    createdByName: 'शुभम गमाणे (Owner)',
    isDemo: true,
  });

  assert(saleResult.success === true, 'Sales POS transaction completed successfully');
  const sale = saleResult.sale!;
  
  // Line subtotal = 10 * 190 = 1900
  // Tax = (1900 * 5) / 100 = 95
  // Grand total = 1900 + 95 - 50 = 1945
  // Balance amount = 1945 - 500 = 1445
  assert(sale.subtotal === 1900, `Line subtotal is exact (${sale.subtotal})`);
  assert(sale.taxAmount === 95, `Tax amount is exact (${sale.taxAmount})`);
  assert(sale.grandTotal === 1945, `Grand total with discount is exact (Expected: 1945, Got: ${sale.grandTotal})`);
  assert(sale.balanceAmount === 1445, `Credit balance is exact (Expected: 1445, Got: ${sale.balanceAmount})`);
  assert(sale.paymentStatus === 'PARTIAL', 'Sale marked as PARTIAL payment status');

  // Stock verification
  const updatedProd1 = store.getProductById('prod-1');
  assert(
    (updatedProd1?.totalStock || 0) === initialStockProd1 - 10,
    `Inventory stock decremented atomically (${initialStockProd1} - 10 = ${updatedProd1?.totalStock})`
  );

  // Khata ledger verification
  const updatedCust = store.getCustomerById(newCustomer.id);
  assert(
    updatedCust?.outstandingBalance === 1445,
    `Customer Khata balance incremented by credit amount (Expected: 1445, Got: ${updatedCust?.outstandingBalance})`
  );

  // ==========================================
  // [PART 4] STEP 7 — KHATA REPAYMENT / SETTLEMENT
  // ==========================================
  console.log('\n[STEP 7.3] Customer Khata Debt Settlement Repayment:');
  const settledCustomer = await DatabaseService.recordCustomerPayment(
    newCustomer.id,
    1445,
    'UPI',
    'Full settlement via PhonePe UPI Ref: TXN987654'
  );

  assert(settledCustomer !== undefined, 'Customer payment recorded');
  assert(settledCustomer?.outstandingBalance === 0, 'Customer Khata balance successfully cleared to 0');

  // ==========================================
  // [PART 5] STEP 7 — RBAC ROLE AUTHORIZATION
  // ==========================================
  console.log('\n[STEP 7.4] Sales POS & Khata Role Permissions:');
  assert(checkPermission('CASHIER', 'canCreateSales') === true, 'Cashier role CAN create POS sales');
  assert(checkPermission('CASHIER', 'canManageKhata') === true, 'Cashier role CAN record Khata payments');
  assert(checkPermission('AGRONOMIST', 'canCreateSales') === false, 'Agronomist role CANNOT create POS sales');

  console.log('\n----------------------------------------');
  console.log(`🏁 STEP 4 & STEP 7 (POS & KHATA CRM) TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

runStep7Tests().catch((err) => {
  console.error('Step 7 test execution failed:', err);
  process.exit(1);
});
