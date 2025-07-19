package com.dovhal.userservice.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
// import java.util.HashMap;
import java.util.List;
// import java.util.Map;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.SecretKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${cors.allowed.origins}")
    private String corsAllowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors
                .configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of(corsAllowedOrigins.split(",")));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                    config.setAllowCredentials(true);
                    config.setExposedHeaders(List.of("Authorization", "Set-Cookie"));
                    config.setMaxAge(3600L);
                    return config;
                }))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/api/users/**").authenticated()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .authenticationEntryPoint(restAuthenticationEntryPoint())
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
            ));
            
            http.addFilterBefore(new OncePerRequestFilter() {
                @Override
                protected void doFilterInternal(
                    @org.springframework.lang.NonNull HttpServletRequest request,
                    @org.springframework.lang.NonNull HttpServletResponse response,
                    @org.springframework.lang.NonNull FilterChain filterChain
                ) throws ServletException, IOException {
                    System.out.println(">>> Authorization Header: " + request.getHeader("Authorization"));
                    filterChain.doFilter(request, response);
                }
            }, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint restAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\"}");
        };
    }

    
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKey key = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(key).build();

        // decoder.setClaimSetConverter(claims -> {
        //     Map<String, Object> newClaims = new HashMap<>(claims);
        //     newClaims.put("email", claims.get("sub"));
        //     System.out.println("email from token: " + claims.get("sub"));
        //     return newClaims;
        // });

        decoder.setJwtValidator(jwt -> {
            System.out.println("JWT Headers: " + jwt.getHeaders());
            System.out.println("JWT Claims: " + jwt.getClaims());
            return org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.success();
        });

        return decoder;
    }
    
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        // grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        converter.setPrincipalClaimName("sub");
        return converter;
    }
}

