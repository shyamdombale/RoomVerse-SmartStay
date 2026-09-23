# RoomVerse — Database Design Specification

## 1. Relational Design Principles
- **Engine**: MySQL 8.0 InnoDB.
- **Character Set**: `utf8mb4` with `utf8mb4_unicode_ci` collation.
- **Normalization Level**: 3rd Normal Form (3NF) to eliminate data redundancy and anomalies.
- **Integrity**: Referential integrity enforced via foreign keys with explicit `ON DELETE CASCADE` or `ON DELETE RESTRICT` semantics.
- **Auditing**: Standard `created_at` and `updated_at` timestamps on all transactional tables.

---

## 2. Core Entities & Tables

### 2.1 Users & Authentication
- `users`: Primary identity store (`id`, `name`, `email`, `password_hash`, `phone`, `role`, `is_active`, `created_at`).
  - Roles: `customer` (tenant/student), `owner` (host/landlord), `admin` (system auditor).
- `profiles`: Detailed profile metadata (`user_id`, `gender`, `occupation`, `institution_name`, `emergency_contact`, `bio`, `avatar_url`).

### 2.2 Properties & Rooms
- `properties`: Physical accommodation entity (`id`, `owner_id`, `title`, `property_type`, `gender_preference`, `city`, `locality`, `address`, `latitude`, `longitude`, `min_rent`, `max_rent`, `security_deposit`, `estimated_maintenance`, `estimated_food_charge`, `estimated_electricity_charge`, `food_available`, `verification_status`, `verified_at`, `verified_by`, `average_rating`, `total_reviews`, `is_active`).
- `rooms`: Specific room configuration within property (`id`, `property_id`, `room_number_name`, `room_type`, `is_ac`, `is_furnished`, `monthly_rent`, `total_capacity`, `available_capacity`, `status`).
  - Status enum: `available`, `reserved`, `occupied`, `maintenance`.
- `amenities`: Standardized amenity lookup table (`id`, `name`, `icon`, `category`).
- `property_amenities`: Many-to-many junction table (`property_id`, `amenity_id`).
- `property_images`: Image gallery entries (`id`, `property_id`, `image_url`, `is_primary`, `sort_order`).

### 2.3 Bookings & Workflows
- `bookings`: Rental requests and agreements (`id`, `booking_code`, `user_id`, `property_id`, `room_id`, `move_in_date`, `duration_months`, `rent_amount`, `deposit_amount`, `total_estimated_cost`, `booking_status`, `tenant_note`, `owner_rejection_reason`, `created_at`, `updated_at`).
  - Booking Status state machine: `requested` -> `viewed` -> `accepted` / `rejected` -> `confirmed` -> `cancelled` -> `completed`.

### 2.4 Social & Reviews
- `reviews`: Multi-factor tenant feedback (`id`, `user_id`, `property_id`, `overall_rating`, `cleanliness_rating`, `location_rating`, `facilities_rating`, `value_for_money_rating`, `review_text`, `owner_response`, `created_at`).
- `favorites`: Tenant saved properties (`id`, `user_id`, `property_id`, `created_at`, unique key on `user_id + property_id`).

### 2.5 Audit & Moderation
- `verification_logs`: Historical audit trail of admin verifications (`id`, `property_id`, `admin_id`, `action`, `comments`, `created_at`).
- `activity_logs`: Security and operational audit log (`id`, `user_id`, `action`, `details`, `ip_address`, `created_at`).

---

## 3. Indexing Strategy
- `users(email)`: Unique index for O(1) authentication lookup.
- `properties(city, locality)`: Compound index for geographic filtering.
- `properties(verification_status, is_active)`: Filter index for public browsing.
- `properties(min_rent, max_rent)`: Range query optimization for budget filtering.
- `bookings(user_id)` & `bookings(property_id)`: Foreign key lookup indexes for dashboard rendering.
- `rooms(property_id, status)`: Fast room inventory lookup.
