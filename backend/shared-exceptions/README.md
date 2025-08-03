# Shared Exceptions - TeIpsum E-Commerce Platform

## 🚨 Overview

The Shared Exceptions module provides common exception classes and error handling utilities used across all microservices in the TeIpsum platform. This ensures consistent error handling and messaging throughout the system.

## 🎯 Core Features

### 🔧 Common Exceptions
- **Business Logic Exceptions**: Domain-specific exceptions
- **Validation Exceptions**: Input validation errors
- **Security Exceptions**: Authentication and authorization errors
- **Service Exceptions**: Inter-service communication errors

### 📊 Error Response Standards
- **Consistent Error Messages**: Standardized error response format
- **Error Codes**: Unique error codes for different exception types
- **Localization Support**: Multi-language error messages
- **Stack Trace Handling**: Development vs production error details

## 🛠️ Technology Stack

- **Java**: 17 with modern exception handling
- **Spring Boot**: Integration with Spring error handling
- **Jakarta Validation**: Validation exception handling
- **Lombok**: Boilerplate code reduction

## 📁 Module Structure

```
shared-exceptions/
├── src/main/java/com/teipsum/shared/exceptions/
│   ├── business/
│   │   ├── ProductNotFoundException.java
│   │   ├── UserNotFoundException.java
│   │   ├── InsufficientStockException.java
│   │   └── OrderNotFoundException.java
│   ├── security/
│   │   ├── UnauthorizedException.java
│   │   ├── ForbiddenException.java
│   │   └── TokenExpiredException.java
│   ├── validation/
│   │   ├── ValidationException.java
│   │   ├── EmailExistsException.java
│   │   └── InvalidDataException.java
│   ├── service/
│   │   ├── ServiceUnavailableException.java
│   │   ├── ExternalServiceException.java
│   │   └── EventProcessingException.java
│   ├── base/
│   │   ├── BaseException.java
│   │   ├── BusinessException.java
│   │   └── TechnicalException.java
│   └── handler/
│       ├── GlobalExceptionHandler.java
│       └── ErrorResponseBuilder.java
└── pom.xml
```

## 🔧 Exception Categories

### Business Exceptions
```java
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProductNotFoundException extends BusinessException {
    public ProductNotFoundException(String productId) {
        super("PRODUCT_NOT_FOUND", "Product not found with ID: " + productId);
    }
}

@ResponseStatus(HttpStatus.CONFLICT) 
public class EmailExistsException extends BusinessException {
    public EmailExistsException(String email) {
        super("EMAIL_EXISTS", "User with email already exists: " + email);
    }
}
```

### Security Exceptions
```java
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends SecurityException {
    public UnauthorizedException(String message) {
        super("UNAUTHORIZED", message);
    }
}

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ForbiddenException extends SecurityException {
    public ForbiddenException(String resource) {
        super("FORBIDDEN", "Access denied to resource: " + resource);
    }
}
```

### Base Exception Structure
```java
@Getter
public abstract class BaseException extends RuntimeException {
    private final String errorCode;
    private final String message;
    private final LocalDateTime timestamp;
    private final Map<String, Object> details;

    protected BaseException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.details = new HashMap<>();
    }
}
```

## 🌐 Global Exception Handler

### Centralized Error Handling
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProductNotFound(ProductNotFoundException ex) {
        ErrorResponse error = ErrorResponseBuilder.build(ex);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        ErrorResponse error = ErrorResponseBuilder.build(ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        ErrorResponse error = ErrorResponseBuilder.build(ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}
```

### Error Response Format
```java
public record ErrorResponse(
    String errorCode,
    String message,
    LocalDateTime timestamp,
    String path,
    Map<String, Object> details
) {}
```

## 📚 Available Exceptions

### Business Domain
- `ProductNotFoundException` - Product not found
- `UserNotFoundException` - User not found
- `OrderNotFoundException` - Order not found
- `InsufficientStockException` - Not enough inventory
- `PaymentFailedException` - Payment processing failed

### Validation
- `ValidationException` - Generic validation error
- `EmailExistsException` - Duplicate email address
- `InvalidDataException` - Invalid input data
- `RequiredFieldException` - Missing required field

### Security
- `UnauthorizedException` - Authentication required
- `ForbiddenException` - Insufficient permissions
- `TokenExpiredException` - JWT token expired
- `InvalidTokenException` - Invalid JWT token

### Service Communication
- `ServiceUnavailableException` - External service down
- `ExternalServiceException` - External API error
- `EventProcessingException` - Kafka event processing error

## 🔧 Integration

### Maven Dependency
```xml
<dependency>
    <groupId>com.teipsum</groupId>
    <artifactId>teipsum-shared-exceptions</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Usage in Services
```java
import com.teipsum.shared.exceptions.ProductNotFoundException;
import com.teipsum.shared.exceptions.handler.GlobalExceptionHandler;

@Service
public class ProductService {
    
    public Product findById(String id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));
    }
}

@RestController
public class ProductController extends GlobalExceptionHandler {
    // Inherits exception handling
}
```

## 🌍 Localization Support

### Message Properties
```properties
# messages_en.properties
PRODUCT_NOT_FOUND=Product not found with ID: {0}
EMAIL_EXISTS=User with email already exists: {0}
UNAUTHORIZED=Authentication required to access this resource

# messages_de.properties  
PRODUCT_NOT_FOUND=Produkt mit ID nicht gefunden: {0}
EMAIL_EXISTS=Benutzer mit E-Mail existiert bereits: {0}
UNAUTHORIZED=Authentifizierung erforderlich für den Zugriff auf diese Ressource
```

### Localized Exception
```java
public class LocalizedProductNotFoundException extends BusinessException {
    public LocalizedProductNotFoundException(String productId, Locale locale) {
        super("PRODUCT_NOT_FOUND", 
              messageSource.getMessage("PRODUCT_NOT_FOUND", 
                                     new Object[]{productId}, locale));
    }
}
```

## 🧪 Testing Support

### Exception Testing Utilities
```java
public class ExceptionTestUtils {
    
    public static void assertBusinessException(Class<? extends BusinessException> expectedType,
                                              String expectedCode,
                                              Executable executable) {
        BusinessException exception = assertThrows(expectedType, executable);
        assertEquals(expectedCode, exception.getErrorCode());
    }
}
```

---

**Shared Exception Handling for TeIpsum Platform** 🚨