package com.teipsum.authservice.service;

import com.teipsum.authservice.dto.AuthRequest;
import com.teipsum.authservice.dto.AuthResponse;
import com.teipsum.authservice.dto.RegisterRequest;
import com.teipsum.authservice.model.*;
import com.teipsum.authservice.repository.AdminRepository;
import com.teipsum.authservice.repository.RoleRepository;
import com.teipsum.authservice.repository.UserCredentialsRepository;
import com.teipsum.authservice.security.JwtUtil;
import com.teipsum.authservice.security.SecurityContextService;
import com.teipsum.shared.event.UserRegisteredEvent;
import com.teipsum.shared.event.UserLoggedInEvent;
import com.teipsum.shared.exceptions.EmailExistsException;
import com.teipsum.shared.exceptions.RoleNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock
    private UserCredentialsRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private JwtUtil jwtUtil;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Mock
    private RoleRepository roleRepository;
    
    @Mock
    private AdminRepository adminRepository;
    
    @Mock
    private SecurityContextService securityContext;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private AuthRequest authRequest;
    private UserCredentials testUser;
    private Role userRole;
    private Role adminRole;

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

        userRole = Role.builder()
                .id(1L)
                .roleValue(RoleName.ROLE_USER.getValue())
                .build();

        adminRole = Role.builder()
                .id(2L)
                .roleValue(RoleName.ROLE_ADMIN.getValue())
                .build();

        testUser = UserCredentials.builder()
                .id("user-123")
                .email("test@example.com")
                .password("encoded-password")
                .roles(Set.of(userRole))
                .build();
    }

    @Test
    @DisplayName("Should register user successfully")
    void shouldRegisterUserSuccessfully() {
        // Given
        when(userRepository.existsByEmail(registerRequest.email())).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_USER)).thenReturn(userRole);
        when(passwordEncoder.encode(registerRequest.password())).thenReturn("encoded-password");
        when(userRepository.save(any(UserCredentials.class))).thenReturn(testUser);
        when(jwtUtil.createToken(anyString(), anyString(), anyList(), eq(TokenType.USER_ACCESS)))
                .thenReturn("access-token");
        when(jwtUtil.createToken(anyString(), anyString(), anyList(), eq(TokenType.USER_REFRESH)))
                .thenReturn("refresh-token");
        when(adminRepository.existsByUser_Id(testUser.getId())).thenReturn(false);

        // When
        AuthResponse response = authService.registerUser(registerRequest);

        // Then
        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());

        verify(userRepository).existsByEmail(registerRequest.email());
        verify(userRepository).save(any(UserCredentials.class));
        verify(kafkaTemplate).send(eq("user-registered"), any(UserRegisteredEvent.class));
    }

    @Test
    @DisplayName("Should throw EmailExistsException when email already exists")
    void shouldThrowEmailExistsExceptionWhenEmailExists() {
        // Given
        when(userRepository.existsByEmail(registerRequest.email())).thenReturn(true);

        // When & Then
        assertThrows(EmailExistsException.class, () -> authService.registerUser(registerRequest));
        verify(userRepository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), any());
    }

    @Test
    @DisplayName("Should register admin successfully")
    void shouldRegisterAdminSuccessfully() {
        // Given
        String creatorId = "admin-123";
        UserCredentials adminUser = UserCredentials.builder()
                .id("admin-456")
                .email("admin@example.com")
                .password("encoded-password")
                .roles(Set.of(adminRole))
                .build();

        when(userRepository.existsByEmail(registerRequest.email())).thenReturn(false);
        when(securityContext.getCurrentUserId()).thenReturn(Optional.of(creatorId));
        when(roleRepository.findByName(RoleName.ROLE_ADMIN)).thenReturn(adminRole);
        when(passwordEncoder.encode(registerRequest.password())).thenReturn("encoded-password");
        when(userRepository.save(any(UserCredentials.class))).thenReturn(adminUser);
        when(jwtUtil.createToken(anyString(), anyString(), anyList(), eq(TokenType.ADMIN_ACCESS)))
                .thenReturn("admin-access-token");
        when(jwtUtil.createToken(anyString(), anyString(), anyList(), eq(TokenType.ADMIN_REFRESH)))
                .thenReturn("admin-refresh-token");
        when(adminRepository.existsByUser_Id(adminUser.getId())).thenReturn(true);

        // When
        AuthResponse response = authService.registerAdmin(registerRequest);

        // Then
        assertNotNull(response);
        assertEquals("admin-access-token", response.getAccessToken());
        assertEquals("admin-refresh-token", response.getRefreshToken());

        verify(userRepository).save(any(UserCredentials.class));
        verify(kafkaTemplate).send(eq("user-registered"), any(UserRegisteredEvent.class));
    }

    @Test
    @DisplayName("Should throw AccessDeniedException when admin not authenticated")
    void shouldThrowAccessDeniedExceptionWhenAdminNotAuthenticated() {
        // Given
        when(userRepository.existsByEmail(registerRequest.email())).thenReturn(false);
        when(securityContext.getCurrentUserId()).thenReturn(Optional.empty());

        // When & Then
        assertThrows(AccessDeniedException.class, () -> authService.registerAdmin(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should login user successfully")
    void shouldLoginUserSuccessfully() {
        // Given
        when(userRepository.findByEmail(authRequest.email())).thenReturn(Optional.of(testUser));
        when(jwtUtil.createToken(anyString(), anyString(), anyList(), eq(TokenType.USER_ACCESS)))
                .thenReturn("access-token");
        when(jwtUtil.createToken(anyString(), anyString(), anyList(), eq(TokenType.USER_REFRESH)))
                .thenReturn("refresh-token");
        when(adminRepository.existsByUser_Id(testUser.getId())).thenReturn(false);

        // When
        AuthResponse response = authService.login(authRequest);

        // Then
        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(kafkaTemplate).send(eq("user-login"), any(UserLoggedInEvent.class));
    }

    @Test
    @DisplayName("Should throw RuntimeException when user not found during login")
    void shouldThrowRuntimeExceptionWhenUserNotFoundDuringLogin() {
        // Given
        when(userRepository.findByEmail(authRequest.email())).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> authService.login(authRequest));
        verify(kafkaTemplate).send(eq("user-login"), any(UserLoggedInEvent.class));
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when authentication fails")
    void shouldThrowBadCredentialsExceptionWhenAuthenticationFails() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // When & Then
        assertThrows(BadCredentialsException.class, () -> authService.login(authRequest));
        verify(kafkaTemplate, never()).send(anyString(), any());
    }

    @Test
    @DisplayName("Should generate admin tokens for admin user")
    void shouldGenerateAdminTokensForAdminUser() {
        // Given
        UserCredentials adminUser = UserCredentials.builder()
                .id("admin-123")
                .email("admin@example.com")
                .password("encoded-password")
                .roles(Set.of(adminRole))
                .build();

        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(adminUser));
        when(adminRepository.existsByUser_Id(adminUser.getId())).thenReturn(true);
        when(jwtUtil.createToken(anyString(), anyString(), anyList(), eq(TokenType.ADMIN_ACCESS)))
                .thenReturn("admin-access-token");
        when(jwtUtil.createToken(anyString(), anyString(), anyList(), eq(TokenType.ADMIN_REFRESH)))
                .thenReturn("admin-refresh-token");

        AuthRequest adminAuthRequest = new AuthRequest("admin@example.com", "password123");

        // When
        AuthResponse response = authService.login(adminAuthRequest);

        // Then
        assertNotNull(response);
        assertEquals("admin-access-token", response.getAccessToken());
        assertEquals("admin-refresh-token", response.getRefreshToken());

        verify(jwtUtil).createToken(adminUser.getId(), adminUser.getEmail(), 
                List.of("ROLE_ADMIN"), TokenType.ADMIN_ACCESS);
        verify(jwtUtil).createToken(adminUser.getId(), adminUser.getEmail(), 
                List.of("ROLE_ADMIN"), TokenType.ADMIN_REFRESH);
    }

    @Test
    @DisplayName("Should delete user credentials successfully")
    void shouldDeleteUserCredentialsSuccessfully() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        doNothing().when(userRepository).delete(testUser);

        // When
        authService.deleteUserCredentials(userId, email);

        // Then
        verify(userRepository).findById(userId);
        verify(userRepository).delete(testUser);
    }

    @Test
    @DisplayName("Should handle user not found during deletion gracefully")
    void shouldHandleUserNotFoundDuringDeletionGracefully() {
        // Given
        String userId = "non-existent-user";
        String email = "test@example.com";
        
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then - should not throw exception
        assertDoesNotThrow(() -> authService.deleteUserCredentials(userId, email));

        verify(userRepository).findById(userId);
        verify(userRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Should throw exception when email mismatch during deletion")
    void shouldThrowExceptionWhenEmailMismatchDuringDeletion() {
        // Given
        String userId = "user-123";
        String wrongEmail = "wrong@example.com";
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // When & Then
        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> authService.deleteUserCredentials(userId, wrongEmail));

        assertEquals("Email mismatch during user deletion", exception.getMessage());
        verify(userRepository).findById(userId);
        verify(userRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Should delete admin user credentials successfully")
    void shouldDeleteAdminUserCredentialsSuccessfully() {
        // Given
        String adminId = "admin-123";
        String adminEmail = "admin@example.com";
        
        UserCredentials adminUser = UserCredentials.builder()
                .id(adminId)
                .email(adminEmail)
                .password("encoded-password")
                .roles(Set.of(adminRole))
                .build();
        
        when(userRepository.findById(adminId)).thenReturn(Optional.of(adminUser));
        doNothing().when(userRepository).delete(adminUser);

        // When
        authService.deleteUserCredentials(adminId, adminEmail);

        // Then
        verify(userRepository).findById(adminId);
        verify(userRepository).delete(adminUser);
    }

    @Test
    @DisplayName("Should handle null email during deletion")
    void shouldHandleNullEmailDuringDeletion() {
        // Given
        String userId = "user-123";
        String nullEmail = null;
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // When & Then
        assertThrows(IllegalStateException.class,
                () -> authService.deleteUserCredentials(userId, nullEmail));

        verify(userRepository).findById(userId);
        verify(userRepository, never()).delete(any());
    }
}
