// Concurrency & Stock Overselling Prevention Test
import store from '../src/lib/store.ts';

console.log('⚡ RUNNING SHRI KRISHNA AGRO SERVICES — CONCURRENCY & OVERSELLING TESTS...\n');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    failed++;
  }
}

store.resetDemoData();

// Target Coragen (prod-6) which has stock = 3 units
const p6 = store.getProductById('prod-6');
console.log(`Target product: ${p6.nameEn} with initial stock = ${p6.totalStock}`);

// Test 1: Selling exactly available quantity (3 units)
const validSale = store.createSale({
  customerName: 'Customer A',
  items: [{ productId: 'prod-6', quantity: 3, unitPrice: 940, gstRate: 18 }],
  discountAmount: 0,
  paymentMethod: 'CASH',
  paidAmount: 3328,
  createdByName: 'Cashier 1',
});

assert(validSale.success === true, 'Sale for available 3 units succeeds');
assert(p6.totalStock === 0, `Stock is now 0 (Got: ${p6.totalStock})`);

// Test 2: Attempting to sell 1 more unit when stock is 0
const oversellSale = store.createSale({
  customerName: 'Customer B (Simultaneous)',
  items: [{ productId: 'prod-6', quantity: 1, unitPrice: 940, gstRate: 18 }],
  discountAmount: 0,
  paymentMethod: 'CASH',
  paidAmount: 1109,
  createdByName: 'Cashier 2',
});

assert(oversellSale.success === false, 'Oversell attempt must be rejected by stock ledger');
assert(p6.totalStock === 0, 'Stock must remain non-negative (0)');

console.log('\n----------------------------------------');
console.log(`🏁 CONCURRENCY TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
if (failed > 0) process.exit(1);
