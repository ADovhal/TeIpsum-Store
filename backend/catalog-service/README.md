# Catalog Service - TeIpsum E-Commerce Platform

## 📦 Overview

The Catalog Service manages the product catalog for the TeIpsum e-commerce platform. It provides a read-optimized view of products with advanced filtering, search capabilities, and caching for high performance. The service listens to product events from the Admin Product Service to maintain data synchronization.

## 🎯 Core Features

### 📋 Product Catalog Management
- **Product Display**: Read-optimized product catalog with full product details
- **Advanced Filtering**: Filter by category, subcategory, gender, price range
- **Search Functionality**: Full-text search across product titles and descriptions
- **Pagination**: Efficient pagination for large product catalogs
- **Product Caching**: Redis-based caching for improved performance

### 📡 Event-Driven Synchronization
- **Product Creation**: Listen to product creation events from admin service
- **Product Updates**: Real-time product updates via Kafka events
- **Product Deletion**: Handle product removal events
- **Data Consistency**: Maintain catalog synchronization with product management

### 🔍 Advanced Query Capabilities
- **Specification-Based Filtering**: Dynamic query building with Spring Data JPA
- **HATEOAS Support**: Hypermedia-driven API responses
- **Performance Optimization**: Optimized queries with proper indexing

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │   Repositories  │
│                 │    │                 │    │                 │
│ProductController│───►│ CatalogService  │───►│CatalogProduct   │
│                 │    │                 │    │   Repository    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │   Event Listeners   │
                    │                     │
                    │ProductEventListener │
                    │  - Created Events   │
                    │  - Updated Events   │
                    │  - Deleted Events   │
                    └─────────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │  External Services  │
                    │                     │
                    │  PostgreSQL DB     │
                    │  Apache Kafka      │
                    │  Redis Cache       │
                    └─────────────────────┘
```

## 🛠️ Technology Stack

### Core Framework
- **Spring Boot**: 3.3.4 with auto-configuration
- **Spring Data JPA**: Advanced query capabilities with Specifications
- **Spring HATEOAS**: Hypermedia-driven REST APIs

### Event Processing & Caching
- **Apache Kafka**: Event streaming for product synchronization
- **Spring Cache**: Caching abstraction with Redis backend
- **Spring Kafka**: Kafka integration with message listeners

### Database & Search
- **PostgreSQL**: Primary database with JPA/Hibernate
- **Custom Specifications**: Dynamic query building for filtering

## 📁 Project Structure

```
catalog-service/
├── src/main/java/com/teipsum/catalogservice/
│   ├── CatalogServiceApplication.java    # Main application class
│   ├── controller/
│   │   └── ProductController.java        # REST endpoints
│   ├── service/
│   │   └── CatalogService.java           # Core business logic
│   ├── model/
│   │   └── CatalogProduct.java           # Product entity
│   ├── repository/
│   │   └── CatalogProductRepository.java # Data access layer
│   ├── event/
│   │   ├── ProductEventListener.java     # Kafka event handlers
│   │   └── ProductEventValidator.java    # Event validation
│   ├── dto/
│   │   └── CatalogProductDTO.java        # Data transfer objects
│   ├── util/
│   │   └── ProductDtoConverter.java      # DTO conversion utilities
│   ├── config/
│   │   ├── SecurityConfig.java           # Security configuration
│   │   ├── KafkaConfig.java              # Kafka configuration
│   │   └── CacheConfig.java              # Caching configuration
│   └── exception/
│       ├── ProductNotFoundException.java  # Custom exceptions
│       └── EventProcessingException.java
├── src/main/resources/
│   ├── application.yml                   # Configuration
│   └── log4j2.xml                       # Logging configuration
├── pom.xml                              # Maven dependencies
└── Dockerfile                           # Container configuration
```

## 🚀 API Endpoints

### Product Catalog Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/products` | Get filtered products | `category`, `gender`, `minPrice`, `maxPrice`, `page`, `size` |
| GET | `/api/products/{id}` | Get product by ID | `id` - Product UUID |

### Example API Usage

#### Get Filtered Products
```bash
curl -X GET "http://localhost:8083/api/products?category=clothing&gender=women&minPrice=50&maxPrice=200&page=0&size=10" \
  -H "Accept: application/hal+json"
```

**Response:**
```json
{
  "_embedded": {
    "catalogProductDTOList": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Sustainable Cotton T-Shirt",
        "description": "Eco-friendly cotton t-shirt made from organic materials",
        "price": 29.99,
        "discount": 10,
        "category": "clothing",
        "subcategory": "tops",
        "gender": "women",
        "imageUrls": ["https://example.com/image1.jpg"],
        "available": true,
        "_links": {
          "self": {
            "href": "http://localhost:8083/api/products/123e4567-e89b-12d3-a456-426614174000"
          }
        }
      }
    ]
  },
  "_links": {
    "first": {"href": "http://localhost:8083/api/products?page=0&size=10"},
    "self": {"href": "http://localhost:8083/api/products?page=0&size=10"},
    "next": {"href": "http://localhost:8083/api/products?page=1&size=10"},
    "last": {"href": "http://localhost:8083/api/products?page=5&size=10"}
  },
  "page": {
    "size": 10,
    "totalElements": 56,
    "totalPages": 6,
    "number": 0
  }
}
```

#### Get Product by ID
```bash
curl -X GET http://localhost:8083/api/products/123e4567-e89b-12d3-a456-426614174000 \
  -H "Accept: application/json"
```

## 📦 Product Data Model

### CatalogProduct Entity
```java
@Entity
@Table(name = "catalog_products")
public class CatalogProduct {
    @Id
    private UUID id;                    // Product UUID
    
    @Column(nullable = false)
    private String title;               // Product title
    
    @Column(length = 2000)
    private String description;         // Product description
    
    @Column(nullable = false)
    private BigDecimal price;           // Product price
    
    @Column
    private Integer discount;           // Discount percentage
    
    @Column(nullable = false)
    private String category;            // Main category
    
    @Column
    private String subcategory;         // Subcategory
    
    @Column(nullable = false)
    private String gender;              // Target gender
    
    @ElementCollection
    private List<String> imageUrls;     // Product images
    
    @Column(nullable = false)
    private Boolean available;          // Availability status
}
```

### Filtering Capabilities
```java
// Example filter request
public record ProductFilterRequest(
    String category,        // "clothing", "accessories", "shoes"
    String subcategory,     // "tops", "bottoms", "dresses"
    String gender,          // "men", "women", "kids", "unisex"
    BigDecimal minPrice,    // Minimum price filter
    BigDecimal maxPrice,    // Maximum price filter
    String searchTerm,      // Full-text search
    Boolean available       // Availability filter
) {}
```

## 📡 Event Processing

### Kafka Event Listeners

#### Product Creation Event
```java
@KafkaListener(topics = "product-created", groupId = "catalog-service-group")
public void handleProductCreated(ProductCreatedEvent event) {
    CatalogProduct product = CatalogProduct.builder()
        .id(UUID.fromString(event.id()))
        .title(event.title())
        .description(event.description())
        .price(event.price())
        .discount(event.discount())
        .category(event.category())
        .subcategory(event.subcategory())
        .gender(event.gender())
        .imageUrls(event.imageUrls())
        .available(event.available())
        .build();
    
    catalogProductRepository.save(product);
}
```

#### Product Update Event
```java
@KafkaListener(topics = "product-updated", groupId = "catalog-service-group") 
public void handleProductUpdated(ProductUpdatedEvent event) {
    CatalogProduct product = catalogProductRepository.findById(event.id())
        .orElseThrow(() -> new ProductNotFoundException(event.id()));
    
    // Update product fields
    product.setTitle(event.title());
    product.setDescription(event.description());
    product.setPrice(event.price());
    // ... other fields
    
    catalogProductRepository.save(product);
    
    // Clear cache for updated product
    cacheManager.evict("products", event.id());
}
```

## 💾 Caching Strategy

### Cache Configuration
```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        RedisCacheManager.Builder builder = RedisCacheManager
            .RedisCacheManagerBuilder
            .fromConnectionFactory(redisConnectionFactory())
            .cacheDefaults(cacheConfiguration(Duration.ofMinutes(10)));
        
        return builder.build();
    }
    
    private RedisCacheConfiguration cacheConfiguration(Duration ttl) {
        return RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(ttl)
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }
}
```

### Cached Methods
```java
@Cacheable(value = "products", key = "#id")
public CatalogProduct getProductById(String id) {
    return catalogProductRepository.findById(id)
        .orElseThrow(() -> new ProductNotFoundException(id));
}

@CacheEvict(value = "products", key = "#event.id()")
public void updateProduct(ProductUpdatedEvent event) {
    // Update logic
}
```

## 🔍 Advanced Filtering

### Specification-Based Queries
```java
public class ProductSpecifications {
    
    public static Specification<CatalogProduct> hasCategory(String category) {
        return (root, query, criteriaBuilder) -> 
            category == null ? null : criteriaBuilder.equal(root.get("category"), category);
    }
    
    public static Specification<CatalogProduct> hasGender(String gender) {
        return (root, query, criteriaBuilder) -> 
            gender == null ? null : criteriaBuilder.equal(root.get("gender"), gender);
    }
    
    public static Specification<CatalogProduct> priceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice == null) return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
            if (maxPrice == null) return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
        };
    }
    
    public static Specification<CatalogProduct> titleContains(String searchTerm) {
        return (root, query, criteriaBuilder) -> 
            searchTerm == null ? null : 
            criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), 
                "%" + searchTerm.toLowerCase() + "%");
    }
}
```

## 📊 Database Schema

### Catalog Products Table
```sql
CREATE TABLE catalog_products (
    id UUID PRIMARY KEY,
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

-- Performance indexes
CREATE INDEX idx_catalog_products_category ON catalog_products(category);
CREATE INDEX idx_catalog_products_gender ON catalog_products(gender);
CREATE INDEX idx_catalog_products_price ON catalog_products(price);
CREATE INDEX idx_catalog_products_available ON catalog_products(available);
CREATE INDEX idx_catalog_products_category_gender ON catalog_products(category, gender);

-- Full-text search index
CREATE INDEX idx_catalog_products_title_search ON catalog_products USING gin(to_tsvector('english', title));
```

### Product Images Table
```sql
CREATE TABLE catalog_product_images (
    product_id UUID REFERENCES catalog_products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_order INTEGER DEFAULT 0,
    PRIMARY KEY (product_id, image_url)
);
```

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
SERVICE_SERVER_PORT=8083

# Database Configuration
DB_URL=jdbc:postgresql://postgres:5432/teipsum_catalog
DB_USER=catalog_user
DB_PASSWORD=secure_password

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# Kafka Configuration
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9094

# JWT Configuration (for future secured endpoints)
JWT_SECRET=your_jwt_secret
```

### Application Configuration
```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 15
      minimum-idle: 5

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        default_batch_fetch_size: 16

  redis:
    host: ${REDIS_HOST}
    port: ${REDIS_PORT}
    password: ${REDIS_PASSWORD}
    timeout: 2000ms

  kafka:
    consumer:
      group-id: catalog-service-group
      auto-offset-reset: earliest
      properties:
        spring.json.trusted.packages: "com.teipsum.shared.product.event"

# Caching configuration
cache:
  products:
    ttl: 600  # 10 minutes
```

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **Maven 3.8+**
- **PostgreSQL 15+**
- **Redis 6+** (for caching)
- **Apache Kafka** (for events)

### Local Development

1. **Set up database**
   ```sql
   CREATE DATABASE teipsum_catalog;
   CREATE USER catalog_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE teipsum_catalog TO catalog_user;
   ```

2. **Set up Redis**
   ```bash
   # Using Docker
   docker run -d --name redis -p 6379:6379 redis:6-alpine
   ```

3. **Set environment variables**
   ```bash
   export DB_URL="jdbc:postgresql://localhost:5432/teipsum_catalog"
   export DB_USER="catalog_user"
   export DB_PASSWORD="your_password"
   export REDIS_HOST="localhost"
   export SPRING_KAFKA_BOOTSTRAP_SERVERS="localhost:9092"
   ```

4. **Run the service**
   ```bash
   cd catalog-service
   mvn spring-boot:run
   ```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=CatalogServiceTest
```

### Integration Tests
```bash
# Run integration tests with Testcontainers
mvn verify -P integration-tests
```

### Performance Testing
```bash
# Load test the filtering endpoint
curl -w "@curl-format.txt" -s -o /dev/null \
  "http://localhost:8083/api/products?category=clothing&page=0&size=20"
```

## 📈 Performance Optimization

### Database Optimization
- **Proper Indexing**: Multi-column indexes for common filter combinations
- **Query Optimization**: Efficient JPA queries with fetch strategies
- **Connection Pooling**: Optimized HikariCP settings

### Caching Strategy
- **Product Caching**: Individual product caching with TTL
- **Query Result Caching**: Cache filtered results for popular queries
- **Cache Warming**: Pre-populate cache with popular products

### API Performance
- **Pagination**: Efficient pagination to limit result sets
- **Field Selection**: Allow clients to specify required fields
- **Compression**: GZIP compression for large responses

## 🔍 Troubleshooting

### Common Issues

1. **Product Not Found After Creation**
   ```bash
   # Check Kafka topic and consumer lag
   kafka-consumer-groups --bootstrap-server localhost:9092 \
     --group catalog-service-group --describe
   ```

2. **Cache Issues**
   ```bash
   # Check Redis connectivity
   redis-cli ping
   
   # View cached products
   redis-cli keys "products::*"
   ```

3. **Slow Queries**
   ```sql
   -- Check query performance
   EXPLAIN ANALYZE SELECT * FROM catalog_products 
   WHERE category = 'clothing' AND gender = 'women';
   ```

## 📚 Additional Resources

- [Spring Data JPA Specifications](https://docs.spring.io/spring-data/jpa/docs/current/reference/#specifications)
- [Spring HATEOAS Documentation](https://docs.spring.io/spring-hateoas/docs/current/reference/)
- [Redis Caching Best Practices](https://redis.io/docs/manual/patterns/)
- [PostgreSQL Indexing Guide](https://www.postgresql.org/docs/current/indexes.html)

## 🤝 Contributing

1. Follow Spring Boot and JPA best practices
2. Maintain comprehensive test coverage for filtering logic
3. Optimize database queries for performance
4. Update cache strategies when adding new features
5. Document API changes and new filter options

---

**Product Catalog Service for TeIpsum E-Commerce Platform** 📦