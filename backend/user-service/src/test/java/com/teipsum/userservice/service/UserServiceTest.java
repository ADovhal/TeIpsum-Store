package com.teipsum.userservice.service;

import com.teipsum.shared.event.UserDeletionCompletedEvent;
import com.teipsum.shared.event.UserDeletionRequestedEvent;
import com.teipsum.shared.exceptions.ConflictException;
import com.teipsum.shared.exceptions.NotFoundException;
import com.teipsum.userservice.dto.UserDeletionInfoResponse;
import com.teipsum.userservice.model.UserProfile;
import com.teipsum.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @InjectMocks
    private UserService userService;

    private UserProfile testUserProfile;

    @BeforeEach
    void setUp() {
        testUserProfile = new UserProfile();
        testUserProfile.setId("user-123");
        testUserProfile.setEmail("test@example.com");
        testUserProfile.setName("John");
        testUserProfile.setSurname("Doe");
        testUserProfile.setPhone("+1234567890");
        testUserProfile.setDob(LocalDate.of(1990, 1, 1));
        testUserProfile.setIsAdmin(false);
        testUserProfile.setJoinDate(LocalDate.now());
        testUserProfile.setLastLoginDate(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should create user profile successfully")
    void shouldCreateUserProfileSuccessfully() {
        // Given
        String userId = "user-123";
        String email = "test@example.com";
        String name = "John";
        String surname = "Doe";
        String phone = "+1234567890";
        LocalDate dob = LocalDate.of(1990, 1, 1);
        Boolean isAdmin = false;

        when(userRepository.existsById(userId)).thenReturn(false);
        when(userRepository.save(any(UserProfile.class))).thenReturn(testUserProfile);

        // When
        userService.createUserProfile(userId, email, name, surname, phone, dob, isAdmin);

        // Then
        verify(userRepository).existsById(userId);
        verify(userRepository).save(any(UserProfile.class));
    }

    @Test
    @DisplayName("Should throw exception when user profile already exists")
    void shouldThrowExceptionWhenUserProfileAlreadyExists() {
        // Given
        String userId = "existing-user-123";
        when(userRepository.existsById(userId)).thenReturn(true);

        // When & Then
        ConflictException exception = assertThrows(ConflictException.class,
                () -> userService.createUserProfile(userId, "test@example.com", "John", "Doe", 
                        "+1234567890", LocalDate.of(1990, 1, 1), false));

        assertEquals("User profile already exists", exception.getMessage());
        verify(userRepository).existsById(userId);
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should create admin user profile successfully")
    void shouldCreateAdminUserProfileSuccessfully() {
        // Given
        String userId = "admin-123";
        String email = "admin@example.com";
        String name = "Admin";
        String surname = "User";
        String phone = "+1234567890";
        LocalDate dob = LocalDate.of(1985, 5, 15);
        Boolean isAdmin = true;

        UserProfile adminProfile = new UserProfile();
        adminProfile.setId(userId);
        adminProfile.setEmail(email);
        adminProfile.setName(name);
        adminProfile.setSurname(surname);
        adminProfile.setPhone(phone);
        adminProfile.setDob(dob);
        adminProfile.setIsAdmin(true);

        when(userRepository.existsById(userId)).thenReturn(false);
        when(userRepository.save(any(UserProfile.class))).thenReturn(adminProfile);

        // When
        userService.createUserProfile(userId, email, name, surname, phone, dob, isAdmin);

        // Then
        verify(userRepository).save(argThat(profile -> 
                profile.getId().equals(userId) &&
                profile.getEmail().equals(email) &&
                profile.getName().equals(name) &&
                profile.getSurname().equals(surname) &&
                profile.getPhone().equals(phone) &&
                profile.getDob().equals(dob) &&
                profile.getIsAdmin().equals(true) &&
                profile.getJoinDate() != null &&
                profile.getLastLoginDate() != null
        ));
    }

    @Test
    @DisplayName("Should get user by id successfully")
    void shouldGetUserByIdSuccessfully() {
        // Given
        String userId = "user-123";
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));

        // When
        UserProfile result = userService.getUserById(userId);

        // Then
        assertNotNull(result);
        assertEquals(testUserProfile, result);
        assertEquals(userId, result.getId());
        assertEquals("test@example.com", result.getEmail());

        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("Should throw exception when user not found by id")
    void shouldThrowExceptionWhenUserNotFoundById() {
        // Given
        String userId = "non-existent-user";
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> userService.getUserById(userId));

        assertEquals("User not found with id: " + userId, exception.getMessage());
        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("Should get current user successfully")
    void shouldGetCurrentUserSuccessfully() {
        // Given
        String email = "test@example.com";
        when(authentication.getName()).thenReturn(email);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUserProfile));

        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // When
        UserProfile result = userService.getCurrentUser();

        // Then
        assertNotNull(result);
        assertEquals(testUserProfile, result);
        assertEquals(email, result.getEmail());

        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should return null when no authentication")
    void shouldReturnNullWhenNoAuthentication() {
        // Given
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(null);

        // When
        UserProfile result = userService.getCurrentUser();

        // Then
        assertNull(result);
        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    @DisplayName("Should return null when user not authenticated")
    void shouldReturnNullWhenUserNotAuthenticated() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(false);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // When
        UserProfile result = userService.getCurrentUser();

        // Then
        assertNull(result);
        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    @DisplayName("Should throw exception when current user not found in database")
    void shouldThrowExceptionWhenCurrentUserNotFoundInDatabase() {
        // Given
        String email = "nonexistent@example.com";
        when(authentication.getName()).thenReturn(email);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // When & Then
        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> userService.getCurrentUser());

        assertEquals("User not found with email: " + email, exception.getMessage());
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should update last login successfully")
    void shouldUpdateLastLoginSuccessfully() {
        // Given
        String email = "test@example.com";
        LocalDateTime loginDate = LocalDateTime.now();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUserProfile));
        when(userRepository.save(any(UserProfile.class))).thenReturn(testUserProfile);

        // When
        userService.updateLastLogin(email, loginDate);

        // Then
        verify(userRepository).findByEmail(email);
        verify(userRepository).save(testUserProfile);
        assertEquals(loginDate, testUserProfile.getLastLoginDate());
    }

    @Test
    @DisplayName("Should throw exception when updating last login for non-existent user")
    void shouldThrowExceptionWhenUpdatingLastLoginForNonExistentUser() {
        // Given
        String email = "nonexistent@example.com";
        LocalDateTime loginDate = LocalDateTime.now();
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When & Then
        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> userService.updateLastLogin(email, loginDate));

        assertEquals("User not found with email: " + email, exception.getMessage());
        verify(userRepository).findByEmail(email);
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should get user by email successfully")
    void shouldGetUserByEmailSuccessfully() {
        // Given
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUserProfile));

        // When
        UserProfile result = userService.getByEmail(email);

        // Then
        assertNotNull(result);
        assertEquals(testUserProfile, result);
        assertEquals(email, result.getEmail());

        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should throw exception when user not found by email")
    void shouldThrowExceptionWhenUserNotFoundByEmail() {
        // Given
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When & Then
        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> userService.getByEmail(email));

        assertEquals("User not found with email: " + email, exception.getMessage());
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should delete user by id successfully")
    void shouldDeleteUserByIdSuccessfully() {
        // Given
        String userId = "user-123";
        when(userRepository.existsById(userId)).thenReturn(true);
        doNothing().when(userRepository).deleteById(userId);

        // When
        userService.deleteUserById(userId);

        // Then
        verify(userRepository).existsById(userId);
        verify(userRepository).deleteById(userId);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent user")
    void shouldThrowExceptionWhenDeletingNonExistentUser() {
        // Given
        String userId = "non-existent-user";
        when(userRepository.existsById(userId)).thenReturn(false);

        // When & Then
        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> userService.deleteUserById(userId));

        assertEquals("User not found with id: " + userId, exception.getMessage());
        verify(userRepository).existsById(userId);
        verify(userRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("Should check if user exists by id")
    void shouldCheckIfUserExistsById() {
        // Given
        String existingUserId = "existing-user";
        String nonExistentUserId = "non-existent-user";
        
        when(userRepository.existsById(existingUserId)).thenReturn(true);
        when(userRepository.existsById(nonExistentUserId)).thenReturn(false);

        // When & Then
        assertTrue(userService.existsById(existingUserId));
        assertFalse(userService.existsById(nonExistentUserId));

        verify(userRepository).existsById(existingUserId);
        verify(userRepository).existsById(nonExistentUserId);
    }

    @Test
    @DisplayName("Should handle null values in create user profile")
    void shouldHandleNullValuesInCreateUserProfile() {
        // Given
        String userId = "user-123";
        when(userRepository.existsById(userId)).thenReturn(false);
        when(userRepository.save(any(UserProfile.class))).thenReturn(testUserProfile);

        // When & Then - should not throw exception with null values
        assertDoesNotThrow(() -> 
                userService.createUserProfile(userId, "test@example.com", "John", "Doe", 
                        null, null, null));

        verify(userRepository).save(any(UserProfile.class));
    }

    @Test
    @DisplayName("Should handle edge cases for dates")
    void shouldHandleEdgeCasesForDates() {
        // Given
        String userId = "user-123";
        LocalDate futureDob = LocalDate.now().plusYears(1); // Future date
        LocalDate veryOldDob = LocalDate.of(1900, 1, 1);   // Very old date
        
        when(userRepository.existsById(userId)).thenReturn(false);
        when(userRepository.save(any(UserProfile.class))).thenReturn(testUserProfile);

        // When & Then - should handle edge case dates
        assertDoesNotThrow(() -> 
                userService.createUserProfile(userId, "future@example.com", "Future", "User", 
                        "+1234567890", futureDob, false));

        assertDoesNotThrow(() -> 
                userService.createUserProfile("user-124", "old@example.com", "Old", "User", 
                        "+1234567890", veryOldDob, false));

        verify(userRepository, times(2)).save(any(UserProfile.class));
    }

    @Test
    @DisplayName("Should handle concurrent operations gracefully")
    void shouldHandleConcurrentOperationsGracefully() {
        // Given
        String userId = "concurrent-user";
        String email = "concurrent@example.com";
        
        when(userRepository.existsById(userId)).thenReturn(false);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUserProfile));
        when(userRepository.save(any(UserProfile.class))).thenReturn(testUserProfile);

        // When - simulate concurrent operations
        userService.createUserProfile(userId, email, "John", "Doe", "+1234567890", 
                LocalDate.of(1990, 1, 1), false);
        UserProfile result = userService.getByEmail(email);
        userService.updateLastLogin(email, LocalDateTime.now());

        // Then
        assertNotNull(result);
        verify(userRepository).existsById(userId);
        verify(userRepository).findByEmail(email);
        verify(userRepository, times(2)).save(any(UserProfile.class));
    }

    // ============== NEW DELETION FUNCTIONALITY TESTS ==============

    @Test
    @DisplayName("Should get deletion info successfully")
    void shouldGetDeletionInfoSuccessfully() {
        // Given
        String userId = "user-123";
        
        // Mock WebClient chain
        WebClient.RequestHeadersUriSpec requestHeadersUriSpec = mock(WebClient.RequestHeadersUriSpec.class);
        WebClient.RequestHeadersSpec requestHeadersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);
        
        // Create mock response
        var orderInfoResponse = new Object() {
            public int orderCount() { return 3; }
            public boolean hasActiveOrders() { return true; }
        };
        
        when(webClientBuilder.baseUrl("http://order-service:8080")).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("/api/orders/user/{userId}/info", userId)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(any(Class.class))).thenReturn(Mono.just(orderInfoResponse));
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));

        // When
        UserDeletionInfoResponse result = userService.getDeletionInfo(userId);

        // Then
        assertNotNull(result);
        assertEquals(userId, result.userId());
        assertEquals("test@example.com", result.email());
        assertEquals("John Doe", result.fullName());
        assertTrue(result.hasOrders());
        assertEquals(3, result.orderCount());
        assertTrue(result.hasActiveOrders());

        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("Should throw NotFoundException when user not found for deletion info")
    void shouldThrowNotFoundExceptionWhenUserNotFoundForDeletionInfo() {
        // Given
        String userId = "non-existent-user";
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> userService.getDeletionInfo(userId));

        assertEquals("User not found with id: " + userId, exception.getMessage());
        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("Should handle order service failure gracefully in deletion info")
    void shouldHandleOrderServiceFailureGracefullyInDeletionInfo() {
        // Given
        String userId = "user-123";
        
        // Mock WebClient to throw exception
        when(webClientBuilder.baseUrl("http://order-service:8080")).thenReturn(webClient);
        when(webClient.get()).thenThrow(new RuntimeException("Service unavailable"));
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));

        // When
        UserDeletionInfoResponse result = userService.getDeletionInfo(userId);

        // Then
        assertNotNull(result);
        assertEquals(userId, result.userId());
        assertFalse(result.hasOrders()); // Default values when service fails
        assertEquals(0, result.orderCount());
        assertFalse(result.hasActiveOrders());

        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("Should initiate user deletion successfully")
    void shouldInitiateUserDeletionSuccessfully() {
        // Given
        String userId = "user-123";
        
        // Mock WebClient chain
        WebClient.RequestHeadersUriSpec requestHeadersUriSpec = mock(WebClient.RequestHeadersUriSpec.class);
        WebClient.RequestHeadersSpec requestHeadersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);
        
        var orderInfoResponse = new Object() {
            public int orderCount() { return 2; }
            public boolean hasActiveOrders() { return false; }
        };
        
        when(webClientBuilder.baseUrl("http://order-service:8080")).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("/api/orders/user/{userId}/info", userId)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(any(Class.class))).thenReturn(Mono.just(orderInfoResponse));
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));

        // When
        userService.initiateUserDeletion(userId);

        // Then
        verify(userRepository).findById(userId);
        verify(kafkaTemplate).send(eq("user-deletion-requested"), eq(userId), any(UserDeletionRequestedEvent.class));
    }

    @Test
    @DisplayName("Should throw NotFoundException when user not found for deletion initiation")
    void shouldThrowNotFoundExceptionWhenUserNotFoundForDeletionInitiation() {
        // Given
        String userId = "non-existent-user";
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> userService.initiateUserDeletion(userId));

        assertEquals("User not found with id: " + userId, exception.getMessage());
        verify(userRepository).findById(userId);
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should complete user deletion successfully")
    void shouldCompleteUserDeletionSuccessfully() {
        // Given
        String userId = "user-123";
        String deletedBy = "user";
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));

        // When
        userService.completeUserDeletion(userId, deletedBy);

        // Then
        verify(userRepository).findById(userId);
        verify(userRepository).deleteById(userId);
        verify(kafkaTemplate).send(eq("user-deletion-completed"), eq(userId), any(UserDeletionCompletedEvent.class));
    }

    @Test
    @DisplayName("Should throw NotFoundException when user not found for deletion completion")
    void shouldThrowNotFoundExceptionWhenUserNotFoundForDeletionCompletion() {
        // Given
        String userId = "non-existent-user";
        String deletedBy = "user";
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> userService.completeUserDeletion(userId, deletedBy));

        assertEquals("User not found with id: " + userId, exception.getMessage());
        verify(userRepository).findById(userId);
        verify(userRepository, never()).deleteById(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should handle user with no orders in deletion info")
    void shouldHandleUserWithNoOrdersInDeletionInfo() {
        // Given
        String userId = "user-123";
        
        // Mock WebClient chain
        WebClient.RequestHeadersUriSpec requestHeadersUriSpec = mock(WebClient.RequestHeadersUriSpec.class);
        WebClient.RequestHeadersSpec requestHeadersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);
        
        var orderInfoResponse = new Object() {
            public int orderCount() { return 0; }
            public boolean hasActiveOrders() { return false; }
        };
        
        when(webClientBuilder.baseUrl("http://order-service:8080")).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("/api/orders/user/{userId}/info", userId)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(any(Class.class))).thenReturn(Mono.just(orderInfoResponse));
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));

        // When
        UserDeletionInfoResponse result = userService.getDeletionInfo(userId);

        // Then
        assertNotNull(result);
        assertFalse(result.hasOrders());
        assertEquals(0, result.orderCount());
        assertFalse(result.hasActiveOrders());

        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("Should initiate deletion for user with no orders")
    void shouldInitiateDeletionForUserWithNoOrders() {
        // Given
        String userId = "user-123";
        
        // Mock WebClient chain for no orders
        WebClient.RequestHeadersUriSpec requestHeadersUriSpec = mock(WebClient.RequestHeadersUriSpec.class);
        WebClient.RequestHeadersSpec requestHeadersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);
        
        var orderInfoResponse = new Object() {
            public int orderCount() { return 0; }
            public boolean hasActiveOrders() { return false; }
        };
        
        when(webClientBuilder.baseUrl("http://order-service:8080")).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("/api/orders/user/{userId}/info", userId)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(any(Class.class))).thenReturn(Mono.just(orderInfoResponse));
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));

        // When
        userService.initiateUserDeletion(userId);

        // Then
        verify(userRepository).findById(userId);
        verify(kafkaTemplate).send(eq("user-deletion-requested"), eq(userId), 
                argThat((UserDeletionRequestedEvent event) -> 
                        event.userId().equals(userId) &&
                        event.email().equals("test@example.com") &&
                        !event.hasOrders() &&
                        event.orderCount() == 0
                ));
    }
}
