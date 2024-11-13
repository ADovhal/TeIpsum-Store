package com.dovhal.application.controllers;

import com.dovhal.application.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestHeader("Authorization") String refreshTokenHeader) {
        System.out.println("Received refresh token header: " + refreshTokenHeader);  // Логируем весь заголовок

        String refreshToken = refreshTokenHeader.replace("Bearer ", "");
        System.out.println("Extracted refresh token: " + refreshToken);  // Логируем только токен

        // Проверяем, не истек ли refresh token
        if (jwtUtil.isRefreshTokenExpired(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token is expired or invalid");
        }

        // Попытка извлечь email из refresh token
        String email = jwtUtil.extractEmailFromRefreshToken(refreshToken);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }

        try {
            // Генерация нового access token
            String newAccessToken = jwtUtil.createAccessToken(email);
            System.out.println("New access token: " + newAccessToken);

            // Возвращаем новый access token
            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);
            return ResponseEntity.ok(tokens);
        } catch (Exception e) {
            // Обработка ошибок при генерации токенов
            System.out.println("Error during refresh token verification: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }
}
