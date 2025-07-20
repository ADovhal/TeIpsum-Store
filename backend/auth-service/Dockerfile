FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app

COPY backend/pom.xml .
COPY backend/shared-dto/pom.xml backend/shared-dto/
COPY backend/auth-service/pom.xml backend/auth-service/

RUN mvn -B dependency:go-offline -pl auth-service -am

COPY backend/shared-dto/src backend/shared-dto/src
COPY backend/auth-service/src backend/auth-service/src

RUN mvn -B package -pl auth-service -am -DskipTests
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/backend/auth-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]