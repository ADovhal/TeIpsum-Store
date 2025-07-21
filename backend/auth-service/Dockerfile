FROM maven:3.9.11-eclipse-temurin-17-alpine AS builder

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

COPY backend/pom.xml ./
COPY backend/shared-dto/pom.xml ./shared-dto/
COPY backend/auth-service/pom.xml ./auth-service/

COPY backend/shared-dto/src ./shared-dto/src
COPY backend/auth-service/src ./auth-service/src

RUN echo 'check_changes() { \
    if [ ! -f "$1/.hash" ]; then return 0; fi; \
    old_hash=$(cat "$1/.hash"); \
    new_hash=$(find "$2" -type f -exec sha256sum {} + | sort | sha256sum | cut -d" " -f1); \
    [ "$old_hash" != "$new_hash" ]; \
}' > /check_changes.sh

RUN mkdir -p /app/shared-dto && \
    . /check_changes.sh && \
    if check_changes "/app/shared-dto" "shared-dto/pom.xml shared-dto/src" || \
       [ ! -f /app/shared-dto/.hash ]; then \
      cd shared-dto && \
      mvn clean install -DskipTests -Dparent.relativePath=../pom.xml && \
      find ../shared-dto -type f -exec sha256sum {} + | sort | sha256sum | cut -d" " -f1 > /app/shared-dto/.hash; \
    fi

RUN cd auth-service && \
    mvn clean package -DskipTests -Dparent.relativePath=../../pom.xml

FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY --from=builder /app/auth-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
