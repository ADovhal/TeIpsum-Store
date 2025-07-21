FROM shared-dto-builder AS shared

FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY backend/pom.xml ./pom.xml
COPY backend/auth-service/pom.xml ./auth-service/pom.xml
COPY backend/auth-service/src ./auth-service/src

COPY --from=shared /root/.m2 /root/.m2

RUN mvn -f auth-service/pom.xml -DskipTests -Dparent.relativePath=../pom.xml package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/auth-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]