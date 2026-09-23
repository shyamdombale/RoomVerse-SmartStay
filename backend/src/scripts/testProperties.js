const http = require('http');
const app = require('../app');
const { pool } = require('../config/db');

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
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runPropertyTests() {
  console.log('==================================================');
  console.log('🏢 Running RoomVerse Phase 6 Property Management Tests');
  console.log('==================================================\n');

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

  try {
    // 1. Obtain Tokens from Seeded Accounts (Password: Password@123)
    const tenantLogin = await request(server, {
      method: 'POST',
      path: '/api/auth/login',
      body: { email: 'rohit.verma@gmail.com', password: 'Password@123' },
    });
    const owner1Login = await request(server, {
      method: 'POST',
      path: '/api/auth/login',
      body: { email: 'vikram.sharma@gmail.com', password: 'Password@123' },
    });
    const owner2Login = await request(server, {
      method: 'POST',
      path: '/api/auth/login',
      body: { email: 'priya.deshmukh@gmail.com', password: 'Password@123' },
    });
    const adminLogin = await request(server, {
      method: 'POST',
      path: '/api/auth/login',
      body: { email: 'admin@roomverse.com', password: 'Password@123' },
    });

    const tenantToken = tenantLogin.body.data?.token;
    const owner1Token = owner1Login.body.data?.token;
    const owner2Token = owner2Login.body.data?.token;
    const adminToken = adminLogin.body.data?.token;

    assert('Authenticated tokens generated for Tenant, Owner 1, Owner 2, Admin', Boolean(tenantToken && owner1Token && owner2Token && adminToken));

    let createdPropertyId = '';
    let createdRoomId = '';
    let createdImageId = '';

    // --------------------------------------------------------------------------
    // 2. PROPERTY CRUD & OWNERSHIP TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 2. Property CRUD & Ownership Tests ---');

    // 2.1 Owner 1 creates property
    const createPropRes = await request(server, {
      method: 'POST',
      path: '/api/properties',
      headers: { Authorization: `Bearer ${owner1Token}` },
      body: {
        title: 'Phase 6 Test Residency',
        propertyType: 'pg',
        genderPreference: 'any',
        city: 'Pune',
        locality: 'Baner',
        address: '123 High Street, Baner, Pune',
        minRent: 9000,
        maxRent: 16000,
        securityDeposit: 15000,
        foodAvailable: true,
      },
    });
    assert('Owner creates property successfully (201 Created)', createPropRes.status === 201 && createPropRes.body.data?.id);
    assert('New property defaults to "pending" verification', createPropRes.body.data?.verification_status === 'pending');
    createdPropertyId = createPropRes.body.data?.id;

    // 2.2 Tenant cannot create property
    const tenantCreateRes = await request(server, {
      method: 'POST',
      path: '/api/properties',
      headers: { Authorization: `Bearer ${tenantToken}` },
      body: {
        title: 'Unauthorized Property',
        city: 'Pune',
        locality: 'Kothrud',
        address: '456 Lane',
        minRent: 5000,
        maxRent: 8000,
      },
    });
    assert('Tenant attempting to create property is rejected (403 Forbidden)', tenantCreateRes.status === 403);

    // 2.3 Authenticated tenant reads property
    const tenantReadRes = await request(server, {
      method: 'GET',
      path: `/api/properties/${createdPropertyId}`,
      headers: { Authorization: `Bearer ${tenantToken}` },
    });
    assert('Tenant reads property details successfully (200 OK)', tenantReadRes.status === 200 && tenantReadRes.body.data?.title === 'Phase 6 Test Residency');

    // 2.4 Owner 1 updates own property
    const ownerUpdateRes = await request(server, {
      method: 'PUT',
      path: `/api/properties/${createdPropertyId}`,
      headers: { Authorization: `Bearer ${owner1Token}` },
      body: { title: 'Phase 6 Test Residency (Renovated)' },
    });
    assert('Owner updates own property successfully (200 OK)', ownerUpdateRes.status === 200 && ownerUpdateRes.body.data?.title.includes('Renovated'));

    // 2.5 Owner 1 cannot self-verify property (field ignored)
    const selfVerifyRes = await request(server, {
      method: 'PUT',
      path: `/api/properties/${createdPropertyId}`,
      headers: { Authorization: `Bearer ${owner1Token}` },
      body: { verification_status: 'verified' },
    });
    assert('Owner cannot self-verify property (status remains "pending")', selfVerifyRes.body.data?.verification_status === 'pending');

    // 2.6 Owner 2 CANNOT update Owner 1's property (IDOR Protection)
    const idorUpdateRes = await request(server, {
      method: 'PUT',
      path: `/api/properties/${createdPropertyId}`,
      headers: { Authorization: `Bearer ${owner2Token}` },
      body: { title: 'Hacked by Owner 2' },
    });
    assert('Owner cannot update another owner\'s property (403 Forbidden IDOR Prevented)', idorUpdateRes.status === 403);

    // 2.7 Tenant CANNOT update property
    const tenantUpdateRes = await request(server, {
      method: 'PUT',
      path: `/api/properties/${createdPropertyId}`,
      headers: { Authorization: `Bearer ${tenantToken}` },
      body: { title: 'Hacked by Tenant' },
    });
    assert('Tenant cannot update property (403 Forbidden)', tenantUpdateRes.status === 403);

    // --------------------------------------------------------------------------
    // 3. ROOM MANAGEMENT TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 3. Room Management Tests ---');

    // 3.1 Owner 1 creates room in own property
    const createRoomRes = await request(server, {
      method: 'POST',
      path: `/api/properties/${createdPropertyId}/rooms`,
      headers: { Authorization: `Bearer ${owner1Token}` },
      body: {
        roomNumberName: 'Suite 101 - AC Double',
        roomType: 'double',
        isAc: true,
        isFurnished: true,
        monthlyRent: 12000,
        totalCapacity: 2,
        availableCapacity: 2,
      },
    });
    assert('Owner creates room in own property (201 Created)', createRoomRes.status === 201 && createRoomRes.body.data?.id);
    createdRoomId = createRoomRes.body.data?.id;

    // 3.2 Owner 2 CANNOT create room in Owner 1's property
    const idorCreateRoomRes = await request(server, {
      method: 'POST',
      path: `/api/properties/${createdPropertyId}/rooms`,
      headers: { Authorization: `Bearer ${owner2Token}` },
      body: {
        roomNumberName: 'Unauthorized Room',
        monthlyRent: 8000,
      },
    });
    assert('Owner cannot add room to another owner\'s property (403 Forbidden)', idorCreateRoomRes.status === 403);

    // 3.3 Tenant views rooms
    const tenantViewRoomsRes = await request(server, {
      method: 'GET',
      path: `/api/properties/${createdPropertyId}/rooms`,
      headers: { Authorization: `Bearer ${tenantToken}` },
    });
    assert('Tenant can view rooms for property (200 OK)', tenantViewRoomsRes.status === 200 && tenantViewRoomsRes.body.data?.length >= 1);

    // 3.4 Owner 1 updates room
    const updateRoomRes = await request(server, {
      method: 'PUT',
      path: `/api/rooms/${createdRoomId}`,
      headers: { Authorization: `Bearer ${owner1Token}` },
      body: { monthlyRent: 12500, status: 'reserved' },
    });
    assert('Owner updates room in own property (200 OK)', updateRoomRes.status === 200 && updateRoomRes.body.data?.status === 'reserved');

    // 3.5 Owner 2 CANNOT update Owner 1's room
    const idorUpdateRoomRes = await request(server, {
      method: 'PUT',
      path: `/api/rooms/${createdRoomId}`,
      headers: { Authorization: `Bearer ${owner2Token}` },
      body: { monthlyRent: 5000 },
    });
    assert('Owner cannot update room in another owner\'s property (403 Forbidden)', idorUpdateRoomRes.status === 403);

    // --------------------------------------------------------------------------
    // 4. AMENITIES TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 4. Amenities Tests ---');

    // 4.1 Authenticated user lists amenities catalog
    const amenitiesListRes = await request(server, {
      method: 'GET',
      path: '/api/amenities',
      headers: { Authorization: `Bearer ${tenantToken}` },
    });
    assert('Authenticated user lists amenities catalog (200 OK)', amenitiesListRes.status === 200 && amenitiesListRes.body.data?.length >= 12);

    // 4.2 Owner 1 assigns amenities to own property
    const assignAmenitiesRes = await request(server, {
      method: 'PUT',
      path: `/api/properties/${createdPropertyId}/amenities`,
      headers: { Authorization: `Bearer ${owner1Token}` },
      body: { amenityIds: [1, 2, 3, 5] }, // Wi-Fi, AC, Food, Power Backup
    });
    assert('Owner assigns amenities to own property in transaction (200 OK)', assignAmenitiesRes.status === 200 && assignAmenitiesRes.body.data?.length === 4);

    // 4.3 Owner 2 cannot assign amenities to Owner 1's property
    const idorAmenitiesRes = await request(server, {
      method: 'PUT',
      path: `/api/properties/${createdPropertyId}/amenities`,
      headers: { Authorization: `Bearer ${owner2Token}` },
      body: { amenityIds: [4, 6] },
    });
    assert('Owner cannot modify amenities of another owner\'s property (403 Forbidden)', idorAmenitiesRes.status === 403);

    // --------------------------------------------------------------------------
    // 5. PROPERTY IMAGES TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 5. Property Images Tests ---');

    // 5.1 Owner 1 adds image metadata
    const addImageRes = await request(server, {
      method: 'POST',
      path: `/api/properties/${createdPropertyId}/images`,
      headers: { Authorization: `Bearer ${owner1Token}` },
      body: {
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
        isPrimary: true,
        caption: 'Spacious Balcony Lounge',
      },
    });
    assert('Owner adds image metadata (201 Created)', addImageRes.status === 201 && addImageRes.body.data?.id);
    createdImageId = addImageRes.body.data?.id;

    // 5.2 Owner 2 cannot delete Owner 1's image metadata
    const idorDeleteImgRes = await request(server, {
      method: 'DELETE',
      path: `/api/properties/${createdPropertyId}/images/${createdImageId}`,
      headers: { Authorization: `Bearer ${owner2Token}` },
    });
    assert('Owner cannot delete image of another owner\'s property (403 Forbidden)', idorDeleteImgRes.status === 403);

    // 5.3 Owner 1 deletes own image metadata
    const deleteImgRes = await request(server, {
      method: 'DELETE',
      path: `/api/properties/${createdPropertyId}/images/${createdImageId}`,
      headers: { Authorization: `Bearer ${owner1Token}` },
    });
    assert('Owner deletes own image metadata successfully (200 OK)', deleteImgRes.status === 200 && deleteImgRes.body.data?.deleted === true);

    // --------------------------------------------------------------------------
    // 6. ADMIN VERIFICATION WORKFLOW TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 6. Admin Verification Tests ---');

    // 6.1 Tenant/Owner cannot access verification endpoint
    const tenantVerifyRes = await request(server, {
      method: 'PATCH',
      path: `/api/admin/properties/${createdPropertyId}/verification`,
      headers: { Authorization: `Bearer ${tenantToken}` },
      body: { status: 'verified' },
    });
    assert('Tenant cannot access verification endpoint (403 Forbidden)', tenantVerifyRes.status === 403);

    // 6.2 Admin verifies property
    const adminVerifyRes = await request(server, {
      method: 'PATCH',
      path: `/api/admin/properties/${createdPropertyId}/verification`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'verified', comments: 'Audit complete. Fire clearance confirmed.' },
    });
    assert('Admin verifies property successfully (200 OK)', adminVerifyRes.status === 200 && adminVerifyRes.body.data?.verification_status === 'verified');

    // 6.3 Verify verification_logs table record was written
    const [verifLogs] = await pool.query('SELECT * FROM verification_logs WHERE property_id = ?', [createdPropertyId]);
    assert('Verification log created in MySQL database with admin action and comments', verifLogs.length > 0 && verifLogs[0].action === 'verified');

    // --------------------------------------------------------------------------
    // 7. PROPERTY DELETION & CLEANUP
    // --------------------------------------------------------------------------
    console.log('\n--- 7. Property Deletion Tests ---');

    // 7.1 Owner 2 cannot delete Owner 1's property
    const idorDeletePropRes = await request(server, {
      method: 'DELETE',
      path: `/api/properties/${createdPropertyId}`,
      headers: { Authorization: `Bearer ${owner2Token}` },
    });
    assert('Owner cannot delete another owner\'s property (403 Forbidden)', idorDeletePropRes.status === 403);

    // 7.2 Owner 1 deletes own property (cascading rooms and amenities)
    const deletePropRes = await request(server, {
      method: 'DELETE',
      path: `/api/properties/${createdPropertyId}`,
      headers: { Authorization: `Bearer ${owner1Token}` },
    });
    assert('Owner deletes own property (200 OK)', deletePropRes.status === 200 && deletePropRes.body.data?.deleted === true);

  } finally {
    server.close();
    await pool.end();
  }

  console.log('==================================================');
  console.log(`📊 Phase 6 Test Results: ${passedTests}/${totalTests} Passed`);
  console.log('==================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPropertyTests().catch((err) => {
  console.error('Fatal property test error:', err);
  process.exit(1);
});