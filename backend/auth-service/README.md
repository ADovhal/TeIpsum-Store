# Auth Service - TeIpsum E-Commerce Platform

## 🔐 Overview

The Auth Service is a critical microservice responsible for authentication, authorization, and user credential management in the TeIpsum e-commerce platform. It provides secure JWT-based authentication with role-based access control, supporting both regular users and administrators.

## 🎯 Core Features

### 🔑 Authentication
- **User Registration**: Secure user account creation with email validation
- **User Login**: JWT-based authentication with access and refresh tokens
- **Admin Registration**: Protected admin account creation (admin-only)
- **Token Management**: Separate token handling for users and admins
- **Logout Support**: Token invalidation and cleanup

### 🛡️ Security Features
- **Password Security**: Argon2 hashing with configurable parameters
- **JWT Tokens**: Stateless authentication with RS256 signing
- **Refresh Tokens**: Long-lived tokens for seamless re-authentication
- **Role-Based Access Control**: User and admin role separation
- **CORS Protection**: Configurable cross-origin request handling

### 📡 Event-Driven Architecture
- **User Registration Events**: Kafka events for user service integration
- **Login Events**: User activity tracking
- **Admin Activity Events**: Administrative action logging

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │   Repositories  │
│                 │    │                 │    │                 │
│ AuthController  │───►│  AuthService    │───►│UserCredentials  │
│                 │    │CustomUserDetails│    │RoleRepository   │
│                 │    │   Service       │    │AdminRepository  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │   Security Layer    │
                    │                     │
                    │   JwtUtil          │
                    │   SecurityConfig   │
                    │   CustomUserDetails │
                    └─────────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │  External Services  │
                    │                     │
                    │  PostgreSQL DB     │
                    │  Apache Kafka      │
                    └─────────────────────┘
```

## 🛠️ Technology Stack

### Core Framework
- **Spring Boot**: 3.3.4 with auto-configuration
- **Spring Security**: 6.x with OAuth2 Resource Server
- **Spring Data JPA**: Database abstraction layer

### Security & Authentication
- **JWT (JSON Web Tokens)**: Auth0 Java JWT library (4.4.0)
- **Argon2**: Password hashing (de.mkammerer argon2-jvm 2.11)
- **BouncyCastle**: Cryptographic operations (1.77)
- **Nimbus JOSE**: JWT processing (9.31)

### Database & Messaging
- **PostgreSQL**: Primary database with JPA/Hibernate
- **Apache Kafka**: Event streaming for service communication

### Development & Testing
- **Lombok**: Boilerplate code reduction
- **Spring Boot DevTools**: Development-time enhancements
- **JUnit 5**: Unit and integration testing

## 📁 Project Structure

```
auth-service/
├── src/main/java/com/teipsum/authservice/
│   ├── AuthServiceApplication.java    # Main application class
│   ├── controllers/
│   │   └── AuthController.java        # REST endpoints
│   ├── service/
│   │   ├── AuthService.java           # Core authentication logic
│   │   └── CustomUserDetailsService.java # User details loading
│   ├── security/
│   │   ├── JwtUtil.java              # JWT token utilities
│   │   ├── SecurityConfig.java       # Security configuration
│   │   ├── CustomUserDetails.java    # User details implementation
│   │   └── SecurityContextService.java # Security context utils
│   ├── model/
│   │   ├── UserCredentials.java      # User entity
│   │   ├── Role.java                 # Role entity
│   │   ├── Admin.java                # Admin entity
│   │   ├── RoleName.java             # Role enumeration
│   │   └── TokenType.java            # Token type enumeration
│   ├── dto/
│   │   ├── AuthRequest.java          # Login request DTO
│   │   ├── RegisterRequest.java      # Registration request DTO
│   │   └── AuthResponse.java         # Authentication response DTO
│   ├── repository/
│   │   ├── UserCredentialsRepository.java
│   │   ├── RoleRepository.java
│   │   └── AdminRepository.java
│   ├── config/
│   │   ├── SecurityConfig.java       # Security configuration
│   │   ├── KafkaConfig.java          # Kafka configuration
│   │   └── PasswordConfig.java       # Password encoder config
│   └── init/
│       └── DataInitializer.java      # Initial data setup
├── src/main/resources/
│   ├── application.properties        # Configuration
│   └── log4j2.xml                   # Logging configuration
├── pom.xml                          # Maven dependencies
└── Dockerfile                       # Container configuration
```

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
SERVICE_SERVER_PORT=8081

# Database Configuration
DB_URL=jdbc:postgresql://postgres:5432/teipsum_auth
DB_USER=teipsum_user
DB_PASSWORD=secure_password

# JWT Configuration
JWT_SECRET=your_256_bit_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ADMIN_SECRET=admin_secret_key
JWT_ADMIN_REFRESH_SECRET=admin_refresh_secret

# Argon2 Password Hashing Configuration
ARG_SALT_LENGTH=32
ARG_HASH_LENGTH=64
ARG_PARALLELISM=4
ARG_MEMORY=65536
ARG_ITERATIONS=3

# Kafka Configuration
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9094

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Application Properties

```properties
# Database Settings
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Settings
jwt.expiration=3600  # 1 hour in seconds

# Logging Configuration
logging.level.com.teipsum.authservice=debug
logging.level.org.springframework.security=warn
```

## 🚀 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/refresh` | Refresh access token | Refresh Token |
| POST | `/api/auth/logout` | User logout | Access Token |
| POST | `/api/auth/register_admin` | Register admin user | Admin Token |

### Example API Usage

#### User Registration
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123",
    "name": "John",
    "surname": "Doe"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### User Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

#### Admin Registration (Requires Admin Token)
```bash
curl -X POST http://localhost:8081/api/auth/register_admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_access_token" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPassword123",
    "name": "Admin",
    "surname": "User"
  }'
```

## 🔐 Security Implementation

### Password Security
```java
// Argon2 Configuration
@Configuration
public class PasswordConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Argon2PasswordEncoder(
            saltLength,    // 32 bytes
            hashLength,    // 64 bytes  
            parallelism,   // 4 threads
            memory,        // 65536 KB
            iterations     // 3 iterations
        );
    }
}
```

### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com", 
  "roles": ["ROLE_USER"],
  "type": "ACCESS",
  "iat": 1640995200,
  "exp": 1640998800
}
```

### Role-Based Access Control
```java
@PreAuthorize("hasRole('ADMIN')")
public AuthResponse registerAdmin(RegisterRequest request) {
    // Admin-only functionality
}

@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public UserProfile getUserProfile() {
    // User or admin access
}
```

## 📊 Database Schema

### User Credentials Table
```sql
CREATE TABLE user_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Roles Table
```sql
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');
```

### User Roles Junction Table
```sql
CREATE TABLE user_roles (
    user_id UUID REFERENCES user_credentials(id),
    role_id BIGINT REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);
```

### Admin Table
```sql
CREATE TABLE admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES user_credentials(id),
    created_by UUID REFERENCES user_credentials(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📡 Event Publishing

### Kafka Events
The service publishes events to notify other services of important actions:

#### User Registration Event
```java
@Component
public class UserEventPublisher {
    public void publishUserRegistered(UserCredentials user, RegisterRequest request) {
        UserRegisteredEvent event = new UserRegisteredEvent(
            user.getId(),
            request.email(),
            request.name(),
            request.surname(),
            LocalDateTime.now()
        );
        kafkaTemplate.send("user-events", event);
    }
}
```

#### User Login Event
```java
public void publishUserLogin(String email) {
    UserLoggedInEvent event = new UserLoggedInEvent(
        email,
        LocalDateTime.now()
    );
    kafkaTemplate.send("user-login", event);
}
```

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **Maven 3.8+**
- **PostgreSQL 15+**
- **Apache Kafka**

### Local Development

1. **Set up database**
   ```sql
   CREATE DATABASE teipsum_auth;
   CREATE USER teipsum_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE teipsum_auth TO teipsum_user;
   ```

2. **Set environment variables**
   ```bash
   export DB_URL="jdbc:postgresql://localhost:5432/teipsum_auth"
   export DB_USER="teipsum_user"
   export DB_PASSWORD="your_password"
   export JWT_SECRET="your_256_bit_secret"
   export JWT_REFRESH_SECRET="your_refresh_secret"
   export SPRING_KAFKA_BOOTSTRAP_SERVERS="localhost:9092"
   ```

3. **Run the service**
   ```bash
   cd auth-service
   mvn spring-boot:run
   ```

4. **Verify service is running**
   ```bash
   curl http://localhost:8081/actuator/health
   ```

### Docker Development

1. **Build Docker image**
   ```bash
   docker build -t teipsum/auth-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report
```

### Integration Tests
```bash
# Run integration tests
mvn verify -P integration-tests
```

### Manual API Testing
```bash
# Test user registration
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'

# Test login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

## 📊 Monitoring & Health Checks

### Health Endpoints
```bash
# Service health
curl http://localhost:8081/actuator/health

# Database health
curl http://localhost:8081/actuator/health/db

# Application info
curl http://localhost:8081/actuator/info
```

### Metrics
```bash
# JWT token metrics
curl http://localhost:8081/actuator/metrics/jwt.token.created

# Authentication metrics  
curl http://localhost:8081/actuator/metrics/auth.login.success
curl http://localhost:8081/actuator/metrics/auth.login.failure
```

## 🔧 Configuration Management

### Production Configuration
```properties
# Production database settings
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5

# JWT production settings
jwt.expiration=900  # 15 minutes for production

# Security headers
security.headers.frame-options=DENY
security.headers.content-type-options=nosniff
```

### Development Configuration
```properties
# Development logging
logging.level.org.springframework.security=DEBUG
logging.level.com.teipsum.authservice=DEBUG

# Development JWT settings
jwt.expiration=3600  # 1 hour for development
```

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] JWT secrets generated securely
- [ ] Kafka topics created
- [ ] Monitoring configured
- [ ] Health checks enabled
- [ ] HTTPS configured

### Container Deployment
```bash
# Build production image
docker build -t teipsum/auth-service:v1.0.0 .

# Deploy to production
docker run -d \
  --name auth-service \
  -p 8081:8081 \
  --env-file .env.prod \
  teipsum/auth-service:v1.0.0
```

## 🛡️ Security Best Practices

### Password Security
- Argon2 with memory-hard parameters
- Configurable salt length and iterations
- Regular security parameter updates

### JWT Security
- Short-lived access tokens (15 minutes production)
- Secure refresh token rotation
- Separate secrets for admin tokens

### Database Security
- Encrypted connections only
- Prepared statements for SQL injection prevention
- Regular credential rotation

## 🔍 Troubleshooting

### Common Issues

1. **JWT Token Invalid**
   - Check token expiration
   - Verify JWT secret configuration
   - Ensure proper token format

2. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check connection parameters
   - Validate user permissions

3. **Kafka Connection Issues**
   - Verify Kafka bootstrap servers
   - Check topic existence
   - Validate Kafka connectivity

### Debug Commands
```bash
# Check JWT token details
echo "token_here" | base64 -d

# Verify database connection
psql -h localhost -U teipsum_user -d teipsum_auth

# Check Kafka topics
kafka-topics --bootstrap-server localhost:9092 --list
```

## 📚 Additional Resources

- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/)
- [JWT.io](https://jwt.io/) - JWT debugging tool
- [Argon2 Password Hashing](https://en.wikipedia.org/wiki/Argon2)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)

## 🤝 Contributing

1. Follow Spring Boot best practices
2. Maintain comprehensive test coverage
3. Document all public APIs
4. Follow security guidelines
5. Update README for new features

---

**Secure Authentication for TeIpsum E-Commerce Platform** 🔐