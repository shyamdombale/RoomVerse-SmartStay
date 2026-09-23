-- ==============================================================================
-- RoomVerse Production-Style Realistic Seed Dataset
-- Focus Locations: Pune (Hinjewadi, Viman Nagar) & Bengaluru (Koramangala, Electronic City)
-- Master Password for all seed users: Password@123
-- ==============================================================================

USE `roomverse_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. SEED USERS (Admin, Owners, Tenants)
-- ------------------------------------------------------------------------------
DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `phone`, `role`, `is_active`) VALUES
-- Admin
('user-admin-1', 'Suresh Menon', 'admin@roomverse.com', '$2b$10$fUHG9NQ8GSR0HxMOQcEt..071aZ2/DQJC.7ROyWrXIcbnvakW.vpi', '+91 9820011223', 'admin', TRUE),
-- Property Owners
('user-owner-1', 'Vikram Sharma', 'vikram.sharma@gmail.com', '$2b$10$fUHG9NQ8GSR0HxMOQcEt..071aZ2/DQJC.7ROyWrXIcbnvakW.vpi', '+91 9811223344', 'owner', TRUE),
('user-owner-2', 'Priya Deshmukh', 'priya.deshmukh@gmail.com', '$2b$10$fUHG9NQ8GSR0HxMOQcEt..071aZ2/DQJC.7ROyWrXIcbnvakW.vpi', '+91 9822334455', 'owner', TRUE),
-- Tenants / Students
('user-tenant-1', 'Rohit Verma', 'rohit.verma@gmail.com', '$2b$10$fUHG9NQ8GSR0HxMOQcEt..071aZ2/DQJC.7ROyWrXIcbnvakW.vpi', '+91 9988776655', 'customer', TRUE),
('user-tenant-2', 'Ananya Sen', 'ananya.sen@gmail.com', '$2b$10$fUHG9NQ8GSR0HxMOQcEt..071aZ2/DQJC.7ROyWrXIcbnvakW.vpi', '+91 9977665544', 'customer', TRUE),
('user-tenant-3', 'Rahul Nair', 'rahul.nair@gmail.com', '$2b$10$fUHG9NQ8GSR0HxMOQcEt..071aZ2/DQJC.7ROyWrXIcbnvakW.vpi', '+91 9966554433', 'customer', TRUE);

-- ------------------------------------------------------------------------------
-- 2. SEED PROFILES
-- ------------------------------------------------------------------------------
DELETE FROM `profiles`;
INSERT INTO `profiles` (`user_id`, `gender`, `occupation`, `institution_name`, `emergency_contact`, `bio`, `city`) VALUES
('user-admin-1', 'male', 'System Administrator', 'RoomVerse Trust & Safety', '+91 9820099999', 'Platform security and property verification auditor.', 'Pune'),
('user-owner-1', 'male', 'Real Estate Host', 'Sharma Living Spaces LLP', '+91 9811229999', 'Operating high quality student and IT professional coliving spaces in Hinjewadi and Koramangala for 8+ years.', 'Pune'),
('user-owner-2', 'female', 'Property Manager', 'Deshmukh Hospitality', '+91 9822339999', 'Dedicated to providing safe, comfortable, and hygienic accommodations for university scholars.', 'Pune'),
('user-tenant-1', 'male', 'Software Engineer', 'Cognizant Technology Solutions', '+91 9988770000', 'Full stack developer looking for a peaceful room with high-speed internet near Hinjewadi Phase 1.', 'Pune'),
('user-tenant-2', 'female', 'Design Student', 'Symbiosis Institute of Design', '+91 9977660000', 'Master of Design student needing an airy room with food and laundry facilities in Viman Nagar.', 'Pune'),
('user-tenant-3', 'male', 'Cloud Consultant', 'Infosys Electronic City', '+91 9966550000', 'IT professional seeking single occupancy coliving room near Bangalore tech corridor.', 'Bengaluru');

-- ------------------------------------------------------------------------------
-- 3. SEED AMENITIES CATALOG
-- ------------------------------------------------------------------------------
DELETE FROM `amenities`;
INSERT INTO `amenities` (`id`, `name`, `slug`, `icon`, `category`) VALUES
(1, 'High-Speed Wi-Fi', 'wifi', 'wifi', 'essential'),
(2, 'Air Conditioning (AC)', 'ac', 'wind', 'convenience'),
(3, '3-Time Meals Included', 'food', 'utensils', 'essential'),
(4, 'Automatic Washing Machine', 'laundry', 'shirt', 'convenience'),
(5, '24/7 Power Backup', 'power-backup', 'zap', 'essential'),
(6, 'RO Drinking Water', 'ro-water', 'droplets', 'essential'),
(7, 'Attached Private Washroom', 'attached-bath', 'bath', 'convenience'),
(8, 'Refrigerator in Room', 'refrigerator', 'box', 'convenience'),
(9, 'Daily Professional Housekeeping', 'housekeeping', 'sparkles', 'convenience'),
(10, 'CCTV Surveillance & Security Guard', 'cctv-security', 'shield', 'safety'),
(11, 'Biometric Access Control', 'biometric', 'fingerprint', 'safety'),
(12, 'Fitness Gym & Recreation Room', 'gym', 'dumbbell', 'leisure');

-- ------------------------------------------------------------------------------
-- 4. SEED PROPERTIES
-- ------------------------------------------------------------------------------
DELETE FROM `properties`;
INSERT INTO `properties` (
    `id`, `owner_id`, `title`, `property_type`, `gender_preference`,
    `city`, `locality`, `address`, `pincode`, `latitude`, `longitude`,
    `description`, `min_rent`, `max_rent`, `security_deposit`,
    `estimated_maintenance`, `estimated_food_charge`, `estimated_electricity_charge`,
    `food_available`, `notice_period_days`, `rules`,
    `verification_status`, `verified_at`, `verified_by`, `average_rating`, `total_reviews`, `total_views`, `is_active`
) VALUES
-- Property 1 (Pune - Hinjewadi) - VERIFIED
('prop-pune-1', 'user-owner-1', 'Verse Neo Luxe Living', 'coliving', 'any',
 'Pune', 'Hinjewadi Phase 1', 'Plot 42, Behind Rajiv Gandhi Infotech Park, Hinjewadi Phase 1', '411057', 18.59123400, 73.73891200,
 'Premium tech-focused coliving residence situated within 5 minutes of major IT parks (Infosys, Wipro, TCS). Features ergonomic workspaces, gigabit fiber internet, nutritious meal plans, and round-the-clock power backup.',
 8500.00, 15000.00, 15000.00,
 800.00, 2500.00, 600.00,
 TRUE, 30, 'No smoking inside rooms. Visitors allowed until 9:00 PM. Gate closes at 11:30 PM.',
 'verified', '2026-08-15 10:00:00', 'user-admin-1', 4.85, 12, 420, TRUE),

-- Property 2 (Pune - Viman Nagar) - VERIFIED
('prop-pune-2', 'user-owner-2', 'Symbiosis Scholars Residency', 'hostel', 'female',
 'Pune', 'Viman Nagar', 'Row House 14, Near Symbiosis Law School, Off Pune-Ahmednagar Highway', '411014', 18.56789100, 73.91432100,
 'Safe and tranquil women-only hostel offering peaceful study environment, biometric entry, CCTV coverage on all floors, and delicious home-cooked North/South Indian meals.',
 7000.00, 12000.00, 10000.00,
 500.00, 2200.00, 500.00,
 TRUE, 30, 'Female residents only. Strict biometric access. Silent hours from 10:30 PM to 6:00 AM.',
 'verified', '2026-08-18 14:30:00', 'user-admin-1', 4.90, 8, 310, TRUE),

-- Property 3 (Bengaluru - Koramangala) - VERIFIED
('prop-blr-1', 'user-owner-1', 'Koramangala Executive Suites', 'coliving', 'any',
 'Bengaluru', 'Koramangala 4th Block', '108, 80 Feet Road, Near Sony World Signal, Koramangala 4th Block', '560034', 12.93456700, 77.62567800,
 'High-end accommodation designed for startup founders and tech consultants. Walkable distance to premier cafes, incubators, and co-working hubs. All rooms equipped with smart TVs and AC.',
 12000.00, 24000.00, 25000.00,
 1200.00, 3000.00, 900.00,
 TRUE, 45, 'Quiet hours respected. Common area clean-up mandatory after use. Professional conduct expected.',
 'verified', '2026-08-20 11:15:00', 'user-admin-1', 4.75, 15, 680, TRUE),

-- Property 4 (Bengaluru - Electronic City) - PENDING VERIFICATION (For Admin Workflow Testing)
('prop-blr-2', 'user-owner-2', 'TechZone Premier Residency', 'pg', 'male',
 'Bengaluru', 'Electronic City Phase 1', 'Survey 78/2, Neeladri Road, Near Wipro Gate 5, Electronic City Phase 1', '560100', 12.83987600, 77.66543200,
 'Affordable and clean men PG within 2 minutes of Neeladri Road market. Includes 3 times food, self-service laundry machines, and dedicated two-wheeler parking.',
 6500.00, 11000.00, 10000.00,
 400.00, 2000.00, 400.00,
 TRUE, 30, 'No overnight unauthorized guests. Electricity bill split equally per room meter.',
 'pending', NULL, NULL, 0.00, 0, 85, TRUE);

-- ------------------------------------------------------------------------------
-- 5. SEED ROOMS
-- ------------------------------------------------------------------------------
DELETE FROM `rooms`;
INSERT INTO `rooms` (`id`, `property_id`, `room_number_name`, `room_type`, `is_ac`, `is_furnished`, `monthly_rent`, `total_capacity`, `available_capacity`, `status`) VALUES
-- Rooms for Verse Neo Luxe (prop-pune-1)
('room-pune-101', 'prop-pune-1', 'Room 101 - Deluxe Single AC', 'single', TRUE, TRUE, 15000.00, 1, 1, 'available'),
('room-pune-102', 'prop-pune-1', 'Room 102 - Executive Double AC', 'double', TRUE, TRUE, 11000.00, 2, 1, 'available'),
('room-pune-103', 'prop-pune-1', 'Room 103 - Economy Triple Non-AC', 'triple', FALSE, TRUE, 8500.00, 3, 0, 'occupied'),

-- Rooms for Symbiosis Scholars (prop-pune-2)
('room-pune-201', 'prop-pune-2', 'Room A1 - Scholar Single AC', 'single', TRUE, TRUE, 12000.00, 1, 1, 'available'),
('room-pune-202', 'prop-pune-2', 'Room A2 - Twin Sharing Room', 'double', FALSE, TRUE, 8500.00, 2, 2, 'available'),
('room-pune-203', 'prop-pune-2', 'Room A3 - Budget Triple Room', 'triple', FALSE, TRUE, 7000.00, 3, 1, 'available'),

-- Rooms for Koramangala Suites (prop-blr-1)
('room-blr-301', 'prop-blr-1', 'Suite 301 - Studio Executive Single', 'single', TRUE, TRUE, 24000.00, 1, 1, 'available'),
('room-blr-302', 'prop-blr-1', 'Suite 302 - Premium Double Sharing', 'double', TRUE, TRUE, 14000.00, 2, 0, 'occupied'),
('room-blr-303', 'prop-blr-1', 'Suite 303 - Deluxe Twin Sharing', 'double', TRUE, TRUE, 12000.00, 2, 1, 'available'),

-- Rooms for TechZone Residency (prop-blr-2)
('room-blr-401', 'prop-blr-2', 'Room 1 - Standard Single', 'single', FALSE, TRUE, 11000.00, 1, 1, 'available'),
('room-blr-402', 'prop-blr-2', 'Room 2 - Double Sharing', 'double', FALSE, TRUE, 6500.00, 2, 2, 'available');

-- ------------------------------------------------------------------------------
-- 6. SEED PROPERTY_AMENITIES
-- ------------------------------------------------------------------------------
DELETE FROM `property_amenities`;
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
-- prop-pune-1 amenities: Wi-Fi, AC, Food, Laundry, Backup, RO, Attached Washroom, Housekeeping, CCTV, Biometric, Gym
('prop-pune-1', 1), ('prop-pune-1', 2), ('prop-pune-1', 3), ('prop-pune-1', 4),
('prop-pune-1', 5), ('prop-pune-1', 6), ('prop-pune-1', 7), ('prop-pune-1', 9),
('prop-pune-1', 10), ('prop-pune-1', 11), ('prop-pune-1', 12),

-- prop-pune-2 amenities: Wi-Fi, Food, Laundry, Backup, RO, Attached Washroom, Housekeeping, CCTV, Biometric
('prop-pune-2', 1), ('prop-pune-2', 3), ('prop-pune-2', 4), ('prop-pune-2', 5),
('prop-pune-2', 6), ('prop-pune-2', 7), ('prop-pune-2', 9), ('prop-pune-2', 10),
('prop-pune-2', 11),

-- prop-blr-1 amenities: Wi-Fi, AC, Food, Laundry, Backup, RO, Attached Washroom, Refrigerator, Housekeeping, CCTV, Biometric, Gym
('prop-blr-1', 1), ('prop-blr-1', 2), ('prop-blr-1', 3), ('prop-blr-1', 4),
('prop-blr-1', 5), ('prop-blr-1', 6), ('prop-blr-1', 7), ('prop-blr-1', 8),
('prop-blr-1', 9), ('prop-blr-1', 10), ('prop-blr-1', 11), ('prop-blr-1', 12),

-- prop-blr-2 amenities: Wi-Fi, Food, Laundry, RO, CCTV
('prop-blr-2', 1), ('prop-blr-2', 3), ('prop-blr-2', 4), ('prop-blr-2', 6),
('prop-blr-2', 10);

-- ------------------------------------------------------------------------------
-- 7. SEED PROPERTY_IMAGES
-- ------------------------------------------------------------------------------
DELETE FROM `property_images`;
INSERT INTO `property_images` (`property_id`, `image_url`, `is_primary`, `sort_order`, `caption`) VALUES
('prop-pune-1', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', TRUE, 1, 'Modern Living Room and Shared Lounge'),
('prop-pune-1', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80', FALSE, 2, 'Deluxe Single Bedroom with Workstation'),
('prop-pune-1', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', FALSE, 3, 'Attached Private Bathroom'),

('prop-pune-2', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', TRUE, 1, 'Spacious Scholar Bedroom with Natural Light'),
('prop-pune-2', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', FALSE, 2, 'Shared Dining and Study Zone'),

('prop-blr-1', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80', TRUE, 1, 'Executive Suite Bedroom with AC and Smart TV'),
('prop-blr-1', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', FALSE, 2, 'Rooftop Terrace & Recreation Facility'),

('prop-blr-2', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', TRUE, 1, 'Neat Standard Bedroom with Twin Beds');

-- ------------------------------------------------------------------------------
-- 8. SEED FAVORITES
-- ------------------------------------------------------------------------------
DELETE FROM `favorites`;
INSERT INTO `favorites` (`user_id`, `property_id`) VALUES
('user-tenant-1', 'prop-pune-1'),
('user-tenant-1', 'prop-blr-1'),
('user-tenant-2', 'prop-pune-2');

-- ------------------------------------------------------------------------------
-- 9. SEED BOOKING REQUESTS
-- ------------------------------------------------------------------------------
DELETE FROM `bookings`;
INSERT INTO `bookings` (
    `id`, `booking_code`, `user_id`, `property_id`, `room_id`,
    `move_in_date`, `duration_months`, `rent_amount`, `deposit_amount`, `total_estimated_cost`,
    `booking_status`, `tenant_note`, `owner_rejection_reason`
) VALUES
('book-2026-001', 'RV-2026-001', 'user-tenant-1', 'prop-pune-1', 'room-pune-102',
 '2026-10-01', 6, 11000.00, 15000.00, 14900.00,
 'accepted', 'Joining Cognizant Hinjewadi campus on Oct 1. Prefer room with corner desk.', NULL),

('book-2026-002', 'RV-2026-002', 'user-tenant-2', 'prop-pune-2', 'room-pune-201',
 '2026-09-25', 12, 12000.00, 10000.00, 15200.00,
 'confirmed', 'Symbiosis college term commences end of September. Paid advance deposit.', NULL),

('book-2026-003', 'RV-2026-003', 'user-tenant-3', 'prop-blr-1', 'room-blr-301',
 '2026-10-15', 3, 24000.00, 25000.00, 29100.00,
 'requested', 'Consulting engagement in Koramangala. Requesting physical walkthrough on weekend.', NULL);

-- ------------------------------------------------------------------------------
-- 10. SEED REVIEWS
-- ------------------------------------------------------------------------------
DELETE FROM `reviews`;
INSERT INTO `reviews` (
    `id`, `user_id`, `property_id`,
    `overall_rating`, `cleanliness_rating`, `location_rating`, `facilities_rating`, `value_for_money_rating`,
    `review_text`, `owner_response`
) VALUES
('rev-001', 'user-tenant-1', 'prop-pune-1',
 4.8, 5.0, 4.9, 4.8, 4.6,
 'Extremely convenient location for anyone working in Hinjewadi Phase 1. The Wi-Fi never drops and food is consistently tasty.',
 'Thank you Rohit! Glad to know our gigabit fiber network is keeping your work seamless. — Vikram Sharma'),

('rev-002', 'user-tenant-2', 'prop-pune-2',
 4.9, 5.0, 5.0, 4.8, 4.9,
 'Super safe hostel with attentive female wardens and strict biometric access. Five minutes walking distance from Symbiosis.',
 'Thank you Ananya! Student safety and clean nutritious meals will always remain our highest priorities. — Priya Deshmukh');

-- ------------------------------------------------------------------------------
-- 11. SEED VERIFICATION LOGS
-- ------------------------------------------------------------------------------
DELETE FROM `verification_logs`;
INSERT INTO `verification_logs` (`property_id`, `admin_id`, `action`, `comments`, `created_at`) VALUES
('prop-pune-1', 'user-admin-1', 'verified', 'Ownership documents, electrical safety compliance, and fire safety checked. Verified.', '2026-08-15 10:00:00'),
('prop-pune-2', 'user-admin-1', 'verified', 'Hostel license and biometric security protocols confirmed. Verified.', '2026-08-18 14:30:00'),
('prop-blr-1', 'user-admin-1', 'verified', 'Commercial lease agreement and trade certificate validated. Verified.', '2026-08-20 11:15:00');

-- ------------------------------------------------------------------------------
-- 12. SEED PROPERTY VIEWS
-- ------------------------------------------------------------------------------
DELETE FROM `property_views`;
INSERT INTO `property_views` (`property_id`, `user_id`, `ip_address`, `viewed_at`) VALUES
('prop-pune-1', 'user-tenant-1', '127.0.0.1', '2026-09-20 09:12:00'),
('prop-pune-1', 'user-tenant-2', '127.0.0.1', '2026-09-21 11:45:00'),
('prop-pune-2', 'user-tenant-2', '127.0.0.1', '2026-09-21 14:20:00'),
('prop-blr-1', 'user-tenant-3', '127.0.0.1', '2026-09-22 16:30:00');

SET FOREIGN_KEY_CHECKS = 1;