// Security & RBAC Boundary Denial Test Suite
import { checkPermission } from '../src/lib/auth';

console.log('🔒 RUNNING SHRI KRISHNA AGRO SERVICES — SECURITY & RBAC TESTS...\n');

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

// 1. CASHIER Role Boundaries
console.log('[TEST 1] CASHIER Role Boundary Permissions:');
assert(checkPermission('CASHIER', 'canCreateSales') === true, 'Cashier CAN create POS sales');
assert(checkPermission('CASHIER', 'canManageKhata') === true, 'Cashier CAN manage farmer khata collections');
assert(checkPermission('CASHIER', 'canViewProfit') === false, 'Cashier CANNOT view net profit / balance sheet');
assert(checkPermission('CASHIER', 'canViewPurchaseMargins') === false, 'Cashier CANNOT view supplier purchase margins');
assert(checkPermission('CASHIER', 'canAccessOwnerAI') === false, 'Cashier CANNOT access Owner AI assistant');
assert(checkPermission('CASHIER', 'canManageStaff') === false, 'Cashier CANNOT manage staff accounts');

// 2. AGRONOMIST Role Boundaries
console.log('\n[TEST 2] AGRONOMIST Role Boundary Permissions:');
assert(checkPermission('AGRONOMIST', 'canCreateQuotations') === true, 'Agronomist CAN generate crop quotations');
assert(checkPermission('AGRONOMIST', 'canViewProfit') === false, 'Agronomist CANNOT view net profit reports');
assert(checkPermission('AGRONOMIST', 'canViewPurchaseMargins') === false, 'Agronomist CANNOT view dealer purchase margins');
assert(checkPermission('AGRONOMIST', 'canManagePurchases') === false, 'Agronomist CANNOT enter purchase orders');

// 3. ACCOUNTANT Role Boundaries
console.log('\n[TEST 3] ACCOUNTANT Role Boundary Permissions:');
assert(checkPermission('ACCOUNTANT', 'canViewProfit') === true, 'Accountant CAN view net profit & balance sheet');
assert(checkPermission('ACCOUNTANT', 'canManageExpenses') === true, 'Accountant CAN record business expenses');
assert(checkPermission('ACCOUNTANT', 'canManageStaff') === false, 'Accountant CANNOT modify staff or user roles');
assert(checkPermission('ACCOUNTANT', 'canAccessOwnerAI') === false, 'Accountant CANNOT access Owner private AI');

// 4. OWNER Role Full Governance
console.log('\n[TEST 4] OWNER Role Permissions:');
assert(checkPermission('OWNER', 'canViewProfit') === true, 'Owner has profit report access');
assert(checkPermission('OWNER', 'canAccessOwnerAI') === true, 'Owner has AI Assistant access');
assert(checkPermission('OWNER', 'canManageStaff') === true, 'Owner has Staff and Role governance access');
assert(checkPermission('OWNER', 'canManageSettings') === true, 'Owner has Business Settings & License access');

console.log('\n----------------------------------------');
console.log(`🏁 SECURITY TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
if (failed > 0) process.exit(1);
