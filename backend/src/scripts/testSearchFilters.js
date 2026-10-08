const http = require('http');
const app = require('../app');

function request(server, { method = 'GET', path, headers = {}, body = null }) {
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

async function runSearchFilterTests() {
  console.log('==================================================');
  console.log('🔍 Running RoomVerse Phase 7 Search & Filter Tests');
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
    // --------------------------------------------------------------------------
    // 1. PUBLIC ACCESS & FILTER METADATA TESTS
    // --------------------------------------------------------------------------
    console.log('--- 1. Public Access & Filter Metadata ---');

    // 1.1 Public catalog access without JWT
    const publicCatalogRes = await request(server, { path: '/api/properties' });
    assert(
      'Public access to /api/properties without token returns 200 OK',
      publicCatalogRes.status === 200 && Array.isArray(publicCatalogRes.body.data)
    );
    assert(
      'Public catalog returns verified properties only by default',
      publicCatalogRes.body.data.every((p) => p.verification_status === 'verified')
    );

    // 1.2 Dynamic filter metadata
    const metaRes = await request(server, { path: '/api/properties/filters/meta' });
    assert(
      'GET /api/properties/filters/meta returns 200 OK with filter options',
      metaRes.status === 200 &&
      Array.isArray(metaRes.body.data?.cities) &&
      metaRes.body.data.cities.includes('Pune') &&
      metaRes.body.data.cities.includes('Bengaluru')
    );
    assert(
      'Metadata includes priceRange and amenities catalog',
      metaRes.body.data?.priceRange?.minRent > 0 &&
      Array.isArray(metaRes.body.data?.amenities) &&
      metaRes.body.data.amenities.length >= 10
    );

    // --------------------------------------------------------------------------
    // 2. KEYWORD SEARCH & LOCATION FILTER TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 2. Keyword Search & Location Filtering ---');

    // 2.1 Keyword search matching title/locality
    const keywordRes1 = await request(server, { path: '/api/properties?q=Hinjewadi' });
    assert(
      'Search query ?q=Hinjewadi returns properties in Hinjewadi',
      keywordRes1.status === 200 &&
      keywordRes1.body.data.length >= 1 &&
      keywordRes1.body.data.every((p) =>
        p.locality.toLowerCase().includes('hinjewadi') || p.title.toLowerCase().includes('hinjewadi')
      )
    );

    // 2.2 Keyword search matching description
    const keywordRes2 = await request(server, { path: '/api/properties?q=startup' });
    assert(
      'Search query ?q=startup returns Koramangala Suites matching description',
      keywordRes2.status === 200 &&
      keywordRes2.body.data.some((p) => p.title.includes('Koramangala'))
    );

    // 2.3 City filter (exact/case-insensitive)
    const puneRes = await request(server, { path: '/api/properties?city=pune' });
    assert(
      'Filter by ?city=pune returns only Pune accommodations',
      puneRes.status === 200 &&
      puneRes.body.data.length >= 2 &&
      puneRes.body.data.every((p) => p.city.toLowerCase() === 'pune')
    );

    const blrRes = await request(server, { path: '/api/properties?city=Bengaluru' });
    assert(
      'Filter by ?city=Bengaluru returns only Bengaluru accommodations',
      blrRes.status === 200 &&
      blrRes.body.data.every((p) => p.city.toLowerCase() === 'bengaluru')
    );

    // 2.4 Locality filter
    const vimanRes = await request(server, { path: '/api/properties?locality=Viman%20Nagar' });
    assert(
      'Filter by ?locality=Viman Nagar returns Viman Nagar property',
      vimanRes.status === 200 &&
      vimanRes.body.data.length === 1 &&
      vimanRes.body.data[0].locality === 'Viman Nagar'
    );

    // --------------------------------------------------------------------------
    // 3. PROPERTY TYPE & GENDER PREFERENCE TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 3. Property Type & Gender Filtering ---');

    // 3.1 Property type filter
    const hostelRes = await request(server, { path: '/api/properties?propertyType=hostel' });
    assert(
      'Filter by ?propertyType=hostel returns only hostel accommodations',
      hostelRes.status === 200 &&
      hostelRes.body.data.length >= 1 &&
      hostelRes.body.data.every((p) => p.property_type === 'hostel')
    );

    // 3.2 Comma-separated property types
    const multiTypeRes = await request(server, { path: '/api/properties?propertyType=hostel,coliving' });
    assert(
      'Filter by ?propertyType=hostel,coliving returns both types',
      multiTypeRes.status === 200 &&
      multiTypeRes.body.data.length >= 2 &&
      multiTypeRes.body.data.every((p) => ['hostel', 'coliving'].includes(p.property_type))
    );

    // 3.3 Gender preference filter (female returns female + any)
    const femaleRes = await request(server, { path: '/api/properties?gender=female' });
    assert(
      'Filter by ?gender=female returns accommodations suitable for women (female or any)',
      femaleRes.status === 200 &&
      femaleRes.body.data.every((p) => ['female', 'any'].includes(p.gender_preference))
    );

    // --------------------------------------------------------------------------
    // 4. BUDGET & LIVING COST FILTER TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 4. Budget & Rent Range Filtering ---');

    // 4.1 Max Rent Filter
    const maxRentRes = await request(server, { path: '/api/properties?maxRent=8000' });
    assert(
      'Filter by ?maxRent=8000 returns accommodations with min_rent <= 8000',
      maxRentRes.status === 200 &&
      maxRentRes.body.data.length >= 1 &&
      maxRentRes.body.data.every((p) => Number(p.min_rent) <= 8000)
    );

    // 4.2 Min Rent Filter
    const minRentRes = await request(server, { path: '/api/properties?minRent=10000' });
    assert(
      'Filter by ?minRent=10000 returns accommodations where max_rent >= 10000',
      minRentRes.status === 200 &&
      minRentRes.body.data.every((p) => Number(p.max_rent) >= 10000)
    );

    // --------------------------------------------------------------------------
    // 5. ROOM CONFIGURATION & AMENITY FILTER TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 5. Room Inventory & Amenity Filtering ---');

    // 5.1 Room Type filter (properties with single sharing rooms)
    const singleRoomRes = await request(server, { path: '/api/properties?roomType=single' });
    assert(
      'Filter by ?roomType=single returns properties containing single rooms',
      singleRoomRes.status === 200 && singleRoomRes.body.data.length >= 2
    );

    // 5.2 AC & Furnished Rooms filter
    const acRes = await request(server, { path: '/api/properties?isAc=true' });
    assert(
      'Filter by ?isAc=true returns properties containing air-conditioned rooms',
      acRes.status === 200 && acRes.body.data.length >= 2
    );

    const furnRes = await request(server, { path: '/api/properties?isFurnished=true' });
    assert(
      'Filter by ?isFurnished=true returns properties containing furnished rooms',
      furnRes.status === 200 && furnRes.body.data.length >= 2
    );

    // 5.3 Meal Availability Filter
    const foodRes = await request(server, { path: '/api/properties?foodAvailable=true' });
    assert(
      'Filter by ?foodAvailable=true returns properties where meals are provided',
      foodRes.status === 200 &&
      foodRes.body.data.length >= 2 &&
      foodRes.body.data.every((p) => p.food_available === true || p.food_available === 1)
    );

    // 5.4 Available Vacancy Only
    const availableRes = await request(server, { path: '/api/properties?availableOnly=true' });
    assert(
      'Filter by ?availableOnly=true returns properties with at least 1 vacant bed',
      availableRes.status === 200 &&
      availableRes.body.data.every((p) => p.available_room_count > 0)
    );

    // 5.4 Amenities filter (Properties having Gym)
    const gymRes = await request(server, { path: '/api/properties?amenities=gym' });
    assert(
      'Filter by ?amenities=gym returns properties with gym facilities',
      gymRes.status === 200 &&
      gymRes.body.data.length === 2 &&
      gymRes.body.data.every((p) => ['prop-pune-1', 'prop-blr-1'].includes(p.id))
    );

    // 5.5 Multiple Amenities (Wi-Fi + Biometric)
    const multiAmenityRes = await request(server, { path: '/api/properties?amenities=wifi,biometric' });
    assert(
      'Filter by ?amenities=wifi,biometric returns properties having BOTH amenities',
      multiAmenityRes.status === 200 && multiAmenityRes.body.data.length >= 2
    );

    // --------------------------------------------------------------------------
    // 6. SORTING & PAGINATION TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 6. Sorting & Pagination ---');

    // 6.1 Sort by Price Low to High
    const sortAscRes = await request(server, { path: '/api/properties?sortBy=price_asc' });
    const pricesAsc = sortAscRes.body.data.map((p) => Number(p.min_rent));
    const isSortedAsc = pricesAsc.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
    assert('Sort by ?sortBy=price_asc orders properties by min_rent ascending', isSortedAsc);

    // 6.2 Sort by Price High to Low
    const sortDescRes = await request(server, { path: '/api/properties?sortBy=price_desc' });
    const pricesDesc = sortDescRes.body.data.map((p) => Number(p.min_rent));
    const isSortedDesc = pricesDesc.every((val, i, arr) => i === 0 || arr[i - 1] >= val);
    assert('Sort by ?sortBy=price_desc orders properties by min_rent descending', isSortedDesc);

    // 6.3 Pagination
    const pageRes = await request(server, { path: '/api/properties?limit=1&page=1' });
    assert(
      'Pagination ?limit=1&page=1 returns 1 property with pagination metadata',
      pageRes.status === 200 &&
      pageRes.body.data.length === 1 &&
      pageRes.body.meta?.page === 1 &&
      pageRes.body.meta?.limit === 1 &&
      pageRes.body.meta?.totalPages >= 2 &&
      pageRes.body.meta?.hasNextPage === true
    );

    // --------------------------------------------------------------------------
    // 7. OWNER SCOPE SECURITY TESTS
    // --------------------------------------------------------------------------
    console.log('\n--- 7. Owner Scoping & Security Continuity ---');

    // 7.1 ?my=true without auth token is rejected
    const unauthOwnerRes = await request(server, { path: '/api/properties?my=true' });
    assert(
      'Requesting ?my=true without auth token is rejected (401 Unauthorized)',
      unauthOwnerRes.status === 401
    );

    // 7.2 ?my=true with owner token returns owner portfolio
    const ownerLogin = await request(server, {
      method: 'POST',
      path: '/api/auth/login',
      body: { email: 'vikram.sharma@gmail.com', password: 'Password@123' },
    });
    const ownerToken = ownerLogin.body.data?.token;

    const ownerRes = await request(server, {
      path: '/api/properties?my=true',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert(
      'Requesting ?my=true with owner token returns only listings owned by that user',
      ownerRes.status === 200 &&
      ownerRes.body.data.every((p) => p.owner_id === 'user-owner-1')
    );

    console.log('\n==================================================');
    console.log(`📊 Phase 7 Search & Filter Results: ${passedTests}/${totalTests} Passed`);
    console.log('==================================================\n');

    server.close();
    if (passedTests !== totalTests) {
      process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    console.error('Test execution error:', err);
    server.close();
    process.exit(1);
  }
}

runSearchFilterTests();
