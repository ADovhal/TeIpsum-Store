package com.teipsum.authservice.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    private final Algorithm accessTokenAlgorithm;
    private final Algorithm refreshTokenAlgorithm;

    public JwtUtil(
            @Value("${jwt.secret}") String accessSecretKey,
            @Value("${jwt.refresh-secret}") String refreshSecretKey
    ) {
        this.accessTokenAlgorithm = Algorithm.HMAC256(accessSecretKey);
        this.refreshTokenAlgorithm = Algorithm.HMAC256(refreshSecretKey);
    }

    public String createAccessToken(String email, List<String> roles) {
        return JWT.create()
                .withSubject(email)
                .withClaim("roles", roles)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 15 * 60 * 1000))
                .sign(accessTokenAlgorithm);
    }

    public String createRefreshToken(String email) {
        return JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000))
                .sign(refreshTokenAlgorithm);
    }

    public String extractEmailFromAccessToken(String token) {
        try {
            DecodedJWT jwt = JWT.require(accessTokenAlgorithm)
                    .build()
                    .verify(token);
            return jwt.getSubject();
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Invalid access token", e);
        }
    }

    public String extractEmailFromRefreshToken(String token) {
        try {
            DecodedJWT jwt = JWT.require(refreshTokenAlgorithm)
                    .build()
                    .verify(token);
            return jwt.getSubject();
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Invalid refresh token", e);
        }
    }

    public boolean isAccessTokenExpired(String token) {
        try {
            DecodedJWT jwt = JWT.require(accessTokenAlgorithm)
                    .build()
                    .verify(token);
            return jwt.getExpiresAt().before(new Date());
        } catch (JWTVerificationException e) {
            return true;
        }
    }

    public boolean isRefreshTokenExpired(String token) {
        try {
            DecodedJWT jwt = JWT.require(refreshTokenAlgorithm)
                    .build()
                    .verify(token);
            return jwt.getExpiresAt().before(new Date());
        } catch (JWTVerificationException e) {
            return true;
        }
    }
}
