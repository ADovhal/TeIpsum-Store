# Shared DTO - TeIpsum E-Commerce Platform

## 📦 Overview

The Shared DTO module contains common Data Transfer Objects (DTOs) used across multiple microservices in the TeIpsum platform. This module promotes code reuse and ensures consistent data structures across services.

## 🎯 Core Features

### 🔄 Common Data Structures
- **User DTOs**: User registration, login, and profile data
- **Response DTOs**: Standardized API response formats
- **Event DTOs**: Common event structures for Kafka messaging
- **Validation DTOs**: Shared validation annotations and constraints

### 📡 Event Definitions
- **User Events**: Registration and login event structures
- **System Events**: Common system-wide event definitions
- **Error Events**: Standardized error event formats

## 🛠️ Technology Stack

- **Java**: 17 with records and modern language features
- **Jakarta Validation**: Bean validation annotations
- **Jackson**: JSON serialization/deserialization
- **Lombok**: Code generation for data classes

## 📁 Module Structure

```
shared-dto/
├── src/main/java/com/teipsum/shared/
│   ├── dto/
│   │   ├── user/
│   │   │   ├── UserRegistrationDto.java
│   │   │   ├── UserLoginDto.java
│   │   │   └── UserProfileDto.java
│   │   ├── response/
│   │   │   ├── ApiResponse.java
│   │   │   ├── ErrorResponse.java
│   │   │   └── PagedResponse.java
│   │   └── validation/
│   │       ├── ValidationConstants.java
│   │       └── CustomValidations.java
│   └── event/
│       ├── UserRegisteredEvent.java
│       ├── UserLoggedInEvent.java
│       └── BaseEvent.java
└── pom.xml
```

## 🔧 Usage Examples

### User Registration DTO
```java
public record UserRegistrationDto(
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password,
    @NotBlank String name,
    @NotBlank String surname,
    @Pattern(regexp = "\\+?[1-9]\\d{1,14}") String phone,
    @Past LocalDate dateOfBirth
) {}
```

### API Response DTO
```java
public record ApiResponse<T>(
    boolean success,
    String message,
    T data,
    LocalDateTime timestamp
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data, LocalDateTime.now());
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now());
    }
}
```

### Event Structure
```java
public record UserRegisteredEvent(
    String userId,
    String email,
    String name,
    String surname,
    String phone,
    LocalDate dateOfBirth,
    Boolean isAdmin,
    LocalDateTime timestamp
) implements BaseEvent {}
```

## 📚 Available DTOs

### User Management
- `UserRegistrationDto` - User registration data
- `UserLoginDto` - User login credentials
- `UserProfileDto` - User profile information

### API Responses
- `ApiResponse<T>` - Generic API response wrapper
- `ErrorResponse` - Error response with details
- `PagedResponse<T>` - Paginated response wrapper

### Events
- `UserRegisteredEvent` - User registration event
- `UserLoggedInEvent` - User login event
- `BaseEvent` - Common event interface

## 🔧 Integration

### Maven Dependency
```xml
<dependency>
    <groupId>com.teipsum</groupId>
    <artifactId>teipsum-shared-dto</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Usage in Services
```java
// In any microservice
import com.teipsum.shared.dto.user.UserRegistrationDto;
import com.teipsum.shared.event.UserRegisteredEvent;

@RestController
public class UserController {
    
    @PostMapping("/register")
    public ApiResponse<String> register(@Valid @RequestBody UserRegistrationDto dto) {
        // Registration logic
        return ApiResponse.success("User registered successfully");
    }
}
```

---

**Shared Data Transfer Objects for TeIpsum Platform** 📦