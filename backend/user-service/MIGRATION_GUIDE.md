# Database Migration Guide - Body Parameters

## Overview

This guide explains how to add body parameter columns to the `user_profiles` table for the fit service functionality.

## Problem

The `user_profiles` table needs new columns to store user body measurements:
- `body_height` (height in cm)
- `body_chest` (chest circumference in cm)
- `body_waist` (waist circumference in cm)
- `body_hips` (hips circumference in cm)
- `body_shoulder_width` (shoulder width in cm)

## Solution Options

### Option 1: Manual SQL Migration (Recommended for Production)

1. **Connect to your PostgreSQL database:**
   ```bash
   psql -U your_user -d your_database
   ```

2. **Run the migration script:**
   ```sql
   -- Add body parameter columns
   ALTER TABLE user_profiles
   ADD COLUMN IF NOT EXISTS body_height DOUBLE PRECISION,
   ADD COLUMN IF NOT EXISTS body_chest DOUBLE PRECISION,
   ADD COLUMN IF NOT EXISTS body_waist DOUBLE PRECISION,
   ADD COLUMN IF NOT EXISTS body_hips DOUBLE PRECISION,
   ADD COLUMN IF NOT EXISTS body_shoulder_width DOUBLE PRECISION;
   ```

3. **Verify the migration:**
   ```sql
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'user_profiles'
   AND column_name LIKE 'body_%';
   ```

### Option 2: Using SQL File

Execute the provided SQL file:

```bash
psql -U your_user -d your_database -f src/main/resources/db/migration/manual_migration.sql
```

### Option 3: Temporary ddl-auto: update (Development Only)

⚠️ **WARNING: Only use this for development!**

1. **Modify `application.yml`:**
   ```yaml
   spring:
     jpa:
       hibernate:
         ddl-auto: update  # Change from 'validate' to 'update'
   ```

2. **Start the service** - Hibernate will automatically add the columns

3. **Change back to `validate`** after the first run:
   ```yaml
   spring:
     jpa:
       hibernate:
         ddl-auto: validate
   ```

## Verification

After running the migration, verify the columns exist:

```sql
-- Check if columns exist
\d user_profiles

-- Or using SQL
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND column_name IN (
    'body_height',
    'body_chest',
    'body_waist',
    'body_hips',
    'body_shoulder_width'
);
```

## Testing

1. **Start the user-service:**
   ```bash
   cd backend/user-service
   mvn spring-boot:run
   ```

2. **Test the API endpoint:**
   ```bash
   curl -X POST http://localhost:8082/api/users/body-parameters \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "height": 180,
       "chest": 105,
       "waist": 90,
       "hips": 100,
       "shoulderWidth": 48
     }'
   ```

3. **Verify data was saved:**
   ```sql
   SELECT id, email, body_height, body_chest, body_waist, body_hips, body_shoulder_width
   FROM user_profiles
   WHERE body_height IS NOT NULL;
   ```

## Rollback (if needed)

If you need to remove the columns:

```sql
ALTER TABLE user_profiles
DROP COLUMN IF EXISTS body_height,
DROP COLUMN IF EXISTS body_chest,
DROP COLUMN IF EXISTS body_waist,
DROP COLUMN IF EXISTS body_hips,
DROP COLUMN IF EXISTS body_shoulder_width;
```

## Notes

- All new columns are nullable, so existing users won't be affected
- The columns use `DOUBLE PRECISION` for precise measurements
- The migration uses `IF NOT EXISTS` to prevent errors if run multiple times
- Data is stored in the `user_profiles` table in the user-service database

