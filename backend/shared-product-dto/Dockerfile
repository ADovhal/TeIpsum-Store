FROM shared-exceptions-builder AS shared-exc
FROM maven:3.9.11-eclipse-temurin-17-alpine AS builder

WORKDIR /app

COPY pom.xml ./pom.xml
RUN mvn install:install-file \
    -Dfile=./pom.xml \
    -DgroupId=com.teipsum \
    -DartifactId=teipsum-backend \
    -Dversion=1.0-SNAPSHOT \
    -Dpackaging=pom \
    -DgeneratePom=false

COPY --from=shared-exc /root/.m2 /tmp/m2-exc
RUN mkdir -p /root/.m2 && \
    cp -r /tmp/m2-exc/* /root/.m2/

COPY shared-product-dto/pom.xml ./shared-product-dto/pom.xml
COPY shared-product-dto/src ./shared-product-dto/src

RUN mvn -f shared-product-dto/pom.xml install -DskipTests -Dparent.relativePath=../pom.xml
