# User Service - TeIpsum E-Commerce Platform

## 👤 Overview

The User Service is responsible for managing user profile information and handling user-related operations in the TeIpsum e-commerce platform. It works in conjunction with the Auth Service to provide complete user management functionality, listening to authentication events and maintaining detailed user profiles.

## 🎯 Core Features

### 👥 User Profile Management
- **Profile Creation**: Automatic profile creation from auth events
- **Profile Retrieval**: Get user profiles by ID or email
- **Profile Updates**: Update user information and preferences
- **Profile Deletion**: Remove user profiles with data cleanup

### 📡 Event-Driven Integration
- **User Registration Events**: Listen to auth service registration events
- **Login Tracking**: Update last login timestamps from auth events
- **Profile Synchronization**: Keep profile data in sync with auth service

### 🔐 Security & Access Control
- **JWT Integration**: OAuth2 resource server with JWT validation
- **Role-based Access**: Support for user and admin role verification
- **Secure Endpoints**: Protected API endpoints with authentication

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │   Repositories  │
│                 │    │                 │    │                 │
│ UserController  │───►│  UserService    │───►│ UserRepository  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │   Event Listeners   │
                    │                     │
                    │ UserEventListener   │
                    │  - Registration     │
                    │  - Login Events     │
                    └─────────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │  External Services  │
                    │                     │
                    │  PostgreSQL DB     │
                    │  Apache Kafka      │
                    │  Auth Service      │
                    └─────────────────────┘
```

## 🛠️ Technology Stack

### Core Framework
- **Spring Boot**: 3.3.4 with auto-configuration
- **Spring Security**: OAuth2 Resource Server with JWT
- **Spring Data JPA**: Database abstraction layer

### Event Processing
- **Apache Kafka**: Event streaming for service communication
- **Spring Kafka**: Kafka integration with message listeners

### Database
- **PostgreSQL**: Primary database with JPA/Hibernate
- **HikariCP**: Connection pooling for performance

### Development & Testing
- **Lombok**: Boilerplate code reduction
- **Spring Boot DevTools**: Development-time enhancements
- **JUnit 5**: Unit and integration testing

## 📁 Project Structure

```
user-service/
├── src/main/java/com/teipsum/userservice/
│   ├── UserServiceApplication.java    # Main application class
│   ├── controller/
│   │   └── UserController.java        # REST endpoints
│   ├── service/
│   │   └── UserService.java           # Core business logic
│   ├── model/
│   │   └── UserProfile.java           # User profile entity
│   ├── repository/
│   │   └── UserRepository.java        # Data access layer
│   ├── event/
│   │   └── UserEventListener.java     # Kafka event handlers
│   ├── config/
│   │   ├── SecurityConfig.java        # Security configuration
│   │   └── KafkaConfig.java           # Kafka configuration
│   └── dto/
│       └── UserProfileDto.java        # Data transfer objects
├── src/main/resources/
│   ├── application.yml                # Configuration
│   └── log4j2.xml                    # Logging configuration
├── pom.xml                           # Maven dependencies
└── Dockerfile                        # Container configuration
```

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
SERVICE_SERVER_PORT=8082

# Database Configuration
DB_URL=jdbc:postgresql://postgres:5432/teipsum_user
DB_USER=teipsum_user
DB_PASSWORD=secure_password

# JWT Configuration
JWT_SECRET=your_user_access_secret
JWT_ADMIN_SECRET=your_admin_access_secret

# Kafka Configuration
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9094

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Application Configuration

```yaml
# Database Connection Pool
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000

# Kafka Consumer Configuration
  kafka:
    consumer:
      group-id: user-service-group
      auto-offset-reset: earliest
      properties:
        spring.json.trusted.packages: "com.teipsum.shared.event"

# Logging Configuration
logging:
  level:
    com.teipsum.userservice: debug
    org.springframework.security: info
```

## 🚀 API Endpoints

### User Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get current user profile | User Token |
| GET | `/api/users/{userId}` | Get user profile by ID | User/Admin Token |
| PUT | `/api/users/profile` | Update current user profile | User Token |
| DELETE | `/api/users/{userId}` | Delete user profile | Admin Token |

### Example API Usage

#### Get Current User Profile
```bash
curl -X GET http://localhost:8082/api/users/profile \
  -H "Authorization: Bearer access_token"
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John",
  "fullName": "John Doe",
  "joinDate": "2024-01-15"
}
```

#### Get User Profile by ID
```bash
curl -X GET http://localhost:8082/api/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer access_token"
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John",
  "email": "user@example.com",
  "phone": "+1234567890"
}
```

#### Update User Profile
```bash
curl -X PUT http://localhost:8082/api/users/profile \
  -H "Authorization: Bearer access_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "surname": "Doe",
    "phone": "+1234567890"
  }'
```

## 👤 User Profile Model

### UserProfile Entity
```java
@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    private String id;              // UUID from auth service
    
    @Column(nullable = false)
    private String name;            // First name
    
    @Column(nullable = false)  
    private String surname;         // Last name
    
    @Column(unique = true, nullable = false)
    private String email;           // Email address
    
    @Column(nullable = false)
    private String phone;           // Phone number
    
    @Column(nullable = false)
    private LocalDate dob;          // Date of birth
    
    @Column
    private Boolean isAdmin;        // Admin flag
    
    @Column(nullable = false, updatable = false)
    private LocalDate joinDate;     // Registration date
    
    @Column(nullable = false)
    private LocalDateTime lastLoginDate; // Last login timestamp
}
```

## 📊 Database Schema

### User Profiles Table
```sql
CREATE TABLE user_profiles (
    id VARCHAR(36) PRIMARY KEY,     -- UUID from auth service
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_login_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_join_date ON user_profiles(join_date);
CREATE INDEX idx_user_profiles_is_admin ON user_profiles(is_admin);
```

## 📡 Event Processing

### Kafka Event Listeners

The service listens to events from the auth service to maintain profile synchronization:

#### User Registration Event Handler
```java
@KafkaListener(
    topics = "user-registered",
    groupId = "user-service-group"
)
public void handleUserRegistration(UserRegisteredEvent event) {
    userService.createUserProfile(
        event.userId(),
        event.email(),
        event.name(),
        event.surname(),
        event.phone(),
        event.dob(),
        event.isAdmin()
    );
}
```

#### User Login Event Handler
```java
@KafkaListener(
    topics = "user-login", 
    groupId = "user-service-group"
)
public void handleUserLogin(UserLoggedInEvent event) {
    userService.updateLastLogin(
        event.email(),
        event.timestamp()
    );
}
```

### Event Data Models

#### UserRegisteredEvent
```java
public record UserRegisteredEvent(
    String userId,
    String email,
    String name,
    String surname,
    String phone,
    LocalDate dob,
    Boolean isAdmin,
    LocalDateTime timestamp
) {}
```

#### UserLoggedInEvent
```java
public record UserLoggedInEvent(
    String email,
    LocalDateTime timestamp
) {}
```

## 🔐 Security Implementation

### JWT Token Validation
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/profile").hasRole("USER")
                .requestMatchers("/api/users/{userId}").hasAnyRole("USER", "ADMIN")
                .requestMatchers(DELETE, "/api/users/{userId}").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtDecoder(jwtDecoder()))
            )
            .build();
    }
}
```

### User Context Access
```java
@Service
public class UserService {
    
    public UserProfile getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String email = auth.getName();
            return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
        }
        return null;
    }
}
```

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **Maven 3.8+**
- **PostgreSQL 15+**
- **Apache Kafka**
- **Auth Service** (for JWT validation)

### Local Development

1. **Set up database**
   ```sql
   CREATE DATABASE teipsum_user;
   CREATE USER teipsum_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE teipsum_user TO teipsum_user;
   ```

2. **Set environment variables**
   ```bash
   export DB_URL="jdbc:postgresql://localhost:5432/teipsum_user"
   export DB_USER="teipsum_user"
   export DB_PASSWORD="your_password"
   export JWT_SECRET="your_jwt_secret"
   export JWT_ADMIN_SECRET="your_admin_secret"
   export SPRING_KAFKA_BOOTSTRAP_SERVERS="localhost:9092"
   ```

3. **Run the service**
   ```bash
   cd user-service
   mvn spring-boot:run
   ```

4. **Verify service is running**
   ```bash
   curl http://localhost:8082/actuator/health
   ```

### Docker Development

1. **Build Docker image**
   ```bash
   docker build -t teipsum/user-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose -f docker-compose.stage-user-service.yml up -d
   ```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn test jacoco:report
```

### Integration Tests
```bash
# Run integration tests with Testcontainers
mvn verify -P integration-tests
```

### Manual API Testing
```bash
# Test with valid JWT token (get token from auth service first)
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  | jq -r '.accessToken')

# Test get profile
curl -X GET http://localhost:8082/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Service Integration

### Integration with Auth Service
The user service depends on the auth service for:
- **JWT Token Validation**: Validates tokens issued by auth service
- **User Registration Events**: Creates profiles when users register
- **Login Events**: Updates login timestamps

### Integration Flow
```
Auth Service                User Service
     │                          │
     │ 1. User registers         │
     ├──────────────────────────►│
     │                          │ 2. Create profile
     │                          │
     │ 3. User logs in           │
     ├──────────────────────────►│
     │                          │ 4. Update last login
     │                          │
     │ 5. API call with JWT      │
     │                          ├── 6. Validate JWT
     │                          │
     │                          │ 7. Return user data
```

## 📊 Monitoring & Health Checks

### Health Endpoints
```bash
# Service health
curl http://localhost:8082/actuator/health

# Database health  
curl http://localhost:8082/actuator/health/db

# Kafka health
curl http://localhost:8082/actuator/health/kafka
```

### Custom Metrics
```bash
# User profile metrics
curl http://localhost:8082/actuator/metrics/user.profiles.total
curl http://localhost:8082/actuator/metrics/user.profiles.created
curl http://localhost:8082/actuator/metrics/user.login.updates
```

### Logging
```bash
# View application logs
docker logs user-service

# Follow logs in real-time
docker logs -f user-service
```

## 🚀 Deployment

### Production Configuration
```yaml
# Production database pool settings
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 10
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

# Production Kafka settings
  kafka:
    consumer:
      enable-auto-commit: false
      session-timeout-ms: 30000
      heartbeat-interval-ms: 10000
```

### Container Deployment
```bash
# Build production image
docker build -t teipsum/user-service:v1.0.0 .

# Deploy to production
docker run -d \
  --name user-service \
  -p 8082:8082 \
  --env-file .env.prod \
  --network teipsum-network \
  teipsum/user-service:v1.0.0
```

### Health Check Configuration
```yaml
# Docker Compose health check
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8082/actuator/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## 🔍 Troubleshooting

### Common Issues

1. **Profile Not Found**
   - Verify user registration event was processed
   - Check Kafka topic connectivity
   - Verify user ID matches auth service

2. **JWT Validation Failed**
   - Check JWT secret configuration
   - Verify auth service connectivity
   - Validate token format and expiration

3. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check connection pool settings
   - Validate database credentials

4. **Kafka Consumer Issues**
   - Check Kafka broker connectivity
   - Verify topic creation
   - Check consumer group configuration

### Debug Commands
```bash
# Check user profile in database
psql -h localhost -U teipsum_user -d teipsum_user \
  -c "SELECT * FROM user_profiles WHERE email = 'user@example.com';"

# Check Kafka consumer group
kafka-consumer-groups --bootstrap-server localhost:9092 \
  --group user-service-group --describe

# View service logs with debug level
docker logs user-service 2>&1 | grep DEBUG
```

## 📈 Performance Optimization

### Database Optimization
- **Connection Pooling**: Optimized HikariCP settings
- **Query Optimization**: Efficient JPA queries with proper indexing
- **Read Replicas**: Planned for high-read scenarios

### Caching Strategy
- **Profile Caching**: Cache frequently accessed profiles
- **Query Result Caching**: Cache common query results
- **Distributed Caching**: Redis integration planned

### Event Processing Optimization
- **Batch Processing**: Process multiple events in batches
- **Async Processing**: Non-blocking event handling
- **Error Handling**: Retry mechanisms for failed events

## 📚 Additional Resources

- [Spring Data JPA Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/)
- [Spring Kafka Documentation](https://docs.spring.io/spring-kafka/docs/current/reference/)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)

## 🤝 Contributing

1. Follow Spring Boot best practices
2. Maintain comprehensive test coverage
3. Document all public APIs
4. Handle events gracefully with proper error handling
5. Update README for new features

---

**User Profile Management for TeIpsum E-Commerce Platform** 👤