# Quick Migration Guide - Body Parameters

## Problem
The `user_profiles` table needs new columns to store body measurements for the fit service.

## Quick Solution

### Step 1: Connect to Database
```bash
psql -U your_user -d your_database_name
```

### Step 2: Run Migration
```sql
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS body_height DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_chest DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_waist DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_hips DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_shoulder_width DOUBLE PRECISION;
```

### Step 3: Verify
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name LIKE 'body_%';
```

You should see 5 columns: `body_height`, `body_chest`, `body_waist`, `body_hips`, `body_shoulder_width`.

### Step 4: Restart User Service
```bash
cd backend/user-service
mvn spring-boot:run
```

## Done! ✅

The body parameters will now be saved in the `user_profiles` table in the user-service database.

## Where Data is Stored

- **Database**: PostgreSQL (user-service database)
- **Table**: `user_profiles`
- **Columns**: 
  - `body_height` - User height in cm
  - `body_chest` - Chest circumference in cm
  - `body_waist` - Waist circumference in cm
  - `body_hips` - Hips circumference in cm
  - `body_shoulder_width` - Shoulder width in cm

## Testing

After migration, test the API:

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

For more details, see [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

