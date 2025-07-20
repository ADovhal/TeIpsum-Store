FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/shared-dto/pom.xml ./shared-dto/
COPY backend/auth-service/pom.xml ./auth-service/
RUN mvn -B dependency:go-offline -pl auth-service -am
COPY backend .
RUN mvn -B package -pl auth-service -am -DskipTests
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/auth-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]