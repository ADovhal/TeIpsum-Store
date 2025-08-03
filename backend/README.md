# Backend Services - TeIpsum E-Commerce Platform

## 🏗️ Architecture Overview

The TeIpsum backend is built using a **microservices architecture** with Spring Boot, designed for scalability, maintainability, and resilience. Each service is independently deployable and handles specific business domains.

## 📋 Service Overview

| Service | Port | Status | Purpose |
|---------|------|--------|---------|
| [Auth Service](auth-service/README.md) | 8081 | ✅ Active | Authentication, authorization, JWT management |
| [User Service](user-service/README.md) | 8082 | ✅ Active | User profile management, user data |
| [Catalog Service](catalog-service/README.md) | 8083 | ✅ Active | Product catalog, search, filtering |
| [Order Service](order-service/README.md) | 8084 | ✅ Active | Order processing, order management |
| [Inventory Service](inventory-service/README.md) | 8085 | ✅ Active | Stock management, inventory tracking |
| [Admin Product Service](admin-product-service/README.md) | 8086 | ✅ Active | Admin product management, CRUD operations |

## 🔧 Shared Modules

| Module | Purpose | Version |
|--------|---------|---------|
| [shared-dto](shared-dto/README.md) | Common data transfer objects | 1.0.0 |
| [shared-exceptions](shared-exceptions/README.md) | Common exception handling | 1.0.0 |
| [shared-logger](shared-logger/README.md) | Centralized logging configuration | 1.0.0 |
| [shared-product-dto](shared-product-dto/README.md) | Product-specific DTOs | 1.0.0 |

## 🛠️ Technology Stack

### Core Framework
- **Spring Boot**: 3.3.4
- **Java**: 17 (LTS)
- **Maven**: 3.8+ (Build tool)

### Security
- **Spring Security**: 6.x with OAuth2 Resource Server
- **JWT**: JSON Web Tokens for stateless authentication
- **Argon2**: Secure password hashing
- **CORS**: Cross-Origin Resource Sharing configuration

### Data Layer
- **Spring Data JPA**: Object-relational mapping
- **PostgreSQL**: Primary database (version 15)
- **Hibernate**: JPA implementation
- **Connection Pooling**: HikariCP (default)

### Messaging & Events
- **Apache Kafka**: Event streaming and service communication
- **Spring Kafka**: Kafka integration for Spring Boot

### Documentation & APIs
- **Spring HATEOAS**: Hypermedia-driven REST APIs
- **OpenAPI/Swagger**: API documentation (planned)

### Development & Testing
- **Spring Boot DevTools**: Development time tools
- **JUnit 5**: Unit testing framework
- **Spring Boot Test**: Integration testing
- **Testcontainers**: Integration testing with real databases

### Observability
- **Log4j2**: Centralized logging
- **Spring Boot Actuator**: Health checks and metrics
- **Micrometer**: Application metrics

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **Maven 3.8+**
- **PostgreSQL 15+**
- **Apache Kafka 7.0+**
- **Docker** (for containerized setup)

### Local Development Setup

1. **Clone and navigate to backend**
   ```bash
   git clone https://github.com/your-repo/TeIpsum.git
   cd TeIpsum/backend
   ```

2. **Start infrastructure services**
   ```bash
   # Using Docker Compose
   cd ../infra
   docker-compose -f docker-compose.stage-infra.yml up -d
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file for each service or set system environment variables
   export DB_URL="jdbc:postgresql://localhost:5432/teipsum"
   export DB_USER="teipsum_user"
   export DB_PASSWORD="your_password"
   export JWT_SECRET="your_jwt_secret"
   export SPRING_KAFKA_BOOTSTRAP_SERVERS="localhost:9092"
   ```

4. **Build all services**
   ```bash
   mvn clean install
   ```

5. **Start services individually**
   ```bash
   # Terminal 1 - Auth Service
   cd auth-service && mvn spring-boot:run
   
   # Terminal 2 - User Service  
   cd user-service && mvn spring-boot:run
   
   # Terminal 3 - Catalog Service
   cd catalog-service && mvn spring-boot:run
   
   # ... continue for other services
   ```

### Docker Development Setup

1. **Build Docker images**
   ```bash
   # Build all service images
   ./build-all-services.sh
   ```

2. **Start with Docker Compose**
   ```bash
   # Start all services
   docker-compose -f docker-compose.dev.yml up -d
   ```

## 🔧 Configuration

### Environment Variables

Each service requires the following environment variables:

#### Database Configuration
```bash
DB_URL=jdbc:postgresql://postgres:5432/teipsum_auth
DB_USER=teipsum_user
DB_PASSWORD=secure_password
```

#### Service-Specific Ports
```bash
SERVICE_SERVER_PORT=8081  # Auth Service
SERVICE_SERVER_PORT=8082  # User Service
SERVICE_SERVER_PORT=8083  # Catalog Service
# ... etc
```

#### Security Configuration
```bash
JWT_SECRET=your_256_bit_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ADMIN_SECRET=admin_secret
JWT_ADMIN_REFRESH_SECRET=admin_refresh_secret

# Argon2 Configuration
ARG_SALT_LENGTH=32
ARG_HASH_LENGTH=64
ARG_PARALLELISM=4
ARG_MEMORY=65536
ARG_ITERATIONS=3
```

#### Kafka Configuration
```bash
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9094
```

#### CORS Configuration
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80
```

### Database Schema

Each service manages its own database schema:

- **auth_service_db**: User authentication, roles, tokens
- **user_service_db**: User profiles, preferences
- **catalog_service_db**: Products, categories, attributes
- **order_service_db**: Orders, order items, payments
- **inventory_service_db**: Stock levels, warehouses
- **admin_product_service_db**: Product management, admin actions

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests for all services
mvn test

# Run tests for specific service
cd auth-service && mvn test
```

### Integration Tests
```bash
# Run integration tests with Testcontainers
mvn verify -P integration-tests
```

### API Testing
```bash
# Using curl to test endpoints
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"securepassword"}'
```

## 📊 Monitoring & Health Checks

### Health Endpoints
Each service exposes Spring Boot Actuator endpoints:

```bash
# Health check
curl http://localhost:8081/actuator/health

# Metrics
curl http://localhost:8081/actuator/metrics

# Info
curl http://localhost:8081/actuator/info
```

### Logging
Centralized logging configuration using Log4j2:

- **Console Output**: Development environment
- **File Output**: Production environment
- **Structured Logging**: JSON format for log aggregation
- **Log Levels**: Configurable per service and package

## 🔄 Service Communication

### Synchronous Communication
- **REST APIs**: HTTP/HTTPS for direct service-to-service calls
- **Service Discovery**: Planned (Eureka or Consul)
- **Load Balancing**: Nginx reverse proxy

### Asynchronous Communication
- **Apache Kafka**: Event-driven architecture
- **Event Topics**: 
  - `user-events`: User registration, profile updates
  - `order-events`: Order creation, status changes
  - `inventory-events`: Stock level changes
  - `product-events`: Product CRUD operations

### Message Patterns
- **Event Sourcing**: Order and inventory state changes
- **CQRS**: Separate read/write models for complex queries
- **Saga Pattern**: Distributed transaction management

## 🚀 Deployment

### Production Build
```bash
# Build production-ready JARs
mvn clean package -P production

# Build Docker images
docker build -t teipsum/auth-service:latest auth-service/
```

### Container Deployment
```bash
# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment
```yaml
# Example Kubernetes deployment (k8s manifests coming soon)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: teipsum/auth-service:latest
        ports:
        - containerPort: 8081
```

## 🔒 Security Best Practices

### Authentication & Authorization
- **JWT Tokens**: Short-lived access tokens with refresh tokens
- **Role-Based Access Control**: Admin and user roles
- **Password Security**: Argon2 hashing with secure parameters

### API Security
- **HTTPS**: All production endpoints use TLS
- **CORS**: Configured for specific origins only
- **Rate Limiting**: Planned (Spring Cloud Gateway)
- **Request Validation**: Bean validation annotations

### Data Security
- **Database Encryption**: Encrypted connections to PostgreSQL
- **Secrets Management**: Environment variables, Kubernetes secrets
- **Audit Logging**: All critical operations logged

## 📈 Performance Considerations

### Database Optimization
- **Connection Pooling**: HikariCP with optimized settings
- **Query Optimization**: JPA query optimization and indexing
- **Read Replicas**: Planned for high-read scenarios

### Caching Strategy
- **Application-Level Caching**: Planned (Redis/Hazelcast)
- **Database Query Caching**: Hibernate second-level cache
- **CDN**: Static asset caching

### Scalability
- **Horizontal Scaling**: Stateless services for easy scaling
- **Database Sharding**: Planned for large datasets
- **Event-Driven Architecture**: Asynchronous processing

## 🛠️ Development Guidelines

### Code Standards
- **Java Code Style**: Google Java Style Guide
- **Package Structure**: Domain-driven design principles
- **Error Handling**: Consistent exception handling across services
- **API Design**: RESTful principles with HATEOAS

### Git Workflow
- **Feature Branches**: Feature branch workflow
- **Code Reviews**: Required for all changes
- **CI/CD**: Automated testing and deployment

### Documentation
- **JavaDoc**: All public APIs documented
- **README**: Each service has detailed README
- **API Documentation**: OpenAPI/Swagger specifications

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch from `develop`
3. **Implement** your feature with tests
4. **Follow** code style guidelines
5. **Submit** a pull request

## 📚 Additional Resources

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Troubleshooting

### Common Issues

1. **Service Won't Start**
   - Check database connectivity
   - Verify environment variables
   - Check port availability

2. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check connection parameters
   - Verify database exists

3. **Kafka Connection Issues**
   - Verify Kafka and Zookeeper are running
   - Check bootstrap servers configuration
   - Verify topic creation

### Debug Mode
```bash
# Start service with debug logging
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dlogging.level.com.teipsum=DEBUG"
```

---

For service-specific documentation, please refer to individual service README files.