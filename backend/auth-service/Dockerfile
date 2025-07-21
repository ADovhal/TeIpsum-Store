FROM maven:3.8.6-eclipse-temurin-17 AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

COPY backend/pom.xml .
COPY backend/shared-dto/pom.xml ./shared-dto/
COPY backend/auth-service/pom.xml ./auth-service/
COPY backend/shared-dto/src ./shared-dto/src
COPY backend/auth-service/src ./auth-service/src

RUN echo 'check_changes() { \
    if [ ! -f "$1/.hash" ]; then return 0; fi; \
    old_hash=$(cat "$1/.hash"); \
    new_hash=$(git ls-files -s "$2" | git hash-object --stdin); \
    [ "$old_hash" != "$new_hash" ]; \
}' > /check_changes.sh

RUN . /check_changes.sh && \
    if check_changes "/app" "backend/shared-dto/pom.xml" || [ ! -f /app/shared-dto/.hash ]; then \
      cd backend/shared-dto && \
      mvn clean install -DskipTests -Dparent.relativePath=../pom.xml && \
      git ls-files -s backend/shared-dto/pom.xml | git hash-object --stdin > /app/shared-dto/.hash; \
    fi

RUN . /check_changes.sh && \
    if check_changes "/app" "backend/shared-dto/src" || [ ! -f /app/shared-dto/.src_hash ]; then \
      cd backend/shared-dto && \
      mvn clean install -DskipTests -Dparent.relativePath=../pom.xml && \
      git ls-files -s backend/shared-dto/src | git hash-object --stdin > /app/shared-dto/.src_hash; \
    fi


RUN if [ -d shared-dto/src ]; then \
      cd shared-dto && \
      mvn clean install -DskipTests -Dparent.relativePath=../pom.xml; \
    fi

RUN cd auth-service && \
    mvn clean package -DskipTests -Dparent.relativePath=../../pom.xml

FROM eclipse-temurin:17-jre-jammy
COPY --from=builder /app/auth-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]