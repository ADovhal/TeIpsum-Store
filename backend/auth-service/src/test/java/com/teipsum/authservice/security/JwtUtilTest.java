package com.teipsum.authservice.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.teipsum.authservice.model.TokenType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtUtil Tests")
class JwtUtilTest {

    private JwtUtil jwtUtil;
    private final String accessSecret = "access-secret-key-for-testing-purposes-must-be-long";
    private final String refreshSecret = "refresh-secret-key-for-testing-purposes-must-be-long";
    private final String adminSecret = "admin-secret-key-for-testing-purposes-must-be-long";
    private final String adminRefreshSecret = "admin-refresh-secret-key-for-testing-purposes-must-be-long";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(accessSecret, refreshSecret, adminSecret, adminRefreshSecret);
    }

    @Test
    @DisplayName("Should create user access token successfully")
    void shouldCreateUserAccessTokenSuccessfully() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");

        // When
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // Then
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    @DisplayName("Should create admin access token successfully")
    void shouldCreateAdminAccessTokenSuccessfully() {
        // Given
        String userId = "admin-123";
        String email = "admin@example.com";
        List<String> roles = List.of("ROLE_ADMIN");

        // When
        String token = jwtUtil.createToken(userId, email, roles, TokenType.ADMIN_ACCESS);

        // Then
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    @DisplayName("Should create refresh token successfully")
    void shouldCreateRefreshTokenSuccessfully() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");

        // When
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_REFRESH);

        // Then
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    @DisplayName("Should add ROLE_ prefix to roles without prefix")
    void shouldAddRolePrefixToRolesWithoutPrefix() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("USER", "ADMIN");

        // When
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // Then
        assertNotNull(token);
        List<String> extractedRoles = jwtUtil.extractRoles(token, TokenType.USER_ACCESS);
        assertTrue(extractedRoles.contains("ROLE_USER"));
        assertTrue(extractedRoles.contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Should not add prefix to roles that already have ROLE_ prefix")
    void shouldNotAddPrefixToRolesWithPrefix() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER", "ROLE_ADMIN");

        // When
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // Then
        assertNotNull(token);
        List<String> extractedRoles = jwtUtil.extractRoles(token, TokenType.USER_ACCESS);
        assertTrue(extractedRoles.contains("ROLE_USER"));
        assertTrue(extractedRoles.contains("ROLE_ADMIN"));
        assertEquals(2, extractedRoles.size());
    }

    @Test
    @DisplayName("Should extract user ID from token successfully")
    void shouldExtractUserIdFromTokenSuccessfully() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // When
        String extractedUserId = jwtUtil.extractUserId(token, TokenType.USER_ACCESS);

        // Then
        assertEquals(userId, extractedUserId);
    }

    @Test
    @DisplayName("Should extract email from token successfully")
    void shouldExtractEmailFromTokenSuccessfully() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // When
        String extractedEmail = jwtUtil.extractEmail(token, TokenType.USER_ACCESS);

        // Then
        assertEquals(email, extractedEmail);
    }

    @Test
    @DisplayName("Should extract roles from token successfully")
    void shouldExtractRolesFromTokenSuccessfully() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER", "ROLE_ADMIN");
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // When
        List<String> extractedRoles = jwtUtil.extractRoles(token, TokenType.USER_ACCESS);

        // Then
        assertEquals(2, extractedRoles.size());
        assertTrue(extractedRoles.contains("ROLE_USER"));
        assertTrue(extractedRoles.contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Should throw exception when extracting from token with wrong type")
    void shouldThrowExceptionWhenExtractingFromTokenWithWrongType() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // When & Then
        assertThrows(RuntimeException.class, 
                () -> jwtUtil.extractUserId(token, TokenType.USER_REFRESH));
        assertThrows(RuntimeException.class, 
                () -> jwtUtil.extractEmail(token, TokenType.USER_REFRESH));
        assertThrows(RuntimeException.class, 
                () -> jwtUtil.extractRoles(token, TokenType.USER_REFRESH));
    }

    @Test
    @DisplayName("Should detect token is not expired for fresh token")
    void shouldDetectTokenIsNotExpiredForFreshToken() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // When
        boolean isExpired = jwtUtil.isTokenExpired(token, TokenType.USER_ACCESS);

        // Then
        assertFalse(isExpired);
    }

    @Test
    @DisplayName("Should detect token type correctly")
    void shouldDetectTokenTypeCorrectly() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        
        String userAccessToken = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);
        String userRefreshToken = jwtUtil.createToken(userId, email, roles, TokenType.USER_REFRESH);
        String adminAccessToken = jwtUtil.createToken(userId, email, List.of("ROLE_ADMIN"), TokenType.ADMIN_ACCESS);
        String adminRefreshToken = jwtUtil.createToken(userId, email, List.of("ROLE_ADMIN"), TokenType.ADMIN_REFRESH);

        // When & Then
        assertEquals(TokenType.USER_ACCESS, jwtUtil.detectTokenType(userAccessToken));
        assertEquals(TokenType.USER_REFRESH, jwtUtil.detectTokenType(userRefreshToken));
        assertEquals(TokenType.ADMIN_ACCESS, jwtUtil.detectTokenType(adminAccessToken));
        assertEquals(TokenType.ADMIN_REFRESH, jwtUtil.detectTokenType(adminRefreshToken));
    }

    @Test
    @DisplayName("Should throw exception for invalid token when detecting type")
    void shouldThrowExceptionForInvalidTokenWhenDetectingType() {
        // Given
        String invalidToken = "invalid.jwt.token";

        // When & Then
        assertThrows(JWTVerificationException.class, 
                () -> jwtUtil.detectTokenType(invalidToken));
    }

    @Test
    @DisplayName("Should verify and decode token successfully")
    void shouldVerifyAndDecodeTokenSuccessfully() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // When
        DecodedJWT decodedJWT = jwtUtil.verifyAndDecodeToken(token, TokenType.USER_ACCESS);

        // Then
        assertNotNull(decodedJWT);
        assertEquals(email, decodedJWT.getSubject());
        assertEquals(userId, decodedJWT.getClaim("userId").asString());
        assertEquals(roles, decodedJWT.getClaim("roles").asList(String.class));
    }

    @Test
    @DisplayName("Should throw exception when verifying token with wrong type")
    void shouldThrowExceptionWhenVerifyingTokenWithWrongType() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // When & Then
        assertThrows(JWTVerificationException.class,
                () -> jwtUtil.verifyAndDecodeToken(token, TokenType.USER_REFRESH));
    }

    @Test
    @DisplayName("Should detect token type with path validation for admin endpoints")
    void shouldDetectTokenTypeWithPathValidationForAdminEndpoints() {
        // Given
        String userId = "admin-123";
        String email = "admin@example.com";
        List<String> roles = List.of("ROLE_ADMIN");
        String adminToken = jwtUtil.createToken(userId, email, roles, TokenType.ADMIN_ACCESS);
        String userToken = jwtUtil.createToken(userId, email, List.of("ROLE_USER"), TokenType.USER_ACCESS);

        // When & Then
        assertEquals(TokenType.ADMIN_ACCESS, 
                jwtUtil.detectTokenTypeX(adminToken, "/api/admin/products"));
        
        assertThrows(JWTVerificationException.class,
                () -> jwtUtil.detectTokenTypeX(userToken, "/api/admin/products"));
    }

    @Test
    @DisplayName("Should detect token type with path validation for refresh endpoints")
    void shouldDetectTokenTypeWithPathValidationForRefreshEndpoints() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String refreshToken = jwtUtil.createToken(userId, email, roles, TokenType.USER_REFRESH);
        String accessToken = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // When & Then
        assertEquals(TokenType.USER_REFRESH, 
                jwtUtil.detectTokenTypeX(refreshToken, "/api/auth/refresh"));
        
        assertThrows(JWTVerificationException.class,
                () -> jwtUtil.detectTokenTypeX(accessToken, "/api/auth/refresh"));
    }

    @Test
    @DisplayName("Should detect token type internal correctly")
    void shouldDetectTokenTypeInternalCorrectly() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        String adminToken = jwtUtil.createToken(userId, email, List.of("ROLE_ADMIN"), TokenType.ADMIN_ACCESS);
        String userToken = jwtUtil.createToken(userId, email, List.of("ROLE_USER"), TokenType.USER_ACCESS);

        // When & Then
        assertEquals(TokenType.ADMIN_ACCESS, jwtUtil.detectTokenTypeInternal(adminToken));
        assertEquals(TokenType.USER_ACCESS, jwtUtil.detectTokenTypeInternal(userToken));
    }

    @Test
    @DisplayName("Should throw exception for completely invalid token")
    void shouldThrowExceptionForCompletelyInvalidToken() {
        // Given
        String invalidToken = "completely.invalid.token";

        // When & Then
        assertThrows(RuntimeException.class, 
                () -> jwtUtil.detectTokenTypeInternal(invalidToken));
    }

    @Test
    @DisplayName("Should handle token expiration correctly")
    void shouldHandleTokenExpirationCorrectly() throws InterruptedException {
        // Given - create a token and wait for it to potentially expire
        String userId = "user-123";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String token = jwtUtil.createToken(userId, email, roles, TokenType.USER_ACCESS);

        // When - check if token is expired immediately (should not be)
        boolean isExpiredImmediately = jwtUtil.isTokenExpired(token, TokenType.USER_ACCESS);

        // Then
        assertFalse(isExpiredImmediately);
        
        // When - check with invalid token type
        boolean isExpiredWithWrongType = jwtUtil.isTokenExpired(token, TokenType.USER_REFRESH);
        
        // Then - should return true for invalid verification
        assertTrue(isExpiredWithWrongType);
    }
}
