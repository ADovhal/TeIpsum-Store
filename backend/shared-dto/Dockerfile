FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml ./pom.xml
RUN mvn install:install-file \
    -Dfile=./pom.xml \
    -DgroupId=com.teipsum \
    -DartifactId=teipsum-backend \
    -Dversion=1.0-SNAPSHOT \
    -Dpackaging=pom \
    -DgeneratePom=false

COPY shared-dto/pom.xml ./shared-dto/pom.xml
COPY shared-dto/src ./shared-dto/src

RUN mvn -f shared-dto/pom.xml install -DskipTests -Dparent.relativePath=../pom.xml
