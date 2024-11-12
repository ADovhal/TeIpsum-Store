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

    // Access токен живет 15 минут (900000 мс)
    private final long ACCESS_TOKEN_EXPIRATION = 900000;
    // Refresh токен живет 7 дней (604800000 мс)
    private final long REFRESH_TOKEN_EXPIRATION = 604800000;

    // Метод для создания Access Token
    public String createAccessToken(String email) {
        Algorithm algorithm = Algorithm.HMAC256(accessSecretKey);
        return JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .sign(algorithm);
    }

    // Метод для создания Refresh Token
    public String createRefreshToken(String email) {
        Algorithm algorithm = Algorithm.HMAC256(refreshSecretKey);
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
        return JWT.require(Algorithm.HMAC256(refreshSecretKey))
                .build()
                .verify(token)
                .getSubject();
    }

    // Проверка, истек ли Access Token
    public boolean isAccessTokenExpired(String token) {
        try {
            Date expirationDate = JWT.require(Algorithm.HMAC256(accessSecretKey))
                    .build()
                    .verify(token)
                    .getExpiresAt();
            return expirationDate.before(new Date());
        } catch (JWTVerificationException e) {
            return true;  // Если токен невалиден или истек, считаем его истекшим
        }
    }

    // Проверка, истек ли Refresh Token
    public boolean isRefreshTokenExpired(String token) {
        try {
            Date expirationDate = JWT.require(Algorithm.HMAC256(refreshSecretKey))
                    .build()
                    .verify(token)
                    .getExpiresAt();
            return expirationDate.before(new Date());
        } catch (JWTVerificationException e) {
            return true;  // Если токен невалиден или истек, считаем его истекшим
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
            throw new JWTVerificationException("Invalid or expired token.", e);  // Бросаем исключение, если токен невалиден
        }
    }
}
