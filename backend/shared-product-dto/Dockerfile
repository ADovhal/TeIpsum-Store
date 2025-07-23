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

COPY shared-product-dto/pom.xml ./shared-product-dto/pom.xml
COPY shared-product-dto/src ./shared-product-dto/src

RUN mvn -f shared-product-dto/pom.xml install -DskipTests -Dparent.relativePath=../pom.xml
