package com.dovhal.application.config;

import com.dovhal.application.security.JwtUtil;
import com.dovhal.application.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/api/users/register").permitAll()
//                        .requestMatchers("/api/users/login").permitAll()
//                        .requestMatchers("/api/users/protected").permitAll()
//                        .requestMatchers("/api/users/profile").permitAll()
//                        .requestMatchers("/api/users/delete").permitAll()
//                        .requestMatchers("/api/products/all").permitAll()
//                        .requestMatchers("/api/products/{id}").permitAll()
//                        .requestMatchers("/api/products/category/{category}").permitAll()
//                        .requestMatchers("/api/products/search").permitAll()
//                        .requestMatchers("/api/products/price").permitAll()
//                        .requestMatchers("/api/products/rating").permitAll()
//                        .requestMatchers("/api/products/create").permitAll()
//                        .requestMatchers("/api/products/delete/{id}").permitAll()
//                        .anyRequest().authenticated())
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Stateless session
//
//        http.addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Отключаем CSRF
                .authorizeRequests(auth -> auth
                        .requestMatchers("/api/users/register",
                                         "/api/users/profile",
                                         "/api/users/login",
                                         "/api/products",
                                         "/api/products/{id}",
                                         "/api/products/category/{category}",
                                         "/api/validate-token")
                        .permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

//     This is how you get the AuthenticationManager in the latest Spring Security
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
