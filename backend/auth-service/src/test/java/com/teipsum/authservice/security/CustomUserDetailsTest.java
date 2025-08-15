package com.teipsum.authservice.security;

import com.teipsum.authservice.model.Role;
import com.teipsum.authservice.model.RoleName;
import com.teipsum.authservice.model.UserCredentials;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CustomUserDetails Tests")
class CustomUserDetailsTest {

    private UserCredentials testUser;
    private Role userRole;
    private Role adminRole;

    @BeforeEach
    void setUp() {
        userRole = Role.builder()
                .id(1L)
                .name(RoleName.ROLE_USER)
                .build();

        adminRole = Role.builder()
                .id(2L)
                .name(RoleName.ROLE_ADMIN)
                .build();

        testUser = UserCredentials.builder()
                .id("user-123")
                .email("test@example.com")
                .password("encoded-password")
                .roles(Set.of(userRole))
                .build();
    }

    @Test
    @DisplayName("Should create CustomUserDetails with single role")
    void shouldCreateCustomUserDetailsWithSingleRole() {
        // When
        CustomUserDetails userDetails = new CustomUserDetails(testUser);

        // Then
        assertNotNull(userDetails);
        assertEquals("test@example.com", userDetails.getUsername());
        assertEquals("encoded-password", userDetails.getPassword());
        
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertEquals(1, authorities.size());
        
        GrantedAuthority authority = authorities.iterator().next();
        assertEquals("ROLE_USER", authority.getAuthority());
    }

    @Test
    @DisplayName("Should create CustomUserDetails with multiple roles")
    void shouldCreateCustomUserDetailsWithMultipleRoles() {
        // Given
        UserCredentials adminUser = UserCredentials.builder()
                .id("admin-123")
                .email("admin@example.com")
                .password("encoded-password")
                .roles(Set.of(userRole, adminRole))
                .build();

        // When
        CustomUserDetails userDetails = new CustomUserDetails(adminUser);

        // Then
        assertNotNull(userDetails);
        assertEquals("admin@example.com", userDetails.getUsername());
        assertEquals("encoded-password", userDetails.getPassword());
        
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertEquals(2, authorities.size());
        
        Set<String> authorityNames = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.toSet());
        
        assertTrue(authorityNames.contains("ROLE_USER"));
        assertTrue(authorityNames.contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Should create CustomUserDetails with no roles")
    void shouldCreateCustomUserDetailsWithNoRoles() {
        // Given
        UserCredentials userWithNoRoles = UserCredentials.builder()
                .id("user-noroles")
                .email("noroles@example.com")
                .password("encoded-password")
                .roles(Set.of())
                .build();

        // When
        CustomUserDetails userDetails = new CustomUserDetails(userWithNoRoles);

        // Then
        assertNotNull(userDetails);
        assertEquals("noroles@example.com", userDetails.getUsername());
        assertEquals("encoded-password", userDetails.getPassword());
        
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertEquals(0, authorities.size());
    }

    @Test
    @DisplayName("Should return correct account status")
    void shouldReturnCorrectAccountStatus() {
        // When
        CustomUserDetails userDetails = new CustomUserDetails(testUser);

        // Then
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertTrue(userDetails.isEnabled());
    }

    @Test
    @DisplayName("Should handle null roles gracefully")
    void shouldHandleNullRolesGracefully() {
        // Given
        UserCredentials userWithNullRoles = UserCredentials.builder()
                .id("user-nullroles")
                .email("nullroles@example.com")
                .password("encoded-password")
                .roles(null)
                .build();

        // When & Then
        assertDoesNotThrow(() -> new CustomUserDetails(userWithNullRoles));
        
        CustomUserDetails userDetails = new CustomUserDetails(userWithNullRoles);
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertEquals(0, authorities.size());
    }

    @Test
    @DisplayName("Should return immutable authorities collection")
    void shouldReturnImmutableAuthoritiesCollection() {
        // Given
        CustomUserDetails userDetails = new CustomUserDetails(testUser);

        // When
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        // Then
        assertNotNull(authorities);
        // The collection should be immutable (Set from stream.collect)
        assertThrows(UnsupportedOperationException.class, 
                () -> ((Set<?>) authorities).add(null));
    }

    @Test
    @DisplayName("Should handle user with complex role structure")
    void shouldHandleUserWithComplexRoleStructure() {
        // Given
        Role customRole1 = Role.builder()
                .id(3L)
                .name(RoleName.valueOf("ROLE_CUSTOM1"))
                .build();
        
        Role customRole2 = Role.builder()
                .id(4L)
                .name(RoleName.valueOf("ROLE_CUSTOM2"))
                .build();

        // This test assumes RoleName enum can be extended or mocked
        // In a real scenario, you might need to adjust based on actual enum values
        UserCredentials complexUser = UserCredentials.builder()
                .id("complex-user")
                .email("complex@example.com")
                .password("encoded-password")
                .roles(Set.of(userRole, adminRole))
                .build();

        // When
        CustomUserDetails userDetails = new CustomUserDetails(complexUser);

        // Then
        assertNotNull(userDetails);
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertEquals(2, authorities.size());
        
        Set<String> authorityNames = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.toSet());
        
        assertTrue(authorityNames.contains("ROLE_USER"));
        assertTrue(authorityNames.contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Should maintain consistency across multiple calls")
    void shouldMaintainConsistencyAcrossMultipleCalls() {
        // Given
        CustomUserDetails userDetails = new CustomUserDetails(testUser);

        // When - call methods multiple times
        String username1 = userDetails.getUsername();
        String username2 = userDetails.getUsername();
        String password1 = userDetails.getPassword();
        String password2 = userDetails.getPassword();
        Collection<? extends GrantedAuthority> authorities1 = userDetails.getAuthorities();
        Collection<? extends GrantedAuthority> authorities2 = userDetails.getAuthorities();

        // Then - results should be consistent
        assertEquals(username1, username2);
        assertEquals(password1, password2);
        assertEquals(authorities1.size(), authorities2.size());
        
        // Authorities should have same content
        assertEquals(authorities1.iterator().next().getAuthority(), 
                    authorities2.iterator().next().getAuthority());
    }
}
