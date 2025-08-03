# Inventory Service - TeIpsum E-Commerce Platform

## 📦 Overview

The Inventory Service manages product stock levels and availability for the TeIpsum e-commerce platform. It handles inventory tracking, stock updates, and provides real-time availability information to other services.

## 🎯 Core Features

### 📊 Stock Management
- **Inventory Tracking**: Real-time tracking of product stock levels
- **Stock Updates**: Handle stock increases and decreases
- **Availability Checks**: Verify product availability for orders
- **Low Stock Alerts**: Notify when products reach minimum stock levels

### 📡 Event-Driven Updates
- **Order Events**: Listen to order events to update stock levels
- **Product Events**: Handle new product additions and removals
- **Inventory Events**: Publish stock level changes to other services

### 🔄 Multi-Warehouse Support
- **Warehouse Management**: Support for multiple warehouse locations
- **Stock Allocation**: Intelligent stock allocation across warehouses
- **Transfer Management**: Handle stock transfers between locations

## 🛠️ Technology Stack

- **Spring Boot**: 3.3.4 with microservices architecture
- **Spring Data JPA**: Database operations with PostgreSQL
- **Apache Kafka**: Event streaming for inventory updates
- **Redis**: Caching for high-performance stock checks

## 📁 Project Structure

```
inventory-service/
├── src/main/java/com/teipsum/inventoryservice/
│   ├── InventoryServiceApplication.java
│   ├── controller/
│   │   └── InventoryController.java     # REST endpoints
│   ├── service/
│   │   └── InventoryService.java        # Business logic
│   ├── model/
│   │   ├── Inventory.java               # Inventory entity
│   │   └── Warehouse.java               # Warehouse entity
│   ├── repository/
│   │   └── InventoryRepository.java     # Data access
│   ├── event/
│   │   └── InventoryEventListener.java  # Event handlers
│   └── config/
│       └── KafkaConfig.java             # Kafka configuration
└── pom.xml                             # Dependencies
```

## 🚀 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/inventory/{productId}` | Get product stock level | Service Token |
| POST | `/api/inventory/check` | Check multiple products availability | Service Token |
| PUT | `/api/inventory/{productId}/stock` | Update stock level | Admin Token |
| GET | `/api/inventory/low-stock` | Get low stock products | Admin Token |

### Example Usage

#### Check Product Availability
```bash
curl -X GET http://localhost:8085/api/inventory/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer service_token"
```

**Response:**
```json
{
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "availableStock": 25,
  "reservedStock": 5,
  "totalStock": 30,
  "available": true,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

## 📊 Database Schema

### Inventory Table
```sql
CREATE TABLE inventory (
    product_id UUID PRIMARY KEY,
    available_stock INTEGER NOT NULL DEFAULT 0,
    reserved_stock INTEGER NOT NULL DEFAULT 0,
    total_stock INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER NOT NULL DEFAULT 5,
    warehouse_id UUID,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_inventory_available_stock ON inventory(available_stock);
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
```

## 📡 Event Processing

### Order Event Handling
```java
@KafkaListener(topics = "order-created", groupId = "inventory-service-group")
public void handleOrderCreated(OrderCreatedEvent event) {
    for (OrderItem item : event.getItems()) {
        inventoryService.reserveStock(item.getProductId(), item.getQuantity());
    }
}

@KafkaListener(topics = "order-confirmed", groupId = "inventory-service-group")
public void handleOrderConfirmed(OrderConfirmedEvent event) {
    for (OrderItem item : event.getItems()) {
        inventoryService.decreaseStock(item.getProductId(), item.getQuantity());
    }
}
```

### Stock Level Events
```java
// Publish low stock alert
if (inventory.getAvailableStock() <= inventory.getMinStockLevel()) {
    LowStockEvent event = new LowStockEvent(
        inventory.getProductId(),
        inventory.getAvailableStock(),
        inventory.getMinStockLevel()
    );
    kafkaTemplate.send("inventory-alerts", event);
}
```

## 🔧 Configuration

### Environment Variables
```bash
SERVICE_SERVER_PORT=8085
DB_URL=jdbc:postgresql://postgres:5432/teipsum_inventory
DB_USER=inventory_user
DB_PASSWORD=secure_password
REDIS_HOST=redis
REDIS_PORT=6379
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9094
```

### Application Configuration
```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  
  redis:
    host: ${REDIS_HOST}
    port: ${REDIS_PORT}
    timeout: 2000ms
  
  kafka:
    consumer:
      group-id: inventory-service-group
      auto-offset-reset: earliest

# Inventory specific settings
inventory:
  default-min-stock: 5
  reserve-timeout-minutes: 15
```

## 💾 Caching Strategy

```java
@Cacheable(value = "inventory", key = "#productId")
public InventoryLevel getInventoryLevel(UUID productId) {
    return inventoryRepository.findByProductId(productId);
}

@CacheEvict(value = "inventory", key = "#productId")
public void updateStock(UUID productId, int quantity) {
    // Update logic
}
```

## 🔍 Stock Management Operations

### Reserve Stock
```java
@Transactional
public boolean reserveStock(UUID productId, int quantity) {
    Inventory inventory = inventoryRepository.findByProductId(productId);
    
    if (inventory.getAvailableStock() >= quantity) {
        inventory.setAvailableStock(inventory.getAvailableStock() - quantity);
        inventory.setReservedStock(inventory.getReservedStock() + quantity);
        inventoryRepository.save(inventory);
        return true;
    }
    return false;
}
```

### Release Reserved Stock
```java
@Transactional
public void releaseReservedStock(UUID productId, int quantity) {
    Inventory inventory = inventoryRepository.findByProductId(productId);
    inventory.setAvailableStock(inventory.getAvailableStock() + quantity);
    inventory.setReservedStock(inventory.getReservedStock() - quantity);
    inventoryRepository.save(inventory);
}
```

## 🚀 Getting Started

1. **Set up database**
   ```sql
   CREATE DATABASE teipsum_inventory;
   CREATE USER inventory_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE teipsum_inventory TO inventory_user;
   ```

2. **Set up Redis**
   ```bash
   docker run -d --name redis -p 6379:6379 redis:6-alpine
   ```

3. **Run the service**
   ```bash
   cd inventory-service
   mvn spring-boot:run
   ```

## 📊 Monitoring & Alerts

### Low Stock Monitoring
```java
@Scheduled(fixedRate = 300000) // Every 5 minutes
public void checkLowStock() {
    List<Inventory> lowStockItems = inventoryRepository
        .findByAvailableStockLessThanMinStockLevel();
    
    for (Inventory item : lowStockItems) {
        publishLowStockAlert(item);
    }
}
```

### Metrics
- Total products tracked
- Low stock alerts count
- Stock movement frequency
- Reserve/release operations

---

**Inventory Management Service for TeIpsum E-Commerce Platform** 📦