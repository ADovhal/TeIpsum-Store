package com.teipsum.authservice.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.teipsum.authservice.model.TokenType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class JwtUtil {
    private final Map<TokenType, Algorithm> algorithms;
    private final Map<TokenType, Long> tokenExpirations;

    public JwtUtil(
            @Value("${jwt.secret}") String accessSecretKey,
            @Value("${jwt.refresh-secret}") String refreshSecretKey,
            @Value("${jwt.admin-secret}") String adminSecretKey,
            @Value("${jwt.admin-refresh-secret}") String adminRefreshSecretKey
    ) {
        algorithms = Map.of(
                TokenType.USER_ACCESS, Algorithm.HMAC256(accessSecretKey),
                TokenType.USER_REFRESH, Algorithm.HMAC256(refreshSecretKey),
                TokenType.ADMIN_ACCESS, Algorithm.HMAC256(adminSecretKey),
                TokenType.ADMIN_REFRESH, Algorithm.HMAC256(adminRefreshSecretKey)
        );

        tokenExpirations = Map.of(
                TokenType.USER_ACCESS, 15 * 60 * 1000L, // 15 mins
                TokenType.USER_REFRESH, 7 * 24 * 60 * 60 * 1000L, // 7 days
                TokenType.ADMIN_ACCESS, 15 * 60 * 1000L,
                TokenType.ADMIN_REFRESH, 7 * 24 * 60 * 60 * 1000L
        );
    }

    public String createToken(String email, List<String> roles, TokenType type) {

        List<String> prefixedRoles = roles.stream()
                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .toList();

        return JWT.create()
                .withSubject(email)
                .withClaim("roles", prefixedRoles)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + tokenExpirations.get(type)))
                .sign(algorithms.get(type));
    }

    public String extractEmail(String token, TokenType type) {
        try {
            return JWT.require(algorithms.get(type))
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Invalid " + type.name().toLowerCase().replace('_', ' ') + " token", e);
        }
    }

    public List<String> extractRoles(String token, TokenType type) {
        try {
            DecodedJWT jwt = JWT.require(algorithms.get(type))
                    .build()
                    .verify(token);
            return jwt.getClaim("roles").asList(String.class);
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Failed to extract roles from token", e);
        }
    }

    public boolean isTokenExpired(String token, TokenType type) {
        try {
            return JWT.require(algorithms.get(type))
                    .build()
                    .verify(token)
                    .getExpiresAt()
                    .before(new Date());
        } catch (JWTVerificationException e) {
            return true;
        }
    }

    public TokenType detectTokenType(String token) {
        return detectTokenTypeX(token, null);
    }

    public TokenType detectTokenTypeX(String token, @Nullable String path) {
        TokenType detectedType = detectTokenTypeInternal(token);

        if (path != null && path.contains("/admin/") && !detectedType.name().startsWith("ADMIN_")) {
            throw new JWTVerificationException("Admin endpoint requires admin token");
        }

        if (path != null) {
            validateTokenForPath(detectedType, path);
        }
        return detectedType;
    }

    public TokenType detectTokenTypeInternal(String token) {
        for (TokenType adminType : List.of(TokenType.ADMIN_ACCESS, TokenType.ADMIN_REFRESH)) {
            try {
                JWT.require(algorithms.get(adminType)).build().verify(token);
                return adminType;
            } catch (JWTVerificationException ignored) {}
        }

        for (TokenType userType : List.of(TokenType.USER_ACCESS, TokenType.USER_REFRESH)) {
            try {
                JWT.require(algorithms.get(userType)).build().verify(token);
                return userType;
            } catch (JWTVerificationException ignored) {}
        }

        throw new RuntimeException("Invalid token type");
    }



    private void validateTokenForPath(TokenType tokenType, String path) {
        if (path.contains("/admin/") && !tokenType.name().startsWith("ADMIN_")) {
            throw new JWTVerificationException("Admin endpoint requires admin token");
        }

        if (path.contains("/refresh") && !tokenType.name().endsWith("_REFRESH")) {
            throw new JWTVerificationException("Refresh endpoint requires refresh token");
        }
    }
}