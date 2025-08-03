# Admin Product Service - TeIpsum E-Commerce Platform

## 🔧 Overview

The Admin Product Service provides comprehensive product management capabilities for administrators. It handles product CRUD operations, inventory management, and publishes product events to synchronize with the catalog service.

## 🎯 Core Features

### 📦 Product Management
- **Product Creation**: Create new products with detailed information
- **Product Updates**: Modify existing product details and specifications
- **Product Deletion**: Remove products from the catalog
- **Bulk Operations**: Handle multiple products efficiently

### 🔐 Admin Security
- **Role-based Access**: Admin-only access with JWT validation
- **Secure Operations**: All operations require admin authentication
- **Audit Logging**: Track all product management activities

### 📡 Event Publishing
- **Product Events**: Publish product lifecycle events to Kafka
- **Catalog Sync**: Ensure catalog service stays synchronized
- **Inventory Updates**: Notify inventory service of product changes

## 🛠️ Technology Stack

- **Spring Boot**: 3.3.4 with microservices architecture
- **Spring Security**: JWT-based admin authentication
- **Spring Data JPA**: Database operations with PostgreSQL
- **Apache Kafka**: Event streaming for product events
- **Bean Validation**: Input validation and data integrity

## 📁 Project Structure

```
admin-product-service/
├── src/main/java/com/teipsum/adminproductservice/
│   ├── AdminProductServiceApplication.java
│   ├── controller/
│   │   └── AdminProductController.java  # Admin REST endpoints
│   ├── service/
│   │   └── AdminProductService.java     # Business logic
│   ├── model/
│   │   └── Product.java                 # Product entity
│   ├── dto/
│   │   ├── ProductRequest.java          # Product creation/update request
│   │   └── ProductResponse.java         # Product response
│   ├── repository/
│   │   └── ProductRepository.java       # Data access
│   └── config/
│       └── SecurityConfig.java          # Security configuration
└── pom.xml                             # Dependencies
```

## 🚀 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/products` | Create product | Admin Token |
| PUT | `/api/admin/products/{id}` | Update product | Admin Token |
| GET | `/api/admin/products/{id}` | Get product for editing | Admin Token |
| DELETE | `/api/admin/products/{id}` | Delete product | Admin Token |
| GET | `/api/admin/products` | List all products | Admin Token |

### Example Usage

#### Create Product
```bash
curl -X POST http://localhost:8086/api/admin/products \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sustainable Cotton T-Shirt",
    "description": "Eco-friendly organic cotton t-shirt",
    "price": 29.99,
    "discount": 10,
    "category": "clothing",
    "subcategory": "tops",
    "gender": "women",
    "imageUrls": ["https://example.com/image1.jpg"],
    "available": true
  }'
```

## 📊 Database Schema

### Products Table
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount INTEGER DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    gender VARCHAR(20) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_order INTEGER DEFAULT 0,
    PRIMARY KEY (product_id, image_url)
);
```

## 📡 Event Publishing

Publishes events to synchronize with catalog service:

```java
// Product created event
ProductCreatedEvent event = new ProductCreatedEvent(
    product.getId().toString(),
    product.getTitle(),
    product.getDescription(),
    product.getPrice(),
    product.getDiscount(),
    product.getCategory(),
    product.getSubcategory(),
    product.getGender(),
    product.getImageUrls(),
    product.getAvailable()
);
kafkaTemplate.send("product-created", event);
```

## 🔧 Configuration

### Environment Variables
```bash
SERVICE_SERVER_PORT=8086
DB_URL=jdbc:postgresql://postgres:5432/teipsum_admin_product
DB_USER=admin_product_user
DB_PASSWORD=secure_password
JWT_ADMIN_SECRET=your_admin_jwt_secret
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9094
```

## 🔐 Security

All endpoints require admin authentication:

```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public ProductResponse createProduct(@RequestBody @Valid ProductRequest request) {
    // Product creation logic
}
```

## 🚀 Getting Started

1. **Set up database**
   ```sql
   CREATE DATABASE teipsum_admin_product;
   CREATE USER admin_product_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE teipsum_admin_product TO admin_product_user;
   ```

2. **Run the service**
   ```bash
   cd admin-product-service
   mvn spring-boot:run
   ```

---

**Admin Product Management Service for TeIpsum E-Commerce Platform** 🔧