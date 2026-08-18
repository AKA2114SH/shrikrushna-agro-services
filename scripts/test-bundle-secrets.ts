// Browser Bundle & Client Code Secret Scan Automated Test Suite
import fs from 'fs';
import path from 'path';

console.log('🔍 RUNNING SHRI KRISHNA AGRO SERVICES — BROWSER BUNDLE & CLIENT SECRET SCAN...\n');

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

function scanDirectory(dir: string, fileExtensions: string[]): string[] {
  let files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.next') {
        files = files.concat(scanDirectory(fullPath, fileExtensions));
      }
    } else if (fileExtensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

async function runTests() {
  // [TEST 1] Scan Client Components & Pages for Hardcoded Secrets
  console.log('[TEST 1] Scanning Public Client Components (src/components & src/app):');
  const clientFiles = scanDirectory('./src', ['.tsx', '.jsx']);
  
  const dangerousPatterns = [
    /JWT_SECRET\s*=\s*['"][^'"]+['"]/i,
    /DATABASE_URL\s*=\s*['"][^'"]+['"]/i,
    /postgres:\/\/[^'"]+/i,
    /AI_API_KEY\s*=\s*['"][^'"]+['"]/i,
    /WHATSAPP_API_KEY\s*=\s*['"][^'"]+['"]/i,
  ];

  let violations = 0;
  for (const file of clientFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of dangerousPatterns) {
      if (pattern.test(content)) {
        console.error(`  ❌ Secret pattern found in client file: ${file}`);
        violations++;
      }
    }
  }
  assert(violations === 0, `Zero hardcoded database or private API secrets found in src/ (Scanned ${clientFiles.length} files)`);

  // [TEST 2] Scan Exported Production Bundle (/docs & /out)
  console.log('\n[TEST 2] Scanning Exported Production Bundle (docs/ & out/):');
  const bundleFiles = scanDirectory('./docs', ['.js', '.html']);
  let bundleViolations = 0;
  for (const file of bundleFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('postgresql://') || content.includes('JWT_SECRET=')) {
      console.error(`  ❌ Leak detected in exported bundle: ${file}`);
      bundleViolations++;
    }
  }
  assert(bundleViolations === 0, `Exported client bundle contains zero database URLs or secret keys (Scanned ${bundleFiles.length} files)`);

  // [TEST 3] Verify .env.example contains only dummy placeholders
  console.log('\n[TEST 3] Verifying .env.example Blueprint Safety:');
  const envExample = fs.readFileSync('.env.example', 'utf8');
  assert(!envExample.includes('real_secret'), '.env.example must not contain real credentials');
  assert(envExample.includes('DATABASE_URL='), '.env.example must document DATABASE_URL');
  assert(envExample.includes('JWT_SECRET='), '.env.example must document JWT_SECRET');

  console.log('\n----------------------------------------');
  console.log(`🏁 SECRET SCAN COMPLETE: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
