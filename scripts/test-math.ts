// Math & Accounting Accuracy Test Suite
import store from '../src/lib/store';

console.log('🧪 RUNNING SHRI KRISHNA AGRO SERVICES — MATH & ACCOUNTING TESTS...\n');

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

// 1. Initial State & Stock Movements
store.resetDemoData();
const p1 = store.getProductById('prod-1')!;
const initialStock = p1.totalStock;
console.log(`[TEST 1] Initial Stock of ${p1.nameEn}: ${initialStock} ${p1.unit}`);

// 2. Perform a Sale
const saleResult = store.createSale({
  customerName: 'Test Farmer Dnyaneshwar',
  customerPhone: '9822000000',
  items: [
    {
      productId: 'prod-1',
      batchId: p1.batches[0]?.id,
      quantity: 5,
      unitPrice: 190,
      gstRate: 5,
    },
  ],
  discountAmount: 50,
  paymentMethod: 'CASH',
  paidAmount: 948,
  createdByName: 'Test Cashier',
});

assert(saleResult.success === true, 'Sale creation should succeed');
assert(p1.totalStock === initialStock - 5, `Stock must decrement by exactly 5 (Expected: ${initialStock - 5}, Got: ${p1.totalStock})`);

const sale = saleResult.sale!;
const expectedSubtotal = 5 * 190; // 950
const expectedTax = (950 * 5) / 100; // 47.5
const expectedGrandTotal = Math.round(950 + 47.5 - 50); // 948

assert(sale.subtotal === expectedSubtotal, `Subtotal math correct (${sale.subtotal} === ${expectedSubtotal})`);
assert(sale.taxAmount === expectedTax, `Tax math correct (${sale.taxAmount} === ${expectedTax})`);
assert(sale.grandTotal === expectedGrandTotal, `Grand total with discount correct (${sale.grandTotal} === ${expectedGrandTotal})`);

// 3. Perform a Purchase & Landed Cost Stock Addition
const p4 = store.getProductById('prod-4')!;
const p4InitialStock = p4.totalStock;
const purchaseResult = store.recordPurchase({
  supplierId: 'sup-1',
  invoiceNumber: 'PUR-TEST-99',
  items: [
    {
      productId: 'prod-4',
      batchNumber: 'BATCH-TEST-2026',
      mfgDate: '2026-08-01',
      expiryDate: '2028-08-01',
      quantity: 20,
      unitCost: 600,
      gstRate: 18,
    },
  ],
  freightCost: 200,
  otherCosts: 50,
  paymentMethod: 'BANK_TRANSFER',
  paidAmount: 14410,
  createdByName: 'Test Manager',
});

assert(purchaseResult.success === true, 'Purchase record should succeed');
assert(p4.totalStock === p4InitialStock + 20, `Product stock must increment by exactly 20 (Expected: ${p4InitialStock + 20}, Got: ${p4.totalStock})`);

// 4. Financial KPI & Net Profit Formula Verification
const kpis = store.getFinancialKPIs();
const calculatedGross = kpis.totalRevenue - kpis.totalCOGS;
const calculatedNet = calculatedGross - kpis.totalExpenses;

assert(Math.abs(kpis.grossProfit - calculatedGross) < 0.01, `Gross Profit = Revenue - COGS (${kpis.grossProfit} === ${calculatedGross})`);
assert(Math.abs(kpis.netProfit - calculatedNet) < 0.01, `Net Profit = Gross Profit - Expenses (${kpis.netProfit} === ${calculatedNet})`);

console.log('\n----------------------------------------');
console.log(`🏁 MATH TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
if (failed > 0) process.exit(1);
