FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app

COPY backend ./backend

WORKDIR /app/backend

RUN mvn -B package -pl auth-service -am -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/backend/auth-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
