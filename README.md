# TeIpsum - Sustainable Fashion E-Commerce Platform

![TeIpsum Logo](frontend/src/assets/images/ActualLogo.png)

## 🌿 About TeIpsum

TeIpsum is a modern, sustainable fashion e-commerce platform built with microservices architecture. The platform focuses on eco-friendly clothing with timeless designs, ethical production, and premium quality materials for men, women, and kids.

## 🏗️ Architecture Overview

TeIpsum follows a microservices architecture pattern with the following components:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Nginx        │    │   PostgreSQL    │
│   (React)       │◄──►│  Reverse Proxy   │◄──►│   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Microservices                        │
├─────────────────┬─────────────────┬─────────────────┬───────────┤
│  Auth Service   │  User Service   │ Catalog Service │    ...    │
│  (Port 8081)    │  (Port 8082)    │  (Port 8083)    │           │
└─────────────────┴─────────────────┴─────────────────┴───────────┘
                                 │
                                 ▼
                    ┌─────────────────────┐
                    │   Apache Kafka      │
                    │ (Event streaming)   │
                    └─────────────────────┘
```

### 🎯 Core Services

| Service | Port | Purpose | Technology Stack |
|---------|------|---------|------------------|
| **Frontend** | 3000/80 | React SPA with modern UI/UX | React 18, Redux Toolkit, i18next |
| **Auth Service** | 8081 | Authentication & Authorization | Spring Boot, JWT, Argon2, OAuth2 |
| **User Service** | 8082 | User profile management | Spring Boot, JPA, PostgreSQL |
| **Catalog Service** | 8083 | Product catalog & search | Spring Boot, JPA, HATEOAS |
| **Order Service** | 8084 | Order processing & management | Spring Boot, JPA, Kafka |
| **Inventory Service** | 8085 | Stock management | Spring Boot, JPA |
| **Admin Product Service** | 8086 | Product administration | Spring Boot, JPA, Security |

### 🔧 Infrastructure Services

- **Nginx**: Reverse proxy and load balancer
- **PostgreSQL**: Primary database for all services
- **Apache Kafka**: Event streaming for service communication
- **Docker**: Containerization for all services

## ✨ Key Features

### 🛍️ E-Commerce Features
- **Product Catalog**: Advanced filtering, search, and categorization
- **Shopping Cart**: Persistent cart with guest and authenticated users
- **Checkout Process**: Secure payment processing with order tracking
- **User Authentication**: JWT-based authentication with refresh tokens
- **User Profiles**: Profile management with order history
- **Admin Panel**: Product management, inventory control

### 🌐 User Experience
- **Responsive Design**: Mobile-first approach with CSS modules
- **Internationalization**: Support for English, German, Polish, Ukrainian
- **Theme Support**: Light/dark mode switching
- **SEO Optimization**: Server-side rendering optimization
- **Performance**: Code splitting and lazy loading
- **Accessibility**: WCAG compliant design

### 🔒 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Argon2 hashing with configurable parameters
- **OAuth2 Integration**: Resource server security
- **CORS Configuration**: Secure cross-origin requests
- **Role-based Access**: Admin and user role separation

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **Node.js 18+** 
- **Docker & Docker Compose**
- **PostgreSQL 15+**
- **Apache Kafka**

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/TeIpsum.git
   cd TeIpsum
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp infra/.env.example infra/.env.prod.infra
   # Edit the environment file with your configurations
   ```

3. **Start infrastructure services**
   ```bash
   cd infra
   docker-compose -f docker-compose.prod-infra.yml up -d
   ```

4. **Start backend services**
   ```bash
   cd backend
   # Build and start all services
   docker-compose -f auth-service/docker-compose.prod-auth-service.yml up -d
   docker-compose -f user-service/docker-compose.prod-user-service.yml up -d
   docker-compose -f catalog-service/docker-compose.prod-catalog-service.yml up -d
   docker-compose -f order-service/docker-compose.prod-order-service.yml up -d
   docker-compose -f inventory-service/docker-compose.prod-inventory-service.yml up -d
   docker-compose -f admin-product-service/docker-compose.prod-admin-product-service.yml up -d
   ```

5. **Start frontend**
   ```bash
   cd frontend
   docker-compose -f docker-compose.prod-frontend.yml up -d
   ```

6. **Start Nginx reverse proxy**
   ```bash
   cd infra/nginx
   docker-compose -f docker-compose.prod-nginx.yml up -d
   ```

7. **Access the application**
   - Frontend: http://localhost
   - API Gateway: http://localhost/api

### Development Setup

1. **Backend Development**
   ```bash
   cd backend
   # Start each service individually
   cd auth-service && mvn spring-boot:run
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📚 Documentation

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [Infrastructure Documentation](infra/README.md)
- [Auth Service Documentation](backend/auth-service/README.md)
- [API Documentation](docs/api.md) *(Coming Soon)*

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test  # Run all service tests
```

### Frontend Testing
```bash
cd frontend
npm test  # Run React tests
npm run test:coverage  # Run with coverage
```

## 🚀 Deployment

### Production Deployment

The application is designed for cloud deployment with Docker containers:

1. **Environment Setup**: Configure production environment variables
2. **Database Setup**: Set up PostgreSQL with proper schemas
3. **Container Registry**: Push images to your container registry
4. **Orchestration**: Deploy with Kubernetes or Docker Swarm
5. **Monitoring**: Set up logging and monitoring

### Environment Variables

Key environment variables to configure:

```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/teipsum
DB_USER=teipsum_user
DB_PASSWORD=secure_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Kafka
SPRING_KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 17
- **Security**: Spring Security, OAuth2, JWT
- **Database**: PostgreSQL 15, Spring Data JPA
- **Messaging**: Apache Kafka
- **Documentation**: Spring HATEOAS
- **Testing**: JUnit 5, Spring Boot Test
- **Build Tool**: Maven 3.8+

### Frontend
- **Framework**: React 18.3.1
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM 6
- **Styling**: CSS Modules, Styled Components
- **Animation**: Framer Motion, Lottie React
- **Internationalization**: i18next
- **HTTP Client**: Axios
- **Testing**: React Testing Library, Jest

### DevOps & Infrastructure
- **Containerization**: Docker, Docker Compose
- **Reverse Proxy**: Nginx
- **Database**: PostgreSQL 15
- **Message Broker**: Apache Kafka
- **Logging**: Log4j2
- **Monitoring**: Built-in Spring Boot Actuator

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Andrii Dovhal** - *Lead Developer* - [a.dovhal.std@gmail.com](mailto:a.dovhal.std@gmail.com)

## 🙏 Acknowledgments

- Sustainable fashion industry for inspiration
- Open source community for amazing tools and libraries
- Contributors and testers who help improve the platform

## 📞 Support

For support, email a.dovhal.std@gmail.com or create an issue in the repository.

---

**TeIpsum** - *Sustainable Fashion for a Better Tomorrow* 🌱
