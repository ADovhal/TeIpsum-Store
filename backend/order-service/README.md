# Order Service - TeIpsum E-Commerce Platform

## 🛒 Overview

The Order Service manages the complete order lifecycle for the TeIpsum e-commerce platform. It handles order creation, processing, tracking, and integrates with payment systems while maintaining order history and customer communication.

## 🎯 Core Features

### 📋 Order Management
- **Order Creation**: Create orders for authenticated users and guests
- **Order Processing**: Handle order workflow from creation to fulfillment
- **Order History**: Maintain complete order history for users
- **Order Tracking**: Provide order status updates and tracking information

### 💳 Payment Integration
- **Payment Processing**: Secure payment handling with multiple providers
- **Payment Validation**: Verify payment status and amounts
- **Refund Management**: Handle refunds and cancellations

### 📦 Inventory Integration
- **Stock Validation**: Verify product availability before order confirmation
- **Inventory Updates**: Update stock levels after successful orders
- **Backorder Handling**: Manage out-of-stock scenarios

## 🛠️ Technology Stack

- **Spring Boot**: 3.3.4 with microservices architecture
- **Spring Security**: JWT-based authentication with OAuth2
- **Spring Data JPA**: Database operations with PostgreSQL
- **Apache Kafka**: Event streaming for order lifecycle events
- **Maven**: Build and dependency management

## 📁 Project Structure

```
order-service/
├── src/main/java/com/teipsum/orderservice/
│   ├── OrderServiceApplication.java
│   ├── controller/
│   │   └── OrderController.java         # REST endpoints
│   ├── service/
│   │   └── OrderService.java            # Business logic
│   ├── model/
│   │   ├── Order.java                   # Order entity
│   │   ├── OrderItem.java               # Order item entity
│   │   └── OrderStatus.java             # Order status enum
│   ├── dto/
│   │   ├── OrderRequest.java            # Order creation request
│   │   └── OrderResponse.java           # Order response
│   ├── repository/
│   │   └── OrderRepository.java         # Data access
│   └── config/
│       └── SecurityConfig.java          # Security configuration
├── src/main/resources/
│   └── application.yml                  # Configuration
└── pom.xml                             # Dependencies
```

## 🚀 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create authenticated order | User Token |
| POST | `/api/orders/guest` | Create guest order | No |
| GET | `/api/orders/{id}` | Get order by ID | User Token |
| GET | `/api/orders/my` | Get user's orders | User Token |
| DELETE | `/api/orders/{id}` | Cancel order | User Token |

### Example Usage

#### Create Order
```bash
curl -X POST http://localhost:8084/api/orders \
  -H "Authorization: Bearer user_token" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "123e4567-e89b-12d3-a456-426614174000",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001",
      "country": "US"
    },
    "paymentMethod": "credit_card"
  }'
```

## 📊 Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    status VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL
);
```

## 📡 Event Publishing

The service publishes order events for inventory and notification services:

```java
// Order created event
OrderCreatedEvent event = new OrderCreatedEvent(
    order.getId(),
    order.getUserId(),
    order.getItems(),
    order.getTotalAmount(),
    LocalDateTime.now()
);
kafkaTemplate.send("order-events", event);
```

## 🔧 Configuration

### Environment Variables
```bash
SERVICE_SERVER_PORT=8084
DB_URL=jdbc:postgresql://postgres:5432/teipsum_order
DB_USER=order_user
DB_PASSWORD=secure_password
JWT_SECRET=your_jwt_secret
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9094
```

## 🚀 Getting Started

1. **Set up database**
   ```sql
   CREATE DATABASE teipsum_order;
   CREATE USER order_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE teipsum_order TO order_user;
   ```

2. **Run the service**
   ```bash
   cd order-service
   mvn spring-boot:run
   ```

---

**Order Management Service for TeIpsum E-Commerce Platform** 🛒