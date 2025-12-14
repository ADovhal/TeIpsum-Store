# Fit Service - 3D Mannequin Renderer

Microservice for rendering 3D mannequins using ThreeJS. Allows creating custom mannequins based on user body parameters and overlaying 3D clothing models on them.

## 🎯 Features

- Rendering custom 3D mannequins based on body parameters (height, chest, waist, hips, shoulder width)
- Overlaying 3D clothing models on the mannequin
- Interactive camera controls (rotation, zoom)
- Support for GLTF/GLB clothing models
- Simple geometric clothing models for demonstration

## 🚀 Getting Started

### Local Development

```bash
cd backend/fitservice
npm install
npm start
```

The service will be available at `http://localhost:8087`

### Docker

```bash
docker build -t fitservice -f backend/fitservice/Dockerfile .
docker run -p 8087:8087 fitservice
```

## 📡 API Endpoints

### GET /api/render

Renders an HTML page with a ThreeJS mannequin scene.

**Query parameters:**
- `height` (number): Height in cm (default: 175)
- `chest` (number): Chest circumference in cm (default: 100)
- `waist` (number): Waist circumference in cm (default: 85)
- `hips` (number): Hips circumference in cm (default: 95)
- `shoulderWidth` (number): Shoulder width in cm (default: 45)
- `products` (string): JSON string with array of products

**Example request:**
```
GET /api/render?height=180&chest=105&waist=90&products=[{"id":"1","type":"shirt","color":"0x3498db"}]
```

### POST /api/render

Same as above, but parameters are passed in the request body.

**Example request body:**
```json
{
  "height": 180,
  "chest": 105,
  "waist": 90,
  "hips": 100,
  "shoulderWidth": 48,
  "products": [
    {
      "id": "1",
      "type": "shirt",
      "modelUrl": "https://example.com/models/shirt.gltf",
      "color": "0x3498db"
    },
    {
      "id": "2",
      "type": "pants",
      "modelUrl": "https://example.com/models/pants.gltf",
      "color": "0x2c3e50"
    }
  ]
}
```

### GET /health

Health check endpoint.

## 🎨 Product Format

Products can have the following fields:

- `id` (string): Unique product identifier
- `type` (string): Clothing type (`shirt`, `t-shirt`, `pants`, `trousers`, etc.)
- `modelUrl` (string, optional): URL to GLTF/GLB model
- `color` (string, optional): HEX color for simple models (e.g., `0x3498db`)

## 🏗️ Architecture

- **Express.js**: Web server
- **Three.js**: 3D rendering
- **Node.js**: Runtime environment

## 📦 Dependencies

- `express`: Web framework
- `cors`: CORS middleware
- `helmet`: Security headers
- `dotenv`: Environment variables

## 🔧 Configuration

Environment variables:

- `SERVICE_SERVER_PORT`: Server port (default: 8087)
- `CORS_ALLOWED_ORIGINS`: Allowed origins for CORS (comma-separated)

## 🎮 Usage

1. Open in browser: `http://localhost:8087/api/render?height=175&chest=100`
2. Use mouse to rotate camera
3. Use mouse wheel to zoom
4. Add products via `products` parameter

## 🔮 Future Improvements

- Mannequin animations support
- More realistic mannequin models
- Fabric physics
- Clothing texture support
- Render saving to images
