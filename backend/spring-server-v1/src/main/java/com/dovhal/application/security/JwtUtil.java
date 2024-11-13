package com.dovhal.application.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String accessSecretKey;
    @Value("${jwt.refresh-secret}")
    private String refreshSecretKey;

    // Метод для создания Access Token
    public String createAccessToken(String email) {
        Algorithm algorithm = Algorithm.HMAC256(accessSecretKey);
        // Access токен живет 1 минуту (900000 мс)
        long ACCESS_TOKEN_EXPIRATION = 60000;
        return JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .sign(algorithm);
    }

    // Метод для создания Refresh Token
    public String createRefreshToken(String email) {
        Algorithm algorithm = Algorithm.HMAC256(refreshSecretKey);
        // Refresh токен живет 5 минут (604800000 мс)
        long REFRESH_TOKEN_EXPIRATION = 300000;
        return JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .sign(algorithm);
    }

    // Извлечение email из Access Token
    public String extractEmailFromAccessToken(String token) {
        return JWT.require(Algorithm.HMAC256(accessSecretKey))
                .build()
                .verify(token)
                .getSubject();
    }

    // Извлечение email из Refresh Token
    public String extractEmailFromRefreshToken(String token) {
        try {
            return JWT.require(Algorithm.HMAC256(refreshSecretKey))
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            System.out.println("Error extracting email from refresh token: " + e.getMessage());
            throw new RuntimeException("Invalid refresh token");
        }
    }

    // Проверка, истек ли Access Token
    public boolean isAccessTokenExpired(String token) {
        try {
            Date expirationDate = JWT.require(Algorithm.HMAC256(accessSecretKey))
                    .build()
                    .verify(token)
                    .getExpiresAt();
            return expirationDate.before(new Date()); // Вернет true, если истек
        } catch (JWTVerificationException e) {
            return true;  // Считаем истекшим, если невалиден
        }
    }

    // Проверка, истек ли Refresh Token
    public boolean isRefreshTokenExpired(String token) {
        try {
            Date expirationDate = JWT.require(Algorithm.HMAC256(refreshSecretKey))
                    .build()
                    .verify(token)
                    .getExpiresAt();
            return expirationDate.before(new Date()); // Вернет true, если истек
        } catch (JWTVerificationException e) {
//            return true;  // Считаем истекшим, если невалиден
            System.out.println("Error checking refresh token expiration: " + e.getMessage());
            return true;
        }
    }

    // Верификация токена (проверка его валидности и истечения срока)
    public void verifyToken(String token) throws JWTVerificationException {
        try {
            // Попытаться верифицировать токен
            JWT.require(Algorithm.HMAC256(accessSecretKey))  // Указываем алгоритм для верификации
                    .build()
                    .verify(token);  // Проверяем токен
        } catch (JWTVerificationException e) {
            System.out.println("Token verification failed: " + e.getMessage());
            throw new JWTVerificationException("Invalid or expired token.", e);  // Бросаем исключение, если токен невалиден
        }
    }
}
