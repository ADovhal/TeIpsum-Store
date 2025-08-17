package com.teipsum.adminproductservice;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@OpenAPIDefinition(
    info = @Info(
        title = "Admin-Product Service",
        version = "1.0.0",
        description = "TeIpsum Admin Product Management Service"
    )
)
@SpringBootApplication(scanBasePackages = "com.teipsum")
@EnableJpaAuditing
public class AdminProductServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminProductServiceApplication.class, args);
    }

}