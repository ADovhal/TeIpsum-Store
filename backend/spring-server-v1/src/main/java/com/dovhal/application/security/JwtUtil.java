package com.dovhal.application.security;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "your_secret_key"; // Используйте секретный ключ

    @Value("${jwt.secret}") // Внедрение значения из application.properties
    private String secretKey;

    private final long EXPIRATION_TIME = 3600000; // 1 час

    public String createToken(String username) {
        Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
        Map<String, Object> headerClaims = new HashMap<>();
        headerClaims.put("typ", "JWT");
        headerClaims.put("alg", "HS256");

        return JWT.create()
                .withHeader(headerClaims)
                .withSubject(username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(algorithm);
    }

    public String extractUsername(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .build()
                .verify(token)
                .getSubject();
    }

    public boolean isTokenExpired(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .build()
                .verify(token)
                .getExpiresAt()
                .before(new Date());
    }

    public boolean validateToken(String token, String username) {
        String extractedUsername = extractUsername(token);
        return (extractedUsername != null && extractedUsername.equals(username) && !isTokenExpired(token));
    }
}