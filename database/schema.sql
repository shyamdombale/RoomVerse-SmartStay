-- ==============================================================================
-- RoomVerse Normalized Relational Database Schema
-- Database Engine: MySQL 8.0 (InnoDB)
-- Collation: utf8mb4_unicode_ci
-- Normalization: 3rd Normal Form (3NF)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `roomverse_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `roomverse_db`;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE (Primary Authentication & Identity Entity)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `role` ENUM('customer', 'owner', 'admin') NOT NULL DEFAULT 'customer',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`),
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. PROFILES TABLE (User Demographics & KYC Details - 1:1 with Users)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `gender` ENUM('male', 'female', 'other') DEFAULT NULL,
    `occupation` VARCHAR(100) DEFAULT NULL,
    `institution_name` VARCHAR(150) DEFAULT NULL,
    `emergency_contact` VARCHAR(20) DEFAULT NULL,
    `bio` TEXT DEFAULT NULL,
    `avatar_url` VARCHAR(500) DEFAULT NULL,
    `city` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_profiles_user_id` (`user_id`),
    CONSTRAINT `fk_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. PROPERTIES TABLE (Hostels, PGs, Shared Apartments)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `properties`;
CREATE TABLE `properties` (
    `id` VARCHAR(36) NOT NULL,
    `owner_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `property_type` ENUM('hostel', 'pg', 'flat', 'coliving') NOT NULL DEFAULT 'pg',
    `gender_preference` ENUM('male', 'female', 'any') NOT NULL DEFAULT 'any',
    `city` VARCHAR(100) NOT NULL,
    `locality` VARCHAR(150) NOT NULL,
    `address` TEXT NOT NULL,
    `pincode` VARCHAR(10) DEFAULT NULL,
    `latitude` DECIMAL(10, 8) DEFAULT NULL,
    `longitude` DECIMAL(11, 8) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `min_rent` DECIMAL(10, 2) NOT NULL,
    `max_rent` DECIMAL(10, 2) NOT NULL,
    `security_deposit` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `estimated_maintenance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `estimated_food_charge` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `estimated_electricity_charge` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `food_available` BOOLEAN NOT NULL DEFAULT FALSE,
    `notice_period_days` INT NOT NULL DEFAULT 30,
    `rules` TEXT DEFAULT NULL,
    `verification_status` ENUM('pending', 'verified', 'rejected', 'expired') NOT NULL DEFAULT 'pending',
    `verified_at` TIMESTAMP NULL DEFAULT NULL,
    `verified_by` VARCHAR(36) DEFAULT NULL,
    `average_rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    `total_reviews` INT NOT NULL DEFAULT 0,
    `total_views` INT NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_prop_owner` (`owner_id`),
    INDEX `idx_prop_city_locality` (`city`, `locality`),
    INDEX `idx_prop_type_gender` (`property_type`, `gender_preference`),
    INDEX `idx_prop_rent_range` (`min_rent`, `max_rent`),
    INDEX `idx_prop_verification` (`verification_status`, `is_active`),
    CONSTRAINT `fk_properties_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_properties_verifier` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `chk_rent_positive` CHECK (`min_rent` >= 0 AND `max_rent` >= `min_rent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. ROOMS TABLE (Unit-Level Inventory & Availability)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
    `id` VARCHAR(36) NOT NULL,
    `property_id` VARCHAR(36) NOT NULL,
    `room_number_name` VARCHAR(100) NOT NULL,
    `room_type` ENUM('single', 'double', 'triple', 'four_plus') NOT NULL DEFAULT 'single',
    `is_ac` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_furnished` BOOLEAN NOT NULL DEFAULT TRUE,
    `monthly_rent` DECIMAL(10, 2) NOT NULL,
    `total_capacity` INT NOT NULL DEFAULT 1,
    `available_capacity` INT NOT NULL DEFAULT 1,
    `status` ENUM('available', 'reserved', 'occupied', 'maintenance') NOT NULL DEFAULT 'available',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_rooms_property_status` (`property_id`, `status`),
    CONSTRAINT `fk_rooms_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_room_capacity` CHECK (`available_capacity` >= 0 AND `available_capacity` <= `total_capacity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. AMENITIES TABLE (Normalized Catalog of Features)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `amenities`;
CREATE TABLE `amenities` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(50) NOT NULL DEFAULT 'check',
    `category` ENUM('essential', 'convenience', 'safety', 'leisure') NOT NULL DEFAULT 'essential',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_amenities_slug` (`slug`),
    UNIQUE KEY `uk_amenities_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. PROPERTY_AMENITIES TABLE (Many-to-Many Bridge)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `property_amenities`;
CREATE TABLE `property_amenities` (
    `property_id` VARCHAR(36) NOT NULL,
    `amenity_id` INT NOT NULL,
    PRIMARY KEY (`property_id`, `amenity_id`),
    CONSTRAINT `fk_pa_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pa_amenity` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. PROPERTY_IMAGES TABLE (Property Gallery & CDN/S3 References)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `property_images`;
CREATE TABLE `property_images` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `property_id` VARCHAR(36) NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT FALSE,
    `sort_order` INT NOT NULL DEFAULT 0,
    `caption` VARCHAR(200) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_images_property` (`property_id`),
    CONSTRAINT `fk_images_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. FAVORITES TABLE (Tenant Saved Properties)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `property_id` VARCHAR(36) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_property_favorite` (`user_id`, `property_id`),
    INDEX `idx_fav_user` (`user_id`),
    CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_fav_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. BOOKINGS TABLE (Rental Requests & Lifecycle Workflow)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
    `id` VARCHAR(36) NOT NULL,
    `booking_code` VARCHAR(30) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `property_id` VARCHAR(36) NOT NULL,
    `room_id` VARCHAR(36) NOT NULL,
    `move_in_date` DATE NOT NULL,
    `duration_months` INT NOT NULL DEFAULT 6,
    `rent_amount` DECIMAL(10, 2) NOT NULL,
    `deposit_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `total_estimated_cost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `booking_status` ENUM('requested', 'viewed', 'accepted', 'rejected', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'requested',
    `tenant_note` TEXT DEFAULT NULL,
    `owner_rejection_reason` TEXT DEFAULT NULL,
    `status_updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_booking_code` (`booking_code`),
    INDEX `idx_bookings_user` (`user_id`),
    INDEX `idx_bookings_property_status` (`property_id`, `booking_status`),
    INDEX `idx_bookings_room` (`room_id`),
    CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_bookings_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_bookings_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. REVIEWS TABLE (Multi-Dimensional Feedback from Verified Tenants)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `property_id` VARCHAR(36) NOT NULL,
    `overall_rating` DECIMAL(2, 1) NOT NULL,
    `cleanliness_rating` DECIMAL(2, 1) NOT NULL DEFAULT 5.0,
    `location_rating` DECIMAL(2, 1) NOT NULL DEFAULT 5.0,
    `facilities_rating` DECIMAL(2, 1) NOT NULL DEFAULT 5.0,
    `value_for_money_rating` DECIMAL(2, 1) NOT NULL DEFAULT 5.0,
    `review_text` TEXT NOT NULL,
    `owner_response` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_property_review` (`user_id`, `property_id`),
    INDEX `idx_reviews_property` (`property_id`),
    CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reviews_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_rating_range` CHECK (`overall_rating` >= 1.0 AND `overall_rating` <= 5.0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 11. PROPERTY_VIEWS TABLE (Audit Views & Analytics Tracking)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `property_views`;
CREATE TABLE `property_views` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `property_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` VARCHAR(255) DEFAULT NULL,
    `viewed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_views_property_time` (`property_id`, `viewed_at`),
    CONSTRAINT `fk_views_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_views_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 12. VERIFICATION_LOGS TABLE (Admin Action & Safety Audit Trail)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `verification_logs`;
CREATE TABLE `verification_logs` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `property_id` VARCHAR(36) NOT NULL,
    `admin_id` VARCHAR(36) NOT NULL,
    `action` ENUM('verified', 'rejected', 'expired') NOT NULL,
    `comments` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_verif_prop` (`property_id`),
    CONSTRAINT `fk_verif_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_verif_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;