package com.dovhal.authservice.security;

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

// package com.dovhal.authservice.security;


// import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.security.oauth2.jwt.*;
// import org.springframework.stereotype.Component;
// import java.time.Instant;
// import java.time.temporal.ChronoUnit;
// import java.util.List;
// import java.util.function.Function;

// @Component
// public class JwtUtil {
//     private final JwtEncoder accessTokenEncoder;
//     private final JwtEncoder refreshTokenEncoder;
//     private final JwtDecoder accessTokenDecoder;
//     private final JwtDecoder refreshTokenDecoder;

//     public JwtUtil(
//         @Qualifier("accessTokenEncoder") JwtEncoder accessTokenEncoder,
//         @Qualifier("refreshTokenEncoder") JwtEncoder refreshTokenEncoder,
//         @Qualifier("accessTokenDecoder") JwtDecoder accessTokenDecoder,
//         @Qualifier("refreshTokenDecoder") JwtDecoder refreshTokenDecoder
//     ) {
//         this.accessTokenEncoder = accessTokenEncoder;
//         this.refreshTokenEncoder = refreshTokenEncoder;
//         this.accessTokenDecoder = accessTokenDecoder;
//         this.refreshTokenDecoder = refreshTokenDecoder;
//     }

//     public String createAccessToken(String email, List<String> roles) {
//         try {
//             JwtClaimsSet claims = JwtClaimsSet.builder()
//                 .issuer("auth-service")
//                 .issuedAt(Instant.now())
//                 .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
//                 .subject(email)
//                 .claim("roles", roles)
//                 .build();

//             return accessTokenEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
//         } catch (JwtEncodingException e) {
//             throw new RuntimeException("Failed to generate access token", e);
//         }
//     }
    
//     public String createRefreshToken(String email) {
//         Instant now = Instant.now();
//         JwtClaimsSet claims = JwtClaimsSet.builder()
//             .issuer("auth-service")
//             .issuedAt(now)
//             .expiresAt(now.plusSeconds(7 * 24 * 60 * 60)) // 7 дней
//             .subject(email)
//             .build();
//         return refreshTokenEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
//     }

//     public String extractEmailFromAccessToken(String token) {
//         return extractClaim(token, accessTokenDecoder, Jwt::getSubject);
//     }

//     public String extractEmailFromRefreshToken(String token) {
//         return extractClaim(token, refreshTokenDecoder, Jwt::getSubject);
//     }

//     public boolean isAccessTokenExpired(String token) {
//         return isTokenExpired(token, accessTokenDecoder);
//     }

//     public boolean isRefreshTokenExpired(String token) {
//         return isTokenExpired(token, refreshTokenDecoder);
//     }

//     private <T> T extractClaim(String token, JwtDecoder decoder, Function<Jwt, T> claimsResolver) {
//         try {
//             Jwt jwt = decoder.decode(token);
//             return claimsResolver.apply(jwt);
//         } catch (JwtException e) {
//             throw new RuntimeException("Invalid token", e);
//         }
//     }

//     private boolean isTokenExpired(String token, JwtDecoder decoder) {
//         try {
//             Jwt jwt = decoder.decode(token);
//             Instant expiresAt = jwt.getExpiresAt();
//             return expiresAt == null || expiresAt.isBefore(Instant.now());
//         } catch (JwtException e) {
//             return true;
//         }
//     }

//     public List<String> extractRoles(String token) {
//         Jwt jwt = accessTokenDecoder.decode(token);
//         return jwt.getClaim("roles");
//     }
// }