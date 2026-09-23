const http = require('http');
const app = require('../app');
const { pool } = require('../config/db');

// Helper to make local HTTP requests to the app
function request(server, { method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const options = {
      hostname: '127.0.0.1',
      port: address.port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runAuthTests() {
  console.log('==================================================');
  console.log('🧪 Running RoomVerse Phase 5 Auth & RBAC Test Suite');
  console.log('==================================================\n');

  // Start temporary HTTP test server
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));

  let passedTests = 0;
  let totalTests = 0;

  function assert(description, condition, details = '') {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${description}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${description} ${details}`);
    }
  }

  const testEmailTenant = `test.tenant.${Date.now()}@example.com`;
  const testEmailOwner = `test.owner.${Date.now()}@example.com`;
  const testPassword = 'Password@123';
  let tenantToken = '';
  let ownerToken = '';

  try {
    // --------------------------------------------------------------------------
    // 1. REGISTRATION TESTS
    // --------------------------------------------------------------------------
    console.log('--- 1. Registration Tests ---');

    // 1.1 Valid Tenant Registration
    const regTenantRes = await request(server, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'Test Tenant User',
        email: testEmailTenant,
        password: testPassword,
        role: 'tenant',
        phone: '+91 9111122222',
      },
    });
    assert('Register valid tenant returns 201 and token', regTenantRes.status === 201 && regTenantRes.body.data?.token);
    assert('Register returns safe user without password hash', !regTenantRes.body.data?.user?.password && !regTenantRes.body.data?.user?.password_hash);
    tenantToken = regTenantRes.body.data?.token;

    // 1.2 Valid Owner Registration
    const regOwnerRes = await request(server, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'Test Owner User',
        email: testEmailOwner,
        password: testPassword,
        role: 'owner',
        phone: '+91 9333344444',
      },
    });
    assert('Register valid owner returns 201 and token', regOwnerRes.status === 201 && regOwnerRes.body.data?.token);
    ownerToken = regOwnerRes.body.data?.token;

    // 1.3 Duplicate Email Registration
    const dupRes = await request(server, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'Duplicate Tenant',
        email: testEmailTenant,
        password: testPassword,
        role: 'tenant',
      },
    });
    assert('Duplicate email registration returns 409 Conflict', dupRes.status === 409);

    // 1.4 Invalid Email / Weak Password
    const invalidRes = await request(server, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'Bad',
        email: 'not-an-email',
        password: '123', // < 6 chars
        role: 'tenant',
      },
    });
    assert('Invalid email / weak password returns 400 Bad Request', invalidRes.status === 400 && invalidRes.body.errors?.length >= 2);

    // 1.5 Public Admin Registration Prohibition
    const adminRegRes = await request(server, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'Hacker Admin',
        email: 'hacker@example.com',
        password: testPassword,
        role: 'admin',
      },
    });
    assert('Public admin registration returns 400 Bad Request', adminRegRes.status === 400 && adminRegRes.body.message.includes('Validation failed'));

    // --------------------------------------------------------------------------
    // 2. LOGIN TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 2. Login Tests ---');

    // 2.1 Valid Credentials
    const loginRes = await request(server, {
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: testEmailTenant,
        password: testPassword,
      },
    });
    assert('Login with valid credentials returns 200 and JWT', loginRes.status === 200 && Boolean(loginRes.body.data?.token));
    assert('Login response excludes password_hash', !loginRes.body.data?.user?.password_hash);

    // 2.2 Wrong Password
    const wrongPwRes = await request(server, {
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: testEmailTenant,
        password: 'IncorrectPassword',
      },
    });
    assert('Login with wrong password returns 401 Unauthorized', wrongPwRes.status === 401);

    // 2.3 Unknown Email
    const unknownRes = await request(server, {
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: 'nonexistent.user@example.com',
        password: testPassword,
      },
    });
    assert('Login with non-existent email returns 401 Unauthorized', unknownRes.status === 401);

    // --------------------------------------------------------------------------
    // 3. AUTHENTICATION & /ME ENDPOINT
    // --------------------------------------------------------------------------
    console.log('\n--- 3. /api/auth/me & Middleware Verification ---');

    // 3.1 Valid Token /me
    const meValidRes = await request(server, {
      method: 'GET',
      path: '/api/auth/me',
      headers: { Authorization: `Bearer ${tenantToken}` },
    });
    assert('GET /api/auth/me returns 200 with fresh DB user & profile', meValidRes.status === 200 && meValidRes.body.data?.user?.email === testEmailTenant);

    // 3.2 Missing Token
    const meMissingRes = await request(server, {
      method: 'GET',
      path: '/api/auth/me',
    });
    assert('GET /api/auth/me without token returns 401 Unauthorized', meMissingRes.status === 401);

    // 3.3 Invalid Token
    const meInvalidRes = await request(server, {
      method: 'GET',
      path: '/api/auth/me',
      headers: { Authorization: 'Bearer this-is-not-a-valid-jwt-token' },
    });
    assert('GET /api/auth/me with malformed token returns 401 Unauthorized', meInvalidRes.status === 401);

    // --------------------------------------------------------------------------
    // 4. RBAC MIDDLEWARE TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 4. Role-Based Access Control (RBAC) Tests ---');

    // 4.1 Tenant accesses tenant-only route
    const tenantOkRes = await request(server, {
      method: 'GET',
      path: '/api/auth/test-role/tenant',
      headers: { Authorization: `Bearer ${tenantToken}` },
    });
    assert('Tenant accessing tenant-only endpoint returns 200 OK', tenantOkRes.status === 200);

    // 4.2 Tenant accesses owner-only route (Forbidden)
    const tenantDeniedRes = await request(server, {
      method: 'GET',
      path: '/api/auth/test-role/owner',
      headers: { Authorization: `Bearer ${tenantToken}` },
    });
    assert('Tenant accessing owner-only endpoint returns 403 Forbidden', tenantDeniedRes.status === 403);

    // 4.3 Owner accesses owner-only route
    const ownerOkRes = await request(server, {
      method: 'GET',
      path: '/api/auth/test-role/owner',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert('Owner accessing owner-only endpoint returns 200 OK', ownerOkRes.status === 200);

    // 4.4 Tenant accesses admin-only route (Forbidden)
    const tenantAdminDeniedRes = await request(server, {
      method: 'GET',
      path: '/api/auth/test-role/admin',
      headers: { Authorization: `Bearer ${tenantToken}` },
    });
    assert('Tenant accessing admin-only endpoint returns 403 Forbidden', tenantAdminDeniedRes.status === 403);

    // --------------------------------------------------------------------------
    // 5. SYSTEM HEALTH CHECK CONTINUITY
    // --------------------------------------------------------------------------
    console.log('\n--- 5. Health & Database Continuity Check ---');
    const healthRes = await request(server, {
      method: 'GET',
      path: '/api/health',
    });
    assert('GET /api/health still returns 200 with DB status online', healthRes.status === 200 && healthRes.body.data?.database?.connected === true);

  } finally {
    // Clean up test accounts from database
    console.log('\n🧹 Cleaning up test accounts from database...');
    await pool.query('DELETE FROM users WHERE email IN (?, ?)', [testEmailTenant, testEmailOwner]);

    server.close();
    await pool.end();
  }

  console.log('==================================================');
  console.log(`📊 Test Results: ${passedTests}/${totalTests} Passed`);
  console.log('==================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAuthTests().catch((err) => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});