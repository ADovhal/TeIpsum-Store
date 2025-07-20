FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY backend/shared-dto ./shared-dto
COPY backend/auth-service ./auth-service
WORKDIR /app/auth-service
RUN mvn -B dependency:go-offline
RUN mvn -B package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app

COPY --from=build /app/auth-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
