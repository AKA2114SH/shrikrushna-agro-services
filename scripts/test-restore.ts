// Backup & Restore Disaster Recovery Automated Test Suite
import store from '../src/lib/store';

console.log('💾 RUNNING SHRI KRISHNA AGRO SERVICES — BACKUP & RESTORE TESTS...\n');

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

async function runTests() {
  // [TEST 1] Generate Complete Enterprise Backup JSON
  console.log('[TEST 1] Generating Master Enterprise Backup JSON Snapshot:');
  const initialProducts = store.getProducts();
  const initialCustomers = store.getCustomers();
  const initialSales = store.getSales();
  const initialPurchases = store.getPurchases();
  const initialExpenses = store.getExpenses();

  const backupPayload = {
    version: '1.0.0',
    exportTimestamp: new Date().toISOString(),
    system: 'Shri Krishna Agro Services, Sinnar',
    data: {
      products: initialProducts,
      customers: initialCustomers,
      sales: initialSales,
      purchases: initialPurchases,
      expenses: initialExpenses,
    },
  };

  const jsonString = JSON.stringify(backupPayload);
  assert(jsonString.length > 5000, `Backup JSON payload must be substantial (Generated size: ${jsonString.length} bytes)`);
  assert(backupPayload.data.products.length >= 28, `Backup must contain all 28 Sinnar products (Found: ${backupPayload.data.products.length})`);

  // [TEST 2] Mutate State (Simulate Data Loss or Accidental Deletion)
  console.log('\n[TEST 2] Simulating State Mutation / Corrupted Ledger:');
  const initialCount = store.getProducts().length;
  // Modify a product stock and price in memory
  const prod1 = store.getProductById('prod-1');
  const originalPrice = prod1?.sellingPrice;
  if (prod1) {
    prod1.sellingPrice = 99999;
    prod1.totalStock = 0;
  }
  assert(store.getProductById('prod-1')?.sellingPrice === 99999, 'Product mutated to corrupted test state');

  // [TEST 3] Execute Full Restore from Snapshot
  console.log('\n[TEST 3] Executing Disaster Recovery Restore from Snapshot:');
  const parsedBackup = JSON.parse(jsonString);
  store.restoreFromBackup(parsedBackup.data);

  // [TEST 4] Verify Restored State Fidelity
  console.log('\n[TEST 4] Verifying Restored State Integrity:');
  const restoredProd1 = store.getProductById('prod-1');
  assert(restoredProd1 !== undefined, 'Product prod-1 must exist after restore');
  assert(restoredProd1?.sellingPrice === originalPrice, `Selling price must be restored to authentic rate (Expected: ${originalPrice}, Got: ${restoredProd1?.sellingPrice})`);
  assert(store.getProducts().length === initialCount, `Product catalog count must match original (Expected: ${initialCount}, Got: ${store.getProducts().length})`);
  assert(store.getCustomers().length === initialCustomers.length, `Customer count must match original (Expected: ${initialCustomers.length}, Got: ${store.getCustomers().length})`);
  assert(store.getSales().length === initialSales.length, `Sales count must match original (Expected: ${initialSales.length}, Got: ${store.getSales().length})`);

  console.log('\n----------------------------------------');
  console.log(`🏁 BACKUP & RESTORE TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
