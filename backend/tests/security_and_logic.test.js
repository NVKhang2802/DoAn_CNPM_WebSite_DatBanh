const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('=======================================================');
console.log('[TEST RUNNER] Starting Production Security & Logic Audit Verification');
console.log('=======================================================');

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
  }
}

// 1. Test SEC-001: Order routes authorization check
runTest('SEC-001: PUT /orders/status/:madh requires RBAC middleware', () => {
  const orderRoutesContent = fs.readFileSync(path.join(__dirname, '../src/routes/order.routes.js'), 'utf8');
  assert.ok(
    orderRoutesContent.includes("router.put('/status/:madh', requireRole(['ADMIN', 'QUẢN LÝ', 'NHÂN VIÊN'])"),
    'Order status update route must require role authorization!'
  );
});

// 2. Test SEC-002: Hardcoded JWT Fallback removal
runTest('SEC-002: No hardcoded JWT secret fallback strings exist', () => {
  const authMiddlewareContent = fs.readFileSync(path.join(__dirname, '../src/middlewares/auth.middleware.js'), 'utf8');
  const authServiceContent = fs.readFileSync(path.join(__dirname, '../src/services/auth.service.js'), 'utf8');
  
  assert.strictEqual(
    authMiddlewareContent.includes('CakeOrderingSuperSecretEnterpriseKey2026!'),
    false,
    'auth.middleware.js must not contain hardcoded JWT secret string'
  );
  assert.strictEqual(
    authServiceContent.includes('CakeOrderingSuperSecretEnterpriseKey2026!'),
    false,
    'auth.service.js must not contain hardcoded JWT secret string'
  );
});

// 3. Test SEC-003: IDOR Order detail ownership check
runTest('SEC-003: Order detail service verifies user ownership', () => {
  const orderServiceContent = fs.readFileSync(path.join(__dirname, '../src/services/order.service.js'), 'utf8');
  assert.ok(
    orderServiceContent.includes('ForbiddenError') && orderServiceContent.includes('detail.order.MAKH === currentUser.userId'),
    'Order service must verify order ownership before returning details'
  );
});

// 4. Test SEC-004: Password change verifies current password
runTest('SEC-004: Change password verifies current password using bcrypt', () => {
  const userServiceContent = fs.readFileSync(path.join(__dirname, '../src/services/user.service.js'), 'utf8');
  assert.ok(
    userServiceContent.includes('currentPassword') && userServiceContent.includes('bcrypt.compare'),
    'User service changePassword must verify currentPassword with bcrypt'
  );
});

// 5. Test DB-001: Concurrency Safe Sequences in procedures.sql
runTest('DB-001: SQL Sequences present in procedures.sql', () => {
  const proceduresContent = fs.readFileSync(path.join(__dirname, '../src/db/procedures.sql'), 'utf8');
  assert.ok(
    proceduresContent.includes('seq_DonHang') && proceduresContent.includes('NEXT VALUE FOR seq_DonHang'),
    'procedures.sql must use SQL Sequences for atomic order ID generation'
  );
});

// 6. Test LOGIC-001: Voucher validation in sp_DonHang_TaoMoi
runTest('LOGIC-001: Voucher expiration and stock checked in sp_DonHang_TaoMoi', () => {
  const proceduresContent = fs.readFileSync(path.join(__dirname, '../src/db/procedures.sql'), 'utf8');
  assert.ok(
    proceduresContent.includes('@NgayKetThuc < GETDATE()') && proceduresContent.includes('@SoluongVoucher <= 0'),
    'sp_DonHang_TaoMoi must validate voucher expiry date and remaining quantity'
  );
});

// 7. Test LOGIC-002: Verified Purchase check in sp_DanhGia_ThemMoi
runTest('LOGIC-002: Verified purchase check in sp_DanhGia_ThemMoi', () => {
  const proceduresContent = fs.readFileSync(path.join(__dirname, '../src/db/procedures.sql'), 'utf8');
  assert.ok(
    proceduresContent.includes("TRANGTHAI = N'HOÀN THÀNH'"),
    'sp_DanhGia_ThemMoi must check that customer has a completed order for the product'
  );
});

// 8. Test SEC-005: Safe CORS Config
runTest('SEC-005: CORS uses environment CLIENT_URL instead of wildcard *', () => {
  const serverContent = fs.readFileSync(path.join(__dirname, '../src/server.js'), 'utf8');
  assert.ok(
    serverContent.includes('CLIENT_URL') && !serverContent.includes("origin: '*'"),
    'server.js must configure CORS from CLIENT_URL environment variable'
  );
});

// 9. Test CONF-001: Error Handler Sanitization
runTest('CONF-001: Error handler sanitizes internal DB error messages on Production', () => {
  const errorMiddlewareContent = fs.readFileSync(path.join(__dirname, '../src/middlewares/error.middleware.js'), 'utf8');
  assert.ok(
    errorMiddlewareContent.includes('isProd') && errorMiddlewareContent.includes('!err.isOperational'),
    'globalErrorHandler must sanitize non-operational error messages on Production'
  );
});

console.log('=======================================================');
console.log(`[TEST SUMMARY] Passed ${passed}/${total} security & logic audit tests.`);
console.log('=======================================================');

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
