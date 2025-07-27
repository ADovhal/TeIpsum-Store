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

COPY shared-logger/pom.xml ./shared-logger/pom.xml
COPY shared-logger/src ./shared-logger/src

RUN mvn -f shared-logger/pom.xml install -DskipTests -Dparent.relativePath=../pom.xml
