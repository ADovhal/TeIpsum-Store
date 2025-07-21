FROM maven:3.8.4-openjdk-17 AS builder

WORKDIR /app

COPY backend/shared-dto/pom.xml ./shared-dto/
COPY backend/shared-dto/src ./shared-dto/src
RUN cd shared-dto && mvn clean install -DskipTests

WORKDIR /app/auth-service

COPY backend/auth-service/pom.xml .
COPY backend/auth-service/src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
COPY --from=builder /app/auth-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]