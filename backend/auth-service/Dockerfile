FROM shared-dto-builder AS shared

FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

ARG SERVICE_NAME

COPY ../${SERVICE_NAME}/pom.xml ${SERVICE_NAME}/pom.xml
COPY ../${SERVICE_NAME}/src ${SERVICE_NAME}/src
COPY --from=shared /root/.m2 /root/.m2

RUN mvn -f ${SERVICE_NAME}/pom.xml -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/${SERVICE_NAME}/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
