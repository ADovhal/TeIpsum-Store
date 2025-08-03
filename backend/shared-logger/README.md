# Shared Logger - TeIpsum E-Commerce Platform

## 📝 Overview

The Shared Logger module provides centralized logging configuration and utilities for all microservices in the TeIpsum platform. It ensures consistent logging format, levels, and output across the entire system.

## 🎯 Core Features

### 📊 Standardized Logging
- **Consistent Format**: Unified log format across all services
- **Service Identification**: Automatic service name inclusion in logs
- **Correlation IDs**: Request tracking across microservices
- **Performance Metrics**: Built-in performance logging

### 🔧 Log4j2 Configuration
- **Structured Logging**: JSON format for log aggregation
- **Multiple Appenders**: Console, file, and external system outputs
- **Async Logging**: High-performance asynchronous logging
- **Rolling File Policies**: Automatic log file rotation

### 🎚️ Dynamic Log Levels
- **Runtime Configuration**: Change log levels without restart
- **Service-Specific Levels**: Different log levels per service
- **Package-Level Control**: Fine-grained logging control
- **Environment-Aware**: Different configs for dev/staging/prod

## 🛠️ Technology Stack

- **Log4j2**: Advanced logging framework
- **Jackson**: JSON log formatting
- **Spring Boot**: Integration with Spring logging
- **SLF4J**: Logging facade for compatibility

## 📁 Module Structure

```
shared-logger/
├── src/main/resources/
│   ├── log4j2.xml                      # Default Log4j2 configuration
│   ├── log4j2-dev.xml                  # Development configuration
│   ├── log4j2-prod.xml                 # Production configuration
│   └── logback-spring.xml               # Spring Boot integration
└── pom.xml
```

## 🔧 Configuration Files

### Production Log4j2 Configuration
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN" packages="com.teipsum.shared.logger">
    <Properties>
        <Property name="SERVICE_NAME">${sys:logging.system.service.name:-teipsum-service}</Property>
        <Property name="LOG_PATTERN">
            %d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level [${SERVICE_NAME}] %logger{36} - %msg%n
        </Property>
        <Property name="JSON_PATTERN">
            {"timestamp":"%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ}","level":"%level","service":"${SERVICE_NAME}","thread":"%t","logger":"%logger","message":"%msg","exception":"%ex"}%n
        </Property>
    </Properties>

    <Appenders>
        <!-- Console Appender for Development -->
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="${LOG_PATTERN}"/>
        </Console>

        <!-- JSON File Appender for Production -->
        <RollingFile name="JsonFile" fileName="logs/${SERVICE_NAME}.json" 
                     filePattern="logs/${SERVICE_NAME}-%d{yyyy-MM-dd}-%i.json.gz">
            <PatternLayout pattern="${JSON_PATTERN}"/>
            <Policies>
                <TimeBasedTriggeringPolicy />
                <SizeBasedTriggeringPolicy size="100MB"/>
            </Policies>
            <DefaultRolloverStrategy max="30"/>
        </RollingFile>

        <!-- Async Appender for Performance -->
        <AsyncAppender name="AsyncFile">
            <AppenderRef ref="JsonFile"/>
            <BufferSize>8192</BufferSize>
            <IncludeLocation>false</IncludeLocation>
        </AsyncAppender>
    </Appenders>

    <Loggers>
        <!-- Service-specific loggers -->
        <Logger name="com.teipsum.authservice" level="INFO" additivity="false">
            <AppenderRef ref="AsyncFile"/>
            <AppenderRef ref="Console"/>
        </Logger>

        <Logger name="com.teipsum.userservice" level="INFO" additivity="false">
            <AppenderRef ref="AsyncFile"/>
            <AppenderRef ref="Console"/>
        </Logger>

        <!-- Security logging -->
        <Logger name="SECURITY" level="WARN" additivity="false">
            <AppenderRef ref="AsyncFile"/>
        </Logger>

        <!-- JWT logging -->
        <Logger name="JWT" level="WARN" additivity="false">
            <AppenderRef ref="AsyncFile"/>
        </Logger>

        <!-- External libraries -->
        <Logger name="org.springframework" level="WARN"/>
        <Logger name="org.hibernate" level="WARN"/>
        <Logger name="org.apache.kafka" level="INFO"/>

        <Root level="INFO">
            <AppenderRef ref="AsyncFile"/>
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>
```

### Development Configuration
```xml
<!-- Simplified development configuration -->
<Configuration status="WARN">
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
    </Appenders>

    <Loggers>
        <!-- More verbose logging for development -->
        <Logger name="com.teipsum" level="DEBUG"/>
        <Logger name="org.springframework.security" level="DEBUG"/>
        
        <Root level="INFO">
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>
```

## 📊 Log Formats

### JSON Structured Logging (Production)
```json
{
  "timestamp": "2024-01-15T10:30:45.123+0000",
  "level": "INFO",
  "service": "auth-service",
  "thread": "http-nio-8081-exec-1",
  "logger": "com.teipsum.authservice.service.AuthService",
  "message": "User registered successfully with email: user@example.com",
  "correlationId": "abc123-def456-ghi789",
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Human-Readable Format (Development)
```
10:30:45.123 [http-nio-8081-exec-1] INFO  c.t.a.service.AuthService - User registered successfully with email: user@example.com
```

## 🔧 Usage Examples

### Basic Logging
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    public AuthResponse login(String email) {
        // Add correlation ID for request tracking
        MDC.put("correlationId", UUID.randomUUID().toString());
        MDC.put("userEmail", email);
        
        logger.info("Login attempt for user: {}", email);
        
        try {
            // Login logic
            logger.info("Login successful for user: {}", email);
            return authResponse;
        } catch (Exception e) {
            logger.error("Login failed for user: {}", email, e);
            throw e;
        } finally {
            // Clear MDC to prevent memory leaks
            MDC.clear();
        }
    }
}
```

### Performance Logging
```java
@Component
public class PerformanceLogger {
    private static final Logger perfLogger = LoggerFactory.getLogger("PERFORMANCE");
    
    public void logMethodExecution(String methodName, long executionTime) {
        if (executionTime > 1000) { // Log slow operations
            perfLogger.warn("Slow operation detected: {} took {}ms", methodName, executionTime);
        } else {
            perfLogger.debug("Method {} executed in {}ms", methodName, executionTime);
        }
    }
}
```

### Security Logging
```java
@Component
public class SecurityLogger {
    private static final Logger securityLogger = LoggerFactory.getLogger("SECURITY");
    
    public void logAuthenticationFailure(String email, String reason) {
        securityLogger.warn("Authentication failed for user: {} - Reason: {}", email, reason);
    }
    
    public void logUnauthorizedAccess(String resource, String userEmail) {
        securityLogger.error("Unauthorized access attempt to {} by user: {}", resource, userEmail);
    }
}
```

## 🎚️ Log Level Configuration

### Runtime Log Level Changes
```properties
# application.yml
logging:
  level:
    com.teipsum.authservice: INFO
    com.teipsum.userservice: DEBUG
    org.springframework.security: WARN
    SECURITY: WARN
    JWT: WARN
    PERFORMANCE: INFO
```

### Environment-Specific Levels
```yaml
# Development
logging:
  level:
    com.teipsum: DEBUG
    org.springframework: INFO

# Production  
logging:
  level:
    com.teipsum: INFO
    org.springframework: WARN
    org.hibernate: WARN
```

## 📈 Log Aggregation

### ELK Stack Integration
```yaml
# Filebeat configuration for log shipping
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /app/logs/*.json
  fields:
    service: ${SERVICE_NAME}
    environment: ${ENVIRONMENT}
  fields_under_root: true

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "teipsum-logs-%{+yyyy.MM.dd}"
```

### Fluentd Configuration
```conf
<source>
  @type tail
  path /app/logs/*.json
  pos_file /tmp/fluentd-teipsum.log.pos
  tag teipsum.*
  format json
</source>

<match teipsum.**>
  @type elasticsearch
  host elasticsearch
  port 9200
  index_name teipsum-logs
</match>
```

## 🔧 Integration

### Maven Dependency
```xml
<dependency>
    <groupId>com.teipsum</groupId>
    <artifactId>shared-logger</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Service Configuration
```java
// In each microservice's application.yml
logging:
  system:
    service.name: ${spring.application.name}
  config: classpath:log4j2-prod.xml
```

## 🧪 Testing Support

### Log Testing Utilities
```java
@ExtendWith(MockitoExtension.class)
class LoggingTest {
    
    @Mock
    private Appender mockAppender;
    
    @Test
    void shouldLogUserRegistration() {
        Logger logger = (Logger) LoggerFactory.getLogger(AuthService.class);
        logger.addAppender(mockAppender);
        
        authService.registerUser(request);
        
        verify(mockAppender).doAppend(argThat(argument -> {
            LoggingEvent event = (LoggingEvent) argument;
            return event.getMessage().toString().contains("User registered");
        }));
    }
}
```

---

**Centralized Logging Configuration for TeIpsum Platform** 📝