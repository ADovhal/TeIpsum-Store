package com.teipsum.authservice.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teipsum.authservice.dto.AuthRequest;
import com.teipsum.authservice.dto.AuthResponse;
import com.teipsum.authservice.dto.RegisterRequest;
import com.teipsum.authservice.model.TokenType;
import com.teipsum.authservice.security.JwtUtil;
import com.teipsum.authservice.service.AuthService;
import com.teipsum.shared.exceptions.EmailExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("AuthController Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtil jwtUtil;

    private RegisterRequest registerRequest;
    private AuthRequest authRequest;
    private AuthResponse authResponse;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest(
                "test@example.com",
                "password123",
                "John",
                "Doe",
                "+1234567890",
                LocalDate.of(1990, 1, 1)
        );

        authRequest = new AuthRequest("test@example.com", "password123");

        authResponse = new AuthResponse("access-token", "refresh-token");
    }

    @Test
    @DisplayName("Should register user successfully")
    void shouldRegisterUserSuccessfully() throws Exception {
        // Given
        when(authService.registerUser(any(RegisterRequest.class))).thenReturn(authResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(header().exists("Set-Cookie"));

        verify(authService).registerUser(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("Should return conflict when email already exists during registration")
    void shouldReturnConflictWhenEmailAlreadyExists() throws Exception {
        // Given
        when(authService.registerUser(any(RegisterRequest.class)))
                .thenThrow(new EmailExistsException("test@example.com"));

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").exists());

        verify(authService).registerUser(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("Should register admin successfully")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldRegisterAdminSuccessfully() throws Exception {
        // Given
        when(authService.registerAdmin(any(RegisterRequest.class))).thenReturn(authResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/register_admin")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token"));

        verify(authService).registerAdmin(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("Should return forbidden when non-admin tries to register admin")
    @WithMockUser(authorities = {"ROLE_USER"})
    void shouldReturnForbiddenWhenNonAdminTriesToRegisterAdmin() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/auth/register_admin")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isForbidden());

        verify(authService, never()).registerAdmin(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("Should return conflict when admin registration fails")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldReturnConflictWhenAdminRegistrationFails() throws Exception {
        // Given
        when(authService.registerAdmin(any(RegisterRequest.class)))
                .thenThrow(new AccessDeniedException("Admin not authenticated"));

        // When & Then
        mockMvc.perform(post("/api/auth/register_admin")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").exists());

        verify(authService).registerAdmin(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("Should login user successfully")
    void shouldLoginUserSuccessfully() throws Exception {
        // Given
        when(authService.login(any(AuthRequest.class))).thenReturn(authResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(header().exists("Set-Cookie"));

        verify(authService).login(any(AuthRequest.class));
    }

    @Test
    @DisplayName("Should return unauthorized when login fails")
    void shouldReturnUnauthorizedWhenLoginFails() throws Exception {
        // Given
        when(authService.login(any(AuthRequest.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid credentials"));

        verify(authService).login(any(AuthRequest.class));
    }

    @Test
    @DisplayName("Should refresh access token successfully")
    void shouldRefreshAccessTokenSuccessfully() throws Exception {
        // Given
        String refreshToken = "valid-refresh-token";
        String newAccessToken = "new-access-token";
        String newRefreshToken = "new-refresh-token";

        when(jwtUtil.detectTokenType(refreshToken)).thenReturn(TokenType.USER_REFRESH);
        when(jwtUtil.isTokenExpired(refreshToken, TokenType.USER_REFRESH)).thenReturn(false);
        when(jwtUtil.extractUserId(refreshToken, TokenType.USER_REFRESH)).thenReturn("user-123");
        when(jwtUtil.extractEmail(refreshToken, TokenType.USER_REFRESH)).thenReturn("test@example.com");
        when(jwtUtil.extractRoles(refreshToken, TokenType.USER_REFRESH)).thenReturn(List.of("ROLE_USER"));
        when(jwtUtil.createToken(anyString(), anyString(), any(List.class), eq(TokenType.USER_ACCESS)))
                .thenReturn(newAccessToken);
        when(jwtUtil.createToken(anyString(), anyString(), any(List.class), eq(TokenType.USER_REFRESH)))
                .thenReturn(newRefreshToken);

        // When & Then
        mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf())
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", refreshToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value(newAccessToken))
                .andExpect(header().exists("Set-Cookie"));

        verify(jwtUtil).detectTokenType(refreshToken);
        verify(jwtUtil).isTokenExpired(refreshToken, TokenType.USER_REFRESH);
        verify(jwtUtil).createToken(anyString(), anyString(), any(List.class), eq(TokenType.USER_ACCESS));
    }

    @Test
    @DisplayName("Should return unauthorized when refresh token is missing")
    void shouldReturnUnauthorizedWhenRefreshTokenIsMissing() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Refresh token is missing"));
    }

    @Test
    @DisplayName("Should return unauthorized when refresh token is expired")
    void shouldReturnUnauthorizedWhenRefreshTokenIsExpired() throws Exception {
        // Given
        String expiredRefreshToken = "expired-refresh-token";

        when(jwtUtil.detectTokenType(expiredRefreshToken)).thenReturn(TokenType.USER_REFRESH);
        when(jwtUtil.isTokenExpired(expiredRefreshToken, TokenType.USER_REFRESH)).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf())
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", expiredRefreshToken)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Refresh token expired"));

        verify(jwtUtil).isTokenExpired(expiredRefreshToken, TokenType.USER_REFRESH);
    }

    @Test
    @DisplayName("Should return unauthorized when refresh token is not a refresh token")
    void shouldReturnUnauthorizedWhenTokenIsNotRefreshToken() throws Exception {
        // Given
        String accessToken = "access-token";

        when(jwtUtil.detectTokenType(accessToken)).thenReturn(TokenType.USER_ACCESS);

        // When & Then
        mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf())
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", accessToken)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").exists());

        verify(jwtUtil).detectTokenType(accessToken);
    }

    @Test
    @DisplayName("Should handle admin refresh token")
    void shouldHandleAdminRefreshToken() throws Exception {
        // Given
        String adminRefreshToken = "admin-refresh-token";
        String newAccessToken = "new-admin-access-token";
        String newRefreshToken = "new-admin-refresh-token";

        when(jwtUtil.detectTokenType(adminRefreshToken)).thenReturn(TokenType.ADMIN_REFRESH);
        when(jwtUtil.isTokenExpired(adminRefreshToken, TokenType.ADMIN_REFRESH)).thenReturn(false);
        when(jwtUtil.extractUserId(adminRefreshToken, TokenType.ADMIN_REFRESH)).thenReturn("admin-123");
        when(jwtUtil.extractEmail(adminRefreshToken, TokenType.ADMIN_REFRESH)).thenReturn("admin@example.com");
        when(jwtUtil.extractRoles(adminRefreshToken, TokenType.ADMIN_REFRESH)).thenReturn(List.of("ROLE_ADMIN"));
        when(jwtUtil.createToken(anyString(), anyString(), any(List.class), eq(TokenType.ADMIN_ACCESS)))
                .thenReturn(newAccessToken);
        when(jwtUtil.createToken(anyString(), anyString(), any(List.class), eq(TokenType.ADMIN_REFRESH)))
                .thenReturn(newRefreshToken);

        // When & Then
        mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf())
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", adminRefreshToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value(newAccessToken))
                .andExpect(header().exists("Set-Cookie"));

        verify(jwtUtil).createToken(anyString(), anyString(), any(List.class), eq(TokenType.ADMIN_ACCESS));
    }
}
