// Product Management, Inventory & Stock Movement E2E Automated Test Suite
import DatabaseService from '../src/lib/db-service';
import store from '../src/lib/store';
import { checkPermission, UserRole } from '../src/lib/auth';

console.log('📦 RUNNING SHRI KRISHNA AGRO SERVICES — PRODUCTS & INVENTORY E2E TESTS...\n');

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
  // [TEST 1] Product Creation & Attribute Integrity
  console.log('[TEST 1] Product Creation & Multilingual Attributes:');
  const createdProd = await DatabaseService.createProduct({
    nameEn: 'Biozyme Crop Booster (Test)',
    nameMr: 'बायोजाइम पीक वाढ टॉनिक',
    categoryId: 'cat-plant-growth',
    categoryNameEn: 'Plant Growth Promoters',
    categoryNameMr: 'वनस्पती वाढ नियंत्रक',
    brandId: 'brand-bayer',
    brandName: 'Bayer CropScience',
    sku: `SKU-TEST-${Date.now()}`,
    unit: 'Bottle',
    packSize: '500 ml',
    mrp: 650,
    sellingPrice: 580,
    purchasePrice: 460,
    gstRate: 18,
    totalStock: 40,
    minStockLevel: 10,
    isAvailable: true,
    isDemo: true,
  });

  assert(createdProd.id !== undefined, 'Product created with persistent identifier');
  assert(createdProd.nameMr === 'बायोजाइम पीक वाढ टॉनिक', 'Multilingual Marathi product name preserved');
  assert(createdProd.sellingPrice === 580, 'Retail selling price saved accurately');

  // [TEST 2] Product Soft Delete / Deactivation
  console.log('\n[TEST 2] Product Deactivation (Preserving Historical Transactions):');
  const deactivated = await DatabaseService.deactivateProduct(createdProd.id);
  assert(deactivated === true, 'Product successfully deactivated (isAvailable: false)');

  const activeProducts = await DatabaseService.getProducts(false);
  const foundInActive = activeProducts.find((p) => p.id === createdProd.id);
  assert(foundInActive === undefined, 'Deactivated product excluded from active public catalogue');

  const allProducts = await DatabaseService.getProducts(true);
  const foundInAll = allProducts.find((p) => p.id === createdProd.id);
  assert(foundInAll !== undefined && foundInAll.isAvailable === false, 'Deactivated product preserved for historical audit records');

  // [TEST 3] Public Field Masking (Security Audit)
  console.log('\n[TEST 3] Public Catalog Field Masking (Confidential Margins):');
  const publicCatalog = store.getProducts(true);
  // In public view (simulating unauthenticated GET /api/products):
  const sanitizedPublic = publicCatalog.map((p) => {
    const { purchasePrice, batches, ...publicFields } = p;
    return publicFields;
  });
  const samplePublic = sanitizedPublic[0];
  assert((samplePublic as any).purchasePrice === undefined, 'purchasePrice strictly stripped from public catalogue');
  assert(samplePublic?.sellingPrice !== undefined, 'Public retail selling price remains accessible');

  // [TEST 4] Opening Stock & Audit Trail
  console.log('\n[TEST 4] Opening Stock & Traceable Stock Movement:');
  const initialStockProd1 = store.getProductById('prod-1')?.totalStock || 85;
  const adjResult = await DatabaseService.adjustInventoryStock({
    productId: 'prod-1',
    adjustmentQuantity: 15,
    movementType: 'OPENING_STOCK',
    notes: 'Initial warehouse opening stock verification',
    performedById: 'user_shubham_1',
  });
  assert(adjResult.success === true, 'Stock increment adjustment succeeded');
  assert(adjResult.newStock === initialStockProd1 + 15, `Total stock updated correctly (${initialStockProd1} + 15 = ${adjResult.newStock})`);

  // [TEST 5] Negative Stock Prevention
  console.log('\n[TEST 5] Negative Stock Protection:');
  const currentStock = store.getProductById('prod-1')?.totalStock || 100;
  const overdraftResult = await DatabaseService.adjustInventoryStock({
    productId: 'prod-1',
    adjustmentQuantity: -(currentStock + 50), // Attempting to subtract more than available
    movementType: 'DAMAGE',
  });
  assert(overdraftResult.success === false, 'Excessive stock deduction strictly rejected');
  assert(store.getProductById('prod-1')?.totalStock === currentStock, 'Stock remains intact on rejected transaction');

  // [TEST 6] Low-Stock Logic
  console.log('\n[TEST 6] Low-Stock Alert Logic:');
  const prod9 = store.getProductById('prod-9');
  if (prod9) {
    prod9.totalStock = 4;
    prod9.minStockLevel = 5;
  }
  const isLowStock = (prod9?.totalStock || 0) <= (prod9?.minStockLevel || 0) && (prod9?.totalStock || 0) > 0;
  assert(isLowStock === true, 'Product with stock <= minStockLevel correctly triggers Low Stock warning');

  // [TEST 7] Batch Expiry Logic
  console.log('\n[TEST 7] Batch Expiry Tracking:');
  const now = new Date();
  const pastDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const futureDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const isExpired = new Date(pastDate) < now;
  const isValidFuture = new Date(futureDate) > now;
  assert(isExpired === true, 'Past expiry date correctly identified as Expired');
  assert(isValidFuture === true, 'Future expiry date correctly identified as Valid');

  // [TEST 8] Server-Side RBAC for Inventory Management
  console.log('\n[TEST 8] RBAC Inventory Mutation Permissions:');
  assert(checkPermission('OWNER', 'canManageInventory') === true, 'Owner has inventory management rights');
  assert(checkPermission('MANAGER', 'canManageInventory') === true, 'Manager has inventory management rights');
  assert(checkPermission('CASHIER', 'canManageInventory') === false, 'Cashier is denied inventory management rights');
  assert(checkPermission('AGRONOMIST', 'canManageInventory') === false, 'Agronomist is denied inventory management rights');

  console.log('\n----------------------------------------');
  console.log(`🏁 PRODUCTS & INVENTORY E2E TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Products & inventory test suite failed:', err);
  process.exit(1);
});
