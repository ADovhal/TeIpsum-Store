# Fit Service Setup and Testing Guide

## Overview

The Fit Service is a Node.js microservice that provides 3D mannequin rendering using ThreeJS. It allows users to visualize clothing on custom mannequins based on their body parameters.

## Prerequisites

- Node.js 18+ installed
- Docker (optional, for containerized deployment)
- Backend services running (user-service for body parameters)

## Backend Setup

### 1. Start Fit Service

```bash
cd backend/fitservice
npm install
npm start
```

The service will run on `http://localhost:8087` by default.

### 2. Environment Variables

Create a `.env` file in the project root (if not exists) with:

```env
SERVICE_SERVER_PORT=8087
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Database Migration

**IMPORTANT:** The user-service database needs to be updated to include body parameter fields. The fields are already added to the `UserProfile` entity, but you need to run a database migration.

**Option 1: Manual SQL Migration (Recommended)**

Connect to your PostgreSQL database and run:

```sql
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS body_height DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_chest DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_waist DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_hips DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS body_shoulder_width DOUBLE PRECISION;
```

Or use the provided migration file:
```bash
psql -U your_user -d your_database -f backend/user-service/src/main/resources/db/migration/manual_migration.sql
```

**Option 2: Using ddl-auto: update (Development Only)**

⚠️ **Only for development!** Temporarily change `ddl-auto: validate` to `ddl-auto: update` in `application.yml`, start the service once, then change it back.

See [backend/user-service/MIGRATION_GUIDE.md](../backend/user-service/MIGRATION_GUIDE.md) for detailed migration instructions.

## Frontend Setup

### 1. Environment Variables

Add to your `.env` file in the frontend directory:

```env
REACT_APP_FITSERVICE_URL=http://localhost:8087
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm start
```

## Testing the Service

### 1. Test Fit Service Directly

Open in browser:
```
http://localhost:8087/api/render?height=175&chest=100&waist=85&hips=95&shoulderWidth=45
```

### 2. Test from Frontend

1. **Login** to the application
2. Click the **magic wand icon** (✨) in the header (visible only for authenticated users)
3. If it's your first visit, you'll see a dialog to set your body parameters
4. Fill in your measurements and click "Save"
5. The 3D mannequin will render with your body parameters
6. Select products from the right panel to add them to the mannequin

### 3. Test API Endpoints

#### Get Body Parameters
```bash
curl -X GET http://localhost:8082/api/users/body-parameters \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Save Body Parameters
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

## Docker Deployment

### Build and Run

```bash
# Build
docker build -t fitservice -f backend/fitservice/Dockerfile .

# Run
docker run -p 8087:8087 \
  -e SERVICE_SERVER_PORT=8087 \
  -e CORS_ALLOWED_ORIGINS=http://localhost:3000 \
  fitservice
```

### Using Docker Compose

```bash
cd backend/fitservice
docker-compose -f docker-compose.prod-fitservice.yml up -d
```

## Features

- ✅ Custom 3D mannequin based on body parameters
- ✅ Interactive camera controls (mouse rotation, wheel zoom)
- ✅ Clothing overlay on mannequin
- ✅ Support for GLTF/GLB 3D models
- ✅ Simple geometric clothing for demonstration
- ✅ Multi-language support (EN, DE, PL, UA)
- ✅ User body parameters persistence
- ✅ First-time setup dialog

## Troubleshooting

### Fit Service Not Starting

1. Check if port 8087 is available:
   ```bash
   netstat -an | grep 8087
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be 18+
   ```

### Body Parameters Not Saving

1. Ensure user-service is running
2. Check authentication token is valid
3. Verify database connection in user-service
4. Check user-service logs for errors

### 3D Mannequin Not Rendering

1. Check browser console for errors
2. Verify ThreeJS CDN is accessible
3. Check if iframe is loading correctly
4. Verify body parameters are valid numbers

## Next Steps

- Add more realistic mannequin models
- Support for clothing textures
- Save rendered images
- Mannequin animations
- Fabric physics simulation

