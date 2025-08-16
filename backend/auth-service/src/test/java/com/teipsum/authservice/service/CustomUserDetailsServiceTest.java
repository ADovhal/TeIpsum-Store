package com.teipsum.authservice.service;

import com.teipsum.authservice.model.Role;
import com.teipsum.authservice.model.RoleName;
import com.teipsum.authservice.model.UserCredentials;
import com.teipsum.authservice.repository.UserCredentialsRepository;
import com.teipsum.authservice.security.CustomUserDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CustomUserDetailsService Tests")
class CustomUserDetailsServiceTest {

    @Mock
    private UserCredentialsRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    private UserCredentials testUser;
    private Role userRole;
    private Role adminRole;

    @BeforeEach
    void setUp() {
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
    @DisplayName("Should load user by username successfully")
    void shouldLoadUserByUsernameSuccessfully() {
        // Given
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Then
        assertNotNull(userDetails);
        assertInstanceOf(CustomUserDetails.class, userDetails);
        assertEquals(email, userDetails.getUsername());
        assertEquals("encoded-password", userDetails.getPassword());
        
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should load user with correct authorities")
    void shouldLoadUserWithCorrectAuthorities() {
        // Given
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Then
        assertNotNull(userDetails);
        assertEquals(1, userDetails.getAuthorities().size());
        
        GrantedAuthority authority = userDetails.getAuthorities().iterator().next();
        assertEquals("ROLE_USER", authority.getAuthority());
        
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should load admin user with multiple authorities")
    void shouldLoadAdminUserWithMultipleAuthorities() {
        // Given
        String email = "admin@example.com";
        UserCredentials adminUser = UserCredentials.builder()
                .id("admin-123")
                .email(email)
                .password("encoded-password")
                .roles(Set.of(userRole, adminRole))
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(adminUser));

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Then
        assertNotNull(userDetails);
        assertEquals(2, userDetails.getAuthorities().size());
        
        Set<String> authorityNames = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.toSet());
        
        assertTrue(authorityNames.contains("ROLE_USER"));
        assertTrue(authorityNames.contains("ROLE_ADMIN"));
        
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should throw UsernameNotFoundException when user not found")
    void shouldThrowUsernameNotFoundExceptionWhenUserNotFound() {
        // Given
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When & Then
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(email)
        );

        assertEquals("User not found with email: " + email, exception.getMessage());
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should handle null email gracefully")
    void shouldHandleNullEmailGracefully() {
        // Given
        String email = null;
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(email));
        
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should handle empty email gracefully")
    void shouldHandleEmptyEmailGracefully() {
        // Given
        String email = "";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(email));
        
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should load user with no roles")
    void shouldLoadUserWithNoRoles() {
        // Given
        String email = "noroles@example.com";
        UserCredentials userWithNoRoles = UserCredentials.builder()
                .id("user-noroles")
                .email(email)
                .password("encoded-password")
                .roles(Set.of()) // Empty roles
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(userWithNoRoles));

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Then
        assertNotNull(userDetails);
        assertEquals(0, userDetails.getAuthorities().size());
        assertEquals(email, userDetails.getUsername());
        assertEquals("encoded-password", userDetails.getPassword());
        
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should maintain user credentials properties")
    void shouldMaintainUserCredentialsProperties() {
        // Given
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Then
        assertNotNull(userDetails);
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertTrue(userDetails.isEnabled());
        
        verify(userRepository).findByEmail(email);
    }
}
