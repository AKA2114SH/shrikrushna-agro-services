// Step 10: Expenses & Profit Financial Engine Automated Test Suite
import DatabaseService from '../src/lib/db-service';
import store from '../src/lib/store';
import { checkPermission } from '../src/lib/auth';

console.log('📊 RUNNING SHRI KRISHNA AGRO SERVICES — STEP 10 (EXPENSES & PROFIT ENGINE) TESTS...\n');

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

async function runStep10Tests() {
  // [TEST 1] Expense Creation & Category Verification
  console.log('[TEST 1] Business Expense Creation & Categorization:');
  const initialExpenses = await DatabaseService.getExpenses(true);
  const initialExpenseCount = initialExpenses.length;

  const newExpense = await DatabaseService.createExpense({
    category: 'ELECTRICITY',
    amount: 3200,
    paymentMethod: 'UPI',
    vendor: 'महावितरण (MSEDCL Sinnar)',
    notes: 'दुकान व गोडाऊन वीजबिल (Shop & Warehouse Electricity)',
    expenseDate: '2026-08-15',
    recordedByName: 'शुभम गमाणे (Owner)',
    isDemo: true,
  });

  assert(newExpense.id !== undefined, 'Expense created with persistent ID');
  assert(newExpense.category === 'ELECTRICITY', 'Expense category assigned correctly');
  assert(newExpense.amount === 3200, 'Expense amount saved accurately (₹3,200)');

  const updatedExpenses = await DatabaseService.getExpenses(true);
  assert(updatedExpenses.length === initialExpenseCount + 1, `Total expense records incremented (${initialExpenseCount} + 1 = ${updatedExpenses.length})`);

  // [TEST 2] Financial P&L Engine (Revenue, COGS, Gross Profit, Expenses, Net Profit)
  console.log('\n[TEST 2] Financial P&L Aggregation & Exact Formulation:');
  const kpis = await DatabaseService.getFinancialKPIs();

  // Validate Revenue
  const sales = await DatabaseService.getSales(true);
  const calculatedRevenue = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  assert(kpis.totalRevenue === calculatedRevenue, `Total Revenue matches sales ledger (₹${kpis.totalRevenue})`);

  // Validate COGS
  let calculatedCOGS = 0;
  const products = await DatabaseService.getProducts(true);
  sales.forEach((s) => {
    s.items.forEach((it) => {
      const prod = products.find((p) => p.id === it.productId);
      const cost = prod?.purchasePrice || it.unitPrice * 0.75;
      calculatedCOGS += cost * it.quantity;
    });
  });
  assert(kpis.totalCOGS === calculatedCOGS, `Total COGS derived accurately from transaction line items (₹${kpis.totalCOGS})`);

  // Validate Gross Profit = Revenue - COGS
  const expectedGrossProfit = calculatedRevenue - calculatedCOGS;
  assert(kpis.grossProfit === expectedGrossProfit, `Gross Profit is exactly Revenue - COGS (₹${kpis.grossProfit})`);

  // Validate Expenses
  const calculatedExpenses = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);
  assert(kpis.totalExpenses === calculatedExpenses, `Total operating expenses match ledger (₹${kpis.totalExpenses})`);

  // Validate Net Profit = Gross Profit - Expenses
  const expectedNetProfit = expectedGrossProfit - calculatedExpenses;
  assert(kpis.netProfit === expectedNetProfit, `Net Profit is exactly Gross Profit - Total Expenses (₹${kpis.netProfit})`);

  // Validate Net Margin Percentage
  const expectedNetMargin = calculatedRevenue > 0 ? Number(((expectedNetProfit / calculatedRevenue) * 100).toFixed(1)) : 0;
  assert(kpis.netMarginPercent === expectedNetMargin, `Net Margin percentage is exact (${kpis.netMarginPercent}%)`);

  // [TEST 3] Trade Debtors & Trade Creditors Balances
  console.log('\n[TEST 3] Balance Sheet Receivables & Payables Ledger:');
  const customers = await DatabaseService.getCustomers(true);
  const expectedDebtors = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
  assert(kpis.totalCustomerOutstanding === expectedDebtors, `Trade Debtors (Farmer Khata) matches CRM ledger (₹${kpis.totalCustomerOutstanding})`);

  const suppliers = await DatabaseService.getSuppliers(true);
  const expectedCreditors = suppliers.reduce((sum, s) => sum + s.outstandingPayable, 0);
  assert(kpis.totalSupplierOutstanding === expectedCreditors, `Trade Creditors (Supplier Payables) matches Purchase ledger (₹${kpis.totalSupplierOutstanding})`);

  // [TEST 4] Financial RBAC Security Enforcement
  console.log('\n[TEST 4] Financial Reporting & Profit Access RBAC:');
  assert(checkPermission('OWNER', 'canViewProfit') === true, 'Owner has financial profit report access');
  assert(checkPermission('ACCOUNTANT', 'canViewProfit') === true, 'Accountant has financial profit report access');
  assert(checkPermission('MANAGER', 'canViewProfit') === false, 'Manager is strictly restricted from viewing profit margins');
  assert(checkPermission('CASHIER', 'canViewProfit') === false, 'Cashier is strictly restricted from viewing profit margins');
  assert(checkPermission('AGRONOMIST', 'canViewProfit') === false, 'Agronomist is strictly restricted from viewing profit margins');

  // [TEST 5] Expense Recording RBAC
  console.log('\n[TEST 5] Expense Entry RBAC:');
  assert(checkPermission('OWNER', 'canManageExpenses') === true, 'Owner has expense entry rights');
  assert(checkPermission('ACCOUNTANT', 'canManageExpenses') === true, 'Accountant has expense entry rights');
  assert(checkPermission('MANAGER', 'canManageExpenses') === false, 'Manager is strictly restricted from managing business expenses');
  assert(checkPermission('CASHIER', 'canManageExpenses') === false, 'Cashier is denied expense entry rights');
  assert(checkPermission('AGRONOMIST', 'canManageExpenses') === false, 'Agronomist is denied expense entry rights');

  console.log('\n----------------------------------------');
  console.log(`🏁 STEP 10 (EXPENSES & PROFIT ENGINE) TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

runStep10Tests().catch((err) => {
  console.error('Step 10 test execution failed:', err);
  process.exit(1);
});
