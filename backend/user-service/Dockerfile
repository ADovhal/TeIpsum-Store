FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY backend .
RUN mvn install -N -DskipTests
RUN mvn install -pl shared-dto -am -DskipTests
RUN mvn -f pom.xml install -N -DskipTests
RUN mvn -f pom.xml install -pl shared-dto -am -DskipTests
RUN mvn -f pom.xml package -pl user-service -am -DskipTests
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/user-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]