FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY backend/user-service .
RUN mvn package -DskipTests
FROM openjdk:17-jdk-slim
COPY --from=build /app/user-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]