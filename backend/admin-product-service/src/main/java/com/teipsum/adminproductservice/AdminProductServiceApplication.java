package com.teipsum.adminproductservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AdminProductServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminProductServiceApplication.class, args);
    }

}
