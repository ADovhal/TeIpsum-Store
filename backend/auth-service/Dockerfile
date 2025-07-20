FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY backend/shared-dto ./shared-dto
RUN mvn install -f shared-dto/pom.xml -DskipTests
COPY backend/auth-service .
RUN mvn package -DskipTests
FROM openjdk:17-jdk-slim
COPY --from=build /app/auth-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]