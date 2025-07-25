FROM shared-dto-builder AS shared-dto
FROM shared-exceptions-builder AS shared-exc

FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

ARG SERVICE_NAME

COPY backend/${SERVICE_NAME}/pom.xml ${SERVICE_NAME}/pom.xml
COPY backend/${SERVICE_NAME}/src ${SERVICE_NAME}/src
COPY --from=shared-dto /root/.m2 /tmp/m2-dto
COPY --from=shared-exc /root/.m2 /tmp/m2-exc
RUN mkdir -p /root/.m2 && \
    cp -r /tmp/m2-dto/* /root/.m2/ && \
    cp -r /tmp/m2-exc/* /root/.m2/

RUN mvn -f ${SERVICE_NAME}/pom.xml -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/user-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

