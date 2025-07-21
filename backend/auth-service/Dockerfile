FROM maven:3.8.4-openjdk-17 AS builder

WORKDIR /app

COPY backend/pom.xml .
COPY backend/shared-dto/pom.xml ./shared-dto/
COPY backend/shared-dto/src ./shared-dto/src
COPY backend/auth-service/pom.xml ./auth-service/
COPY backend/auth-service/src ./auth-service/src

RUN mvn install -N -f pom.xml -DskipTests
RUN cd shared-dto && \
    mvn clean install -f pom.xml -DskipTests -Dparent.relativePath=../pom.xml
RUN cd auth-service && \
    mvn clean package -f pom.xml -DskipTests -Dparent.relativePath=../../pom.xml

FROM openjdk:17-jdk-slim
COPY --from=builder /app/auth-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]