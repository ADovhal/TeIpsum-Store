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

COPY shared-exceptions/pom.xml ./shared-exceptions/pom.xml
COPY shared-exceptions/src ./shared-exceptions/src

RUN mvn -f shared-exceptions/pom.xml install -DskipTests -Dparent.relativePath=../pom.xml
