package com.dovhal.application.controllers;

import com.dovhal.application.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLOutput;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/validate-token")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        try {
            // Извлекаем имя пользователя (email) из токена
            String extractedUsername = jwtUtil.extractUsername(token);

            // Если валидация токена прошла успешно, возвращаем статус 200
            if (extractedUsername != null && !jwtUtil.isTokenExpired(token)) {
                System.out.println("Token validated!");
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception e) {
            // Ошибка при валидации токена
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
