-- Manual SQL migration script for adding body parameters
-- Run this script directly on your PostgreSQL database if Flyway/Liquibase is not configured
-- 
-- Usage:
-- psql -U your_user -d your_database -f manual_migration.sql
-- OR
-- Execute this script in your database management tool

-- Add body parameter columns to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS body_height DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_chest DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_waist DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_hips DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_shoulder_width DOUBLE PRECISION;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND column_name LIKE 'body_%';

