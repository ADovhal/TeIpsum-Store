# FROM maven:3.9.11-eclipse-temurin-17-alpine AS shared-dto-builder

# WORKDIR /build/shared-dto

# RUN apk add --no-cache git

# COPY ../../pom.xml /build/
# COPY ../shared-dto/pom.xml ./pom.xml
# COPY ../shared-dto/src ./src

# RUN mvn clean install -DskipTests -f /build/shared-dto/pom.xml -Dparent.relativePath=../pom.xml

# FROM maven:3.9.11-eclipse-temurin-17-alpine AS builder

# WORKDIR /build/auth-service

# RUN apk add --no-cache git

# COPY --from=shared-dto-builder /root/.m2 /root/.m2

# COPY ../../pom.xml /build/
# COPY ../auth-service/pom.xml ./pom.xml
# COPY ../auth-service/src ./src

# RUN mvn clean package -DskipTests -Dparent.relativePath=../pom.xml

# FROM gcr.io/distroless/java17-debian11

# WORKDIR /app

# COPY --from=builder /build/auth-service/target/*.jar app.jar

# ENTRYPOINT ["java", "-jar", "/app/app.jar"]

FROM maven:3.9.11-eclipse-temurin-17-alpine AS builder

WORKDIR /app

COPY ../../backend/pom.xml ./pom.xml
COPY ../../backend/shared-dto/pom.xml ./shared-dto/pom.xml
COPY ../../.m2 /root/.m2

COPY ./pom.xml ./auth-service/pom.xml
COPY ./src ./auth-service/src

RUN mvn -f pom.xml package -pl auth-service -am -DskipTests

FROM gcr.io/distroless/java17-debian11

WORKDIR /app
COPY --from=builder /app/auth-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
