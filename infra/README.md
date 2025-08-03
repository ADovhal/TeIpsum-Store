# Infrastructure - TeIpsum E-Commerce Platform

## 🏗️ Overview

The TeIpsum infrastructure provides the foundational services and networking layer for the microservices-based e-commerce platform. It includes database management, message broking, reverse proxy configuration, and container orchestration for both staging and production environments.

## 🛠️ Infrastructure Components

### 🔀 Reverse Proxy & Load Balancer
- **Nginx**: High-performance reverse proxy and load balancer
- **SSL/TLS Termination**: HTTPS encryption with security headers
- **API Gateway**: Centralized routing to microservices
- **Static Asset Serving**: Frontend application delivery

### 🗄️ Database Layer
- **PostgreSQL 15**: Primary database for all services
- **Multi-Database Setup**: Separate databases per microservice
- **Connection Pooling**: Optimized database connections
- **Automated Initialization**: Database and user creation scripts

### 📡 Message Broker
- **Apache Kafka**: Event streaming and service communication
- **Zookeeper**: Kafka cluster coordination
- **Topic Management**: Organized event channels

### 🐳 Container Orchestration
- **Docker Compose**: Service orchestration and networking
- **Multi-Environment**: Separate configurations for staging/production
- **Service Discovery**: Container networking and communication

## 🏗️ Architecture Overview

```
                    ┌─────────────────┐
                    │   Internet      │
                    │   Traffic       │
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │     Nginx       │
                    │ Reverse Proxy   │
                    │   SSL/TLS       │
                    └─────────┬───────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │   Frontend      │ │  API Services   │ │  Static Assets  │
    │   (React SPA)   │ │  (Microservices)│ │   (Images/JS)   │
    └─────────────────┘ └─────────┬───────┘ └─────────────────┘
                                  │
                        ┌─────────┼─────────┐
                        │         │         │
                        ▼         ▼         ▼
            ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
            │   PostgreSQL    │ │  Apache Kafka   │ │   Zookeeper     │
            │   Database      │ │ Message Broker  │ │  Coordination   │
            └─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 📁 Directory Structure

```
infra/
├── docker-compose.prod-infra.yml     # Production infrastructure
├── docker-compose.stage-infra.yml    # Staging infrastructure
├── nginx/                            # Reverse proxy configuration
│   ├── nginx.prod.conf               # Production Nginx config
│   ├── nginx.stage.conf              # Staging Nginx config
│   ├── docker-compose.prod-nginx.yml # Production Nginx container
│   └── docker-compose.stage-nginx.yml # Staging Nginx container
├── init/                             # Database initialization
│   ├── init-multiple-dbs.template.sql # Database creation script
│   └── init-schema-grants.template.sql # Schema and permissions
└── README.md                         # This documentation
```

## 🔧 Configuration

### Environment Variables

Create environment files for each environment:

#### Production Environment (`.env.prod.infra`)
```bash
# PostgreSQL Configuration
POSTGRES_HOST=prod-teipsum-postgres
POSTGRES_PORT=5433
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_production_password

# Service Database Configuration
AUTH_SERVICE_DB_NAME=teipsum_auth
AUTH_SERVICE_DB_USER=auth_user
AUTH_SERVICE_DB_PASSWORD=auth_secure_password

USER_SERVICE_DB_NAME=teipsum_user
USER_SERVICE_DB_USER=user_user
USER_SERVICE_DB_PASSWORD=user_secure_password

CATALOG_SERVICE_DB_NAME=teipsum_catalog
CATALOG_SERVICE_DB_USER=catalog_user
CATALOG_SERVICE_DB_PASSWORD=catalog_secure_password

ADMIN_PRODUCT_SERVICE_DB_NAME=teipsum_admin_product
ADMIN_PRODUCT_SERVICE_DB_USER=admin_product_user
ADMIN_PRODUCT_SERVICE_DB_PASSWORD=admin_product_secure_password

ORDER_SERVICE_DB_NAME=teipsum_order
ORDER_SERVICE_DB_USER=order_user
ORDER_SERVICE_DB_PASSWORD=order_secure_password

# Kafka Configuration
KAFKA_BROKER_ID=1
KAFKA_ZOOKEEPER_CONNECT=prod-teipsum-zookeeper:2182
KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://prod-teipsum-kafka:9094

# Zookeeper Configuration
ZOOKEEPER_CLIENT_PORT=2182
ZOOKEEPER_TICK_TIME=2000
```

#### Staging Environment (`.env.stage.infra`)
```bash
# Similar configuration with staging-specific values
POSTGRES_PASSWORD=staging_password
# ... other staging-specific configurations
```

## 🗄️ Database Configuration

### Multi-Database Architecture

Each microservice has its own dedicated database for data isolation and scalability:

| Service | Database Name | User | Purpose |
|---------|---------------|------|---------|
| Auth Service | `teipsum_auth` | `auth_user` | User credentials, roles, tokens |
| User Service | `teipsum_user` | `user_user` | User profiles, preferences |
| Catalog Service | `teipsum_catalog` | `catalog_user` | Product catalog, categories |
| Admin Product Service | `teipsum_admin_product` | `admin_product_user` | Product management |
| Order Service | `teipsum_order` | `order_user` | Orders, payments, transactions |

### Database Initialization

#### 1. Database Creation Script (`init-multiple-dbs.template.sql`)
```sql
-- Create databases for each service
CREATE DATABASE teipsum_auth;
CREATE DATABASE teipsum_user;
CREATE DATABASE teipsum_catalog;
CREATE DATABASE teipsum_admin_product;
CREATE DATABASE teipsum_order;

-- Create dedicated users for each service
CREATE USER auth_user WITH ENCRYPTED PASSWORD 'secure_password';
CREATE USER user_user WITH ENCRYPTED PASSWORD 'secure_password';
-- ... additional users

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE teipsum_auth TO auth_user;
GRANT ALL PRIVILEGES ON DATABASE teipsum_user TO user_user;
-- ... additional grants
```

#### 2. Schema and Permissions Script (`init-schema-grants.template.sql`)
```sql
-- Configure schema permissions for each database
\connect teipsum_auth
GRANT USAGE, CREATE ON SCHEMA public TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO auth_user;

-- Special inventory schema for shared inventory data
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE TABLE IF NOT EXISTS inventory.inventory (
    product_id UUID PRIMARY KEY,
    quantity INTEGER NOT NULL
);
```

## 🔀 Nginx Reverse Proxy

### Production Configuration (`nginx.prod.conf`)

#### SSL/TLS Configuration
```nginx
server {
    listen 443 ssl;
    server_name teipsum.store;
    
    ssl_certificate      /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key  /etc/nginx/ssl/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Service Routing
```nginx
# Frontend application
location / {
    proxy_pass http://frontend;
}

# Authentication service
location /api/auth/ {
    proxy_pass http://auth/api/auth/;
    proxy_set_header Authorization $http_authorization;
}

# User service
location /api/users/ {
    proxy_pass http://user/api/users/;
    proxy_set_header Authorization $http_authorization;
}

# Product catalog service
location /api/products {
    proxy_pass http://catalog/api/products;
    proxy_set_header Authorization $http_authorization;
}

# Admin product management
location /api/admin/products/ {
    proxy_pass http://admin-product/api/admin/products/;
    proxy_set_header Authorization $http_authorization;
}

# Order service
location /api/orders/ {
    proxy_pass http://orders/api/orders/;
    proxy_set_header Authorization $http_authorization;
}
```

#### Upstream Services
```nginx
upstream frontend {
    server prod-teipsum-frontend:81;
}

upstream auth {
    server prod-auth-service:9090;
}

upstream user {
    server prod-user-service:9093;
}

upstream catalog {
    server prod-catalog-service:9098;
}

upstream admin-product {
    server prod-admin-product-service:9096;
}

upstream orders {
    server prod-order-service:8100;
}
```

## 📡 Kafka Message Broker

### Kafka Configuration

#### Production Setup (`docker-compose.prod-infra.yml`)
```yaml
services:
  kafka:
    container_name: prod-teipsum-kafka
    image: confluentinc/cp-kafka:7.0.0
    ports: ["29092:9094"]
    environment:
      KAFKA_ZOOKEEPER_CONNECT: prod-teipsum-zookeeper:2182
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://prod-teipsum-kafka:9094
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT
      KAFKA_BROKER_ID: 1
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    networks: [prod-net]

  zookeeper:
    container_name: prod-teipsum-zookeeper
    image: confluentinc/cp-zookeeper:7.0.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2182
    networks: [prod-net]
```

### Kafka Topics

| Topic | Purpose | Producers | Consumers |
|-------|---------|-----------|-----------|
| `user-registered` | User registration events | Auth Service | User Service |
| `user-login` | User login events | Auth Service | User Service |
| `product-events` | Product CRUD operations | Admin Product Service | Catalog Service |
| `order-events` | Order lifecycle events | Order Service | Inventory Service |
| `inventory-events` | Stock level changes | Inventory Service | Catalog Service |

## 🚀 Deployment

### Prerequisites
- **Docker** 20.10+
- **Docker Compose** 2.0+
- **SSL Certificates** (for production)
- **Domain Name** (for production)

### Production Deployment

1. **Prepare environment files**
   ```bash
   cd infra
   cp .env.example .env.prod.infra
   # Edit .env.prod.infra with production values
   ```

2. **Generate SSL certificates**
   ```bash
   # Using Let's Encrypt with Certbot
   certbot certonly --webroot -w /var/www/html -d teipsum.store
   
   # Copy certificates to nginx directory
   cp /etc/letsencrypt/live/teipsum.store/fullchain.pem nginx/ssl/
   cp /etc/letsencrypt/live/teipsum.store/privkey.pem nginx/ssl/
   ```

3. **Start infrastructure services**
   ```bash
   # Start core infrastructure
   docker-compose -f docker-compose.prod-infra.yml up -d
   
   # Wait for services to be ready
   docker-compose -f docker-compose.prod-infra.yml ps
   ```

4. **Start Nginx reverse proxy**
   ```bash
   cd nginx
   docker-compose -f docker-compose.prod-nginx.yml up -d
   ```

### Staging Deployment

1. **Start staging infrastructure**
   ```bash
   # Use staging configuration
   docker-compose -f docker-compose.stage-infra.yml up -d
   
   # Start staging nginx
   cd nginx
   docker-compose -f docker-compose.stage-nginx.yml up -d
   ```

### Health Checks

```bash
# Check PostgreSQL
docker exec prod-teipsum-postgres pg_isready -U postgres

# Check Kafka
docker exec prod-teipsum-kafka kafka-topics --bootstrap-server localhost:9094 --list

# Check Nginx
curl -I https://teipsum.store
```

## 🔧 Management & Maintenance

### Database Management

#### Backup Database
```bash
# Backup all databases
docker exec prod-teipsum-postgres pg_dumpall -U postgres > backup_$(date +%Y%m%d).sql

# Backup specific database
docker exec prod-teipsum-postgres pg_dump -U postgres teipsum_auth > auth_backup.sql
```

#### Restore Database
```bash
# Restore all databases
cat backup_20240115.sql | docker exec -i prod-teipsum-postgres psql -U postgres

# Restore specific database
cat auth_backup.sql | docker exec -i prod-teipsum-postgres psql -U postgres -d teipsum_auth
```

### Kafka Management

#### Create Topics
```bash
# Create topic manually
docker exec prod-teipsum-kafka kafka-topics \
  --bootstrap-server localhost:9094 \
  --create \
  --topic user-events \
  --partitions 3 \
  --replication-factor 1
```

#### Monitor Topics
```bash
# List topics
docker exec prod-teipsum-kafka kafka-topics \
  --bootstrap-server localhost:9094 \
  --list

# View topic details
docker exec prod-teipsum-kafka kafka-topics \
  --bootstrap-server localhost:9094 \
  --describe \
  --topic user-events
```

### Nginx Management

#### Reload Configuration
```bash
# Test configuration
docker exec prod-teipsum-nginx nginx -t

# Reload configuration
docker exec prod-teipsum-nginx nginx -s reload
```

#### View Logs
```bash
# Access logs
docker logs prod-teipsum-nginx

# Error logs
docker exec prod-teipsum-nginx tail -f /var/log/nginx/error.log
```

## 📊 Monitoring & Logging

### Service Health Monitoring
```bash
# Check all infrastructure services
docker-compose -f docker-compose.prod-infra.yml ps

# View service logs
docker-compose -f docker-compose.prod-infra.yml logs -f postgres
docker-compose -f docker-compose.prod-infra.yml logs -f kafka
```

### Performance Monitoring

#### Database Performance
```bash
# Check database connections
docker exec prod-teipsum-postgres psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# Check database sizes
docker exec prod-teipsum-postgres psql -U postgres -c "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database;"
```

#### Kafka Performance
```bash
# Check consumer lag
docker exec prod-teipsum-kafka kafka-consumer-groups \
  --bootstrap-server localhost:9094 \
  --group user-service-group \
  --describe
```

### Log Aggregation
```yaml
# Example logging configuration with ELK stack
version: '3.8'
services:
  elasticsearch:
    image: elasticsearch:7.17.0
    environment:
      - discovery.type=single-node
    
  logstash:
    image: logstash:7.17.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    
  kibana:
    image: kibana:7.17.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
```

## 🔒 Security

### Network Security
- **Container Networks**: Isolated networks for service communication
- **Firewall Rules**: Restricted port access
- **SSL/TLS**: Encrypted communication for all external traffic

### Database Security
```sql
-- Secure database configuration
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
ALTER SYSTEM SET log_duration = on;

-- Password policies
ALTER SYSTEM SET password_encryption = 'scram-sha-256';
```

### Nginx Security Headers
```nginx
# Security headers
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;

# CSP header
add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' https://teipsum.store; frame-ancestors 'none';";
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL status
   docker logs prod-teipsum-postgres
   
   # Test connection
   docker exec prod-teipsum-postgres psql -U postgres -c "SELECT 1;"
   ```

2. **Kafka Connection Issues**
   ```bash
   # Check Kafka and Zookeeper status
   docker logs prod-teipsum-kafka
   docker logs prod-teipsum-zookeeper
   
   # Test Kafka connectivity
   docker exec prod-teipsum-kafka kafka-broker-api-versions --bootstrap-server localhost:9094
   ```

3. **Nginx 502 Bad Gateway**
   ```bash
   # Check upstream services
   docker ps | grep teipsum
   
   # Test upstream connectivity
   docker exec prod-teipsum-nginx curl -I http://prod-teipsum-frontend:81
   ```

### Debug Commands
```bash
# Check network connectivity
docker network ls
docker network inspect prod-net

# Check DNS resolution
docker exec prod-teipsum-nginx nslookup prod-teipsum-frontend

# Check port availability
docker exec prod-teipsum-nginx netstat -tlnp
```

## 📈 Scaling & Performance

### Horizontal Scaling
```yaml
# Scale services with replicas
services:
  kafka:
    deploy:
      replicas: 3
    environment:
      KAFKA_BROKER_ID: ${BROKER_ID}
      
  postgres:
    deploy:
      replicas: 1  # Use read replicas for scaling
```

### Performance Tuning

#### PostgreSQL Optimization
```sql
-- Performance tuning
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET max_connections = 200;
```

#### Nginx Optimization
```nginx
# Worker process optimization
worker_processes auto;
worker_connections 1024;

# Compression
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=static:10m max_size=100m;
```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

1. Test infrastructure changes in staging first
2. Update documentation for configuration changes
3. Follow security best practices
4. Monitor performance impact of changes
5. Maintain backward compatibility

---

**Infrastructure Foundation for TeIpsum E-Commerce Platform** 🏗️