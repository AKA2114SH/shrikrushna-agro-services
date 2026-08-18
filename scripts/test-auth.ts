// Authentication & JWT Cryptography Automated Test Suite
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  getJwtSecretKey,
  AuthUser,
} from '../src/lib/auth';
import { SignJWT } from 'jose';

console.log('🔑 RUNNING SHRI KRISHNA AGRO SERVICES — AUTH & CRYPTOGRAPHY TESTS...\n');

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
  // [TEST 1] Password Hashing & Bcrypt Verification
  console.log('[TEST 1] Bcrypt Password Hashing:');
  const plainPassword = 'shubham@agro2026';
  const hashed = await hashPassword(plainPassword);
  assert(hashed.startsWith('$2'), 'Bcrypt hash should start with standard salt prefix $2');
  assert(await verifyPassword(plainPassword, hashed) === true, 'Correct password verifies successfully');
  assert(await verifyPassword('wrongpassword', hashed) === false, 'Incorrect password must be rejected');

  // [TEST 2] Session Token Creation & Verification
  console.log('\n[TEST 2] JWT Session Token Lifecycle:');
  const testUser: AuthUser = {
    id: 'user_shubham_1',
    name: 'Shubham Gamane',
    phone: '8605620843',
    email: 'shubham@shrikrishnaagro.in',
    role: 'OWNER',
    isDemo: false,
  };

  const token = await createSessionToken(testUser);
  assert(typeof token === 'string' && token.split('.').length === 3, 'JWT token must be a valid 3-part header.payload.sig string');

  const verified = await verifySessionToken(token);
  assert(verified !== null, 'Valid session token must decode successfully');
  assert(verified?.id === testUser.id, `User ID must match (Expected: ${testUser.id}, Got: ${verified?.id})`);
  assert(verified?.role === 'OWNER', `Role claim must be preserved (Got: ${verified?.role})`);

  // [TEST 3] Tampered Token Signature Rejection
  console.log('\n[TEST 3] Tampered Token Signature Rejection:');
  const parts = token.split('.');
  // Flip characters in payload
  const tamperedPayload = Buffer.from(JSON.stringify({ sub: 'user_attacker', role: 'OWNER' })).toString('base64url');
  const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;
  const tamperedResult = await verifySessionToken(tamperedToken);
  assert(tamperedResult === null, 'Tampered token signature must be completely rejected (returns null)');

  // [TEST 4] Expired Token Rejection
  console.log('\n[TEST 4] Expired Token Rejection:');
  const expiredToken = await new SignJWT({ sub: 'user_expired', role: 'CASHIER' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(Math.floor(Date.now() / 1000) - 3600)
    .setExpirationTime(Math.floor(Date.now() / 1000) - 1800) // Expired 30 mins ago
    .sign(getJwtSecretKey());

  const expiredResult = await verifySessionToken(expiredToken);
  assert(expiredResult === null, 'Expired token must be rejected (returns null)');

  console.log('\n----------------------------------------');
  console.log(`🏁 AUTH TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
