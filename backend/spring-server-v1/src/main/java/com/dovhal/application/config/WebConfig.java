package com.dovhal.application.config;
// import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed.origins}") // Читаем значение из application.properties
    private String allowedOriginsS;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // .allowedOrigins("https://andriidovhal.tech/", "https://resume.vladyslavdobrovolskyi.tech/", "https://app.andriidovhal.tech/")
                .allowedOrigins(allowedOriginsS.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}