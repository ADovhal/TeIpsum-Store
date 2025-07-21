FROM shared-dto-builder AS shared

FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY backend/pom.xml ./pom.xml

RUN mvn install -N -DskipTests

COPY backend/user-service/pom.xml ./user-service/pom.xml
COPY backend/user-service/src ./user-service/src

COPY --from=shared /root/.m2 /root/.m2

RUN mvn -f user-service/pom.xml -DskipTests -Dparent.relativePath=../pom.xml package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/user-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
