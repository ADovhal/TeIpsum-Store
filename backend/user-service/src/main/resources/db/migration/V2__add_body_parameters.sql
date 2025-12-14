-- Migration: Add body parameters columns to user_profiles table
-- Date: 2024
-- Description: Adds body measurement fields for fit service functionality

-- Add body parameter columns to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS body_height DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_chest DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_waist DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_hips DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_shoulder_width DOUBLE PRECISION;

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.body_height IS 'User height in centimeters for fit service';
COMMENT ON COLUMN user_profiles.body_chest IS 'User chest circumference in centimeters for fit service';
COMMENT ON COLUMN user_profiles.body_waist IS 'User waist circumference in centimeters for fit service';
COMMENT ON COLUMN user_profiles.body_hips IS 'User hips circumference in centimeters for fit service';
COMMENT ON COLUMN user_profiles.body_shoulder_width IS 'User shoulder width in centimeters for fit service';

