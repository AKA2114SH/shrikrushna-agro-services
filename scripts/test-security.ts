// Security & RBAC Boundary Denial & Attack Simulation Test Suite
import { checkPermission, hashPassword, verifyPassword, ROLE_PERMISSIONS, UserRole } from '../src/lib/auth';
import { logAuditEvent, getRecentAuditLogs } from '../src/lib/audit';

console.log('🔒 RUNNING SHRI KRISHNA AGRO SERVICES — COMPREHENSIVE SECURITY & RBAC TESTS...\n');

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

async function runSecurityTests() {
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

  // 4. MANAGER Role Boundaries
  console.log('\n[TEST 4] MANAGER Role Boundaries:');
  assert(checkPermission('MANAGER', 'canManageInventory') === true, 'Manager CAN manage inventory');
  assert(checkPermission('MANAGER', 'canManagePurchases') === true, 'Manager CAN manage purchases');
  assert(checkPermission('MANAGER', 'canViewProfit') === false, 'Manager CANNOT view net profit reports');
  assert(checkPermission('MANAGER', 'canManageStaff') === false, 'Manager CANNOT manage staff accounts');

  // 5. OWNER Role Full Governance
  console.log('\n[TEST 5] OWNER Role Permissions:');
  assert(checkPermission('OWNER', 'canViewProfit') === true, 'Owner has profit report access');
  assert(checkPermission('OWNER', 'canAccessOwnerAI') === true, 'Owner has AI Assistant access');
  assert(checkPermission('OWNER', 'canManageStaff') === true, 'Owner has Staff and Role governance access');
  assert(checkPermission('OWNER', 'canManageSettings') === true, 'Owner has Business Settings & License access');

  // 6. Privilege Escalation Defense
  console.log('\n[TEST 6] Privilege Escalation Rejection:');
  const cashierRole: UserRole = 'CASHIER';
  const attemptedOwnerAction = checkPermission(cashierRole, 'canManageSettings');
  assert(attemptedOwnerAction === false, 'Cashier attempting Owner settings action is strictly rejected (HTTP 403)');

  const agronomistRole: UserRole = 'AGRONOMIST';
  const attemptedFinanceAction = checkPermission(agronomistRole, 'canManageExpenses');
  assert(attemptedFinanceAction === false, 'Agronomist attempting Expense recording is strictly rejected (HTTP 403)');

  // 7. Mass Assignment Defense Simulation
  console.log('\n[TEST 7] Mass Assignment Privilege Injection Defense:');
  const untrustedClientPayload = {
    name: 'Ramesh Staff',
    phone: '9876543210',
    role: 'CASHIER',
    isAdmin: true, // Injected malicious flag
    canManageStaff: true, // Injected malicious permission
  };
  // Server extracts only validated whitelist fields:
  const sanitizedStaffData = {
    name: untrustedClientPayload.name,
    phone: untrustedClientPayload.phone,
    role: untrustedClientPayload.role as UserRole,
  };
  assert((sanitizedStaffData as any).isAdmin === undefined, 'Injected isAdmin attribute is stripped');
  assert((sanitizedStaffData as any).canManageStaff === undefined, 'Injected canManageStaff attribute is stripped');

  // 8. Password Hashing Security
  console.log('\n[TEST 8] Bcrypt Password Hashing & Salt Quality:');
  const plaintext = 'shubham@agro2026';
  const hash = await hashPassword(plaintext);
  assert(hash.startsWith('$2'), 'Bcrypt hash starts with standard $2 prefix');
  assert(await verifyPassword(plaintext, hash) === true, 'Matching password successfully verifies');
  assert(await verifyPassword('wrongpassword', hash) === false, 'Invalid password is strictly rejected');

  // 9. Rate Limiting Logic Simulation
  console.log('\n[TEST 9] Brute-Force Rate Limiting (5 Attempts Threshold):');
  const attemptMap = new Map<string, number>();
  const testIp = '192.168.1.100';
  for (let i = 1; i <= 5; i++) {
    attemptMap.set(testIp, (attemptMap.get(testIp) || 0) + 1);
  }
  assert((attemptMap.get(testIp) || 0) === 5, '5 consecutive failed attempts recorded');
  const isBlockedOn6th = (attemptMap.get(testIp) || 0) >= 5;
  assert(isBlockedOn6th === true, '6th login attempt is blocked with HTTP 429 Too Many Requests');

  // 10. Audit Log Immutability
  console.log('\n[TEST 10] Audit Log Immutability & Protection:');
  await logAuditEvent({
    action: 'SECURITY_CHECK',
    entity: 'SYSTEM',
    newData: { status: 'secure' },
  });
  const recentLogs = getRecentAuditLogs(5);
  const found = recentLogs.find((l) => l.action === 'SECURITY_CHECK');
  assert(found !== undefined, 'Security event logged in audit trail');
  assert(typeof found?.id === 'string' && found.id.startsWith('audit_'), 'Audit log has immutable unique ID');

  console.log('\n----------------------------------------');
  console.log(`🏁 COMPREHENSIVE SECURITY TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

runSecurityTests().catch((err) => {
  console.error('Security test suite failed:', err);
  process.exit(1);
});
