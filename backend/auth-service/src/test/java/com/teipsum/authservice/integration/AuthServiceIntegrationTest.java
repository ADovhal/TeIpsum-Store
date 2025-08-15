package com.teipsum.authservice.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teipsum.authservice.dto.AuthRequest;
import com.teipsum.authservice.dto.RegisterRequest;
import com.teipsum.authservice.model.Role;
import com.teipsum.authservice.model.RoleName;
import com.teipsum.authservice.model.UserCredentials;
import com.teipsum.authservice.repository.RoleRepository;
import com.teipsum.authservice.repository.UserCredentialsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("Auth Service Integration Tests")
class AuthServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserCredentialsRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();

        // Ensure roles exist
        if (!roleRepository.existsByName(RoleName.ROLE_USER)) {
            roleRepository.save(Role.builder().name(RoleName.ROLE_USER).build());
        }
        if (!roleRepository.existsByName(RoleName.ROLE_ADMIN)) {
            roleRepository.save(Role.builder().name(RoleName.ROLE_ADMIN).build());
        }
    }

    @Test
    @DisplayName("Should register new user successfully")
    void shouldRegisterNewUserSuccessfully() throws Exception {
        // Given
        RegisterRequest registerRequest = new RegisterRequest(
                "newuser@example.com",
                "password123",
                "John",
                "Doe",
                "+1234567890",
                LocalDate.of(1990, 1, 1)
        );

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(header().exists("Set-Cookie"));

        // Verify user was created in database
        assertTrue(userRepository.existsByEmail("newuser@example.com"));
    }

    @Test
    @DisplayName("Should return conflict when registering existing user")
    void shouldReturnConflictWhenRegisteringExistingUser() throws Exception {
        // Given - create existing user
        UserCredentials existingUser = UserCredentials.builder()
                .email("existing@example.com")
                .password(passwordEncoder.encode("password123"))
                .build();
        userRepository.save(existingUser);

        RegisterRequest registerRequest = new RegisterRequest(
                "existing@example.com",
                "password123",
                "John",
                "Doe",
                "+1234567890",
                LocalDate.of(1990, 1, 1)
        );

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @DisplayName("Should login existing user successfully")
    void shouldLoginExistingUserSuccessfully() throws Exception {
        // Given - create existing user
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER);
        UserCredentials existingUser = UserCredentials.builder()
                .email("loginuser@example.com")
                .password(passwordEncoder.encode("password123"))
                .build();
        existingUser.addRole(userRole);
        userRepository.save(existingUser);

        AuthRequest authRequest = new AuthRequest("loginuser@example.com", "password123");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpected(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(header().exists("Set-Cookie"));
    }

    @Test
    @DisplayName("Should return unauthorized for invalid credentials")
    void shouldReturnUnauthorizedForInvalidCredentials() throws Exception {
        // Given
        AuthRequest authRequest = new AuthRequest("nonexistent@example.com", "wrongpassword");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid credentials"));
    }

    @Test
    @DisplayName("Should return unauthorized for wrong password")
    void shouldReturnUnauthorizedForWrongPassword() throws Exception {
        // Given - create existing user
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER);
        UserCredentials existingUser = UserCredentials.builder()
                .email("testuser@example.com")
                .password(passwordEncoder.encode("correctpassword"))
                .build();
        existingUser.addRole(userRole);
        userRepository.save(existingUser);

        AuthRequest authRequest = new AuthRequest("testuser@example.com", "wrongpassword");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid credentials"));
    }

    @Test
    @DisplayName("Should validate registration request fields")
    void shouldValidateRegistrationRequestFields() throws Exception {
        // Given - invalid request with missing required fields
        RegisterRequest invalidRequest = new RegisterRequest(
                "", // empty email
                "123", // short password
                "",   // empty name
                "",   // empty surname
                "",   // empty phone
                null  // null date
        );

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should validate login request fields")
    void shouldValidateLoginRequestFields() throws Exception {
        // Given - invalid request with missing fields
        AuthRequest invalidRequest = new AuthRequest("", "");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle malformed JSON gracefully")
    void shouldHandleMalformedJsonGracefully() throws Exception {
        // Given - malformed JSON
        String malformedJson = "{\"email\":\"test@example.com\",\"password\":}";

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should require CSRF token")
    void shouldRequireCsrfToken() throws Exception {
        // Given
        RegisterRequest registerRequest = new RegisterRequest(
                "csrf@example.com",
                "password123",
                "John",
                "Doe",
                "+1234567890",
                LocalDate.of(1990, 1, 1)
        );

        // When & Then - without CSRF token
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should handle concurrent registration attempts")
    void shouldHandleConcurrentRegistrationAttempts() throws Exception {
        // Given
        RegisterRequest registerRequest = new RegisterRequest(
                "concurrent@example.com",
                "password123",
                "John",
                "Doe",
                "+1234567890",
                LocalDate.of(1990, 1, 1)
        );

        // When - first request should succeed
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // Then - second request should fail
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").exists());
    }
}
