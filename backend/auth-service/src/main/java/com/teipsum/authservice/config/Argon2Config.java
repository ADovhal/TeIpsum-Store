package com.teipsum.authservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.*;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "security.argon2")
public class Argon2Config {
    private int saltLength;
    private int hashLength;
    private int parallelism;
    private int memory;
    private int iterations;

}