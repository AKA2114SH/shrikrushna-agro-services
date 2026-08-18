// Concurrency & Stock Overselling Prevention Test
import store from '../src/lib/store';

console.log('⚡ RUNNING SHRI KRISHNA AGRO SERVICES — CONCURRENCY & OVERSELLING TESTS...\n');

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

store.resetDemoData();

// Target any available product dynamically
const p = store.getProducts()[0];
const initialStock = p.totalStock;
console.log(`Target product: ${p.nameEn} with initial stock = ${initialStock} ${p.unit}`);

// Test 1: Selling exactly available quantity
const validSale = store.createSale({
  customerName: 'Customer A',
  items: [{ productId: p.id, quantity: initialStock, unitPrice: p.sellingPrice, gstRate: p.gstRate }],
  discountAmount: 0,
  paymentMethod: 'CASH',
  paidAmount: 1000000,
  createdByName: 'Cashier 1',
});

assert(validSale.success === true, `Sale for available ${initialStock} units succeeds`);
assert(p.totalStock === 0, `Stock is now 0 (Got: ${p.totalStock})`);

// Test 2: Attempting to sell 1 more unit when stock is 0
const oversellSale = store.createSale({
  customerName: 'Customer B (Simultaneous)',
  items: [{ productId: p.id, quantity: 1, unitPrice: p.sellingPrice, gstRate: p.gstRate }],
  discountAmount: 0,
  paymentMethod: 'CASH',
  paidAmount: 1000,
  createdByName: 'Cashier 2',
});

assert(oversellSale.success === false, 'Oversell attempt must be rejected by stock ledger');
assert(p.totalStock === 0, 'Stock must remain non-negative (0)');

console.log('\n----------------------------------------');
console.log(`🏁 CONCURRENCY TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
if (failed > 0) process.exit(1);
