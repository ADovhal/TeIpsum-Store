package com.teipsum.userservice;

import com.teipsum.shared.exceptions.handler.GlobalExceptionHandler;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;


@OpenAPIDefinition(
    info = @Info(
        title = "User Service",         
        version = "1.0.0",               
        description = "TeIpsum User Management Service"
    )
)
@SpringBootApplication
@Import(GlobalExceptionHandler.class)
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}