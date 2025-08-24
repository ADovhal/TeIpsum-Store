package com.teipsum.userservice.service;

import com.teipsum.shared.event.OrderInfoResponseEvent;
import com.teipsum.shared.event.UserDeletionCompletedEvent;
import com.teipsum.shared.event.UserDeletionRequestedEvent;
import com.teipsum.shared.exceptions.ConflictException;
import com.teipsum.shared.exceptions.NotFoundException;
import com.teipsum.userservice.dto.UserDeletionInfoResponse;
import com.teipsum.userservice.model.UserProfile;
import com.teipsum.userservice.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
    private OrderInfoCacheService orderInfoCacheService;

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

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
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
    @DisplayName("Should get deletion info successfully from cache")
    void shouldGetDeletionInfoSuccessfullyFromCache() {
        // Given
        String userId = "user-123";

        // Mock cache response
        OrderInfoCacheService.OrderInfo cachedInfo =
                new OrderInfoCacheService.OrderInfo(true, 3, true);

        when(orderInfoCacheService.getCachedInfo(userId)).thenReturn(cachedInfo);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(CompletableFuture.completedFuture(mock(SendResult.class)));

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
        verify(orderInfoCacheService).getCachedInfo(userId);
        verify(kafkaTemplate).send(eq("order-info-request"), eq(userId), any());
    }

    @Test
    @DisplayName("Should get deletion info with no orders from cache")
    void shouldGetDeletionInfoWithNoOrdersFromCache() {
        // Given
        String userId = "user-123";

        // Mock cache response - no orders
        OrderInfoCacheService.OrderInfo cachedInfo =
                new OrderInfoCacheService.OrderInfo(false, 0, false);

        when(orderInfoCacheService.getCachedInfo(userId)).thenReturn(cachedInfo);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(CompletableFuture.completedFuture(mock(SendResult.class)));

        // When
        UserDeletionInfoResponse result = userService.getDeletionInfo(userId);

        // Then
        assertNotNull(result);
        assertFalse(result.hasOrders());
        assertEquals(0, result.orderCount());
        assertFalse(result.hasActiveOrders());

        verify(userRepository).findById(userId);
        verify(orderInfoCacheService).getCachedInfo(userId);
        verify(kafkaTemplate).send(eq("order-info-request"), eq(userId), any());
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
        verify(orderInfoCacheService, never()).getCachedInfo(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should initiate user deletion successfully")
    void shouldInitiateUserDeletionSuccessfully() {
        // Given
        String userId = "user-123";

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(CompletableFuture.completedFuture(null));

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
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(CompletableFuture.completedFuture(null));

        // When
        userService.completeUserDeletion(userId, deletedBy);

        // Then
        verify(userRepository).findById(userId);
        verify(userRepository).deleteById(userId);
        verify(orderInfoCacheService).removeFromCache(userId);
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
        verify(orderInfoCacheService, never()).removeFromCache(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should handle Kafka send failure in initiateUserDeletion")
    void shouldHandleKafkaSendFailureInInitiateUserDeletion() {
        // Given
        String userId = "user-123";

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any()))
                .thenReturn(CompletableFuture.failedFuture(new RuntimeException("Kafka error")));

        // When & Then
        RuntimeException exception = assertThrows(KafkaException.class,
                () -> userService.initiateUserDeletion(userId));

        assertEquals("Failed to initiate account deletion", exception.getMessage());
        verify(userRepository).findById(userId);
        verify(kafkaTemplate).send(eq("user-deletion-requested"), eq(userId), any());
    }

    @Test
    @DisplayName("Should handle Kafka send failure in completeUserDeletion")
    void shouldHandleKafkaSendFailureInCompleteUserDeletion() {
        // Given
        String userId = "user-123";
        String deletedBy = "user";

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any()))
                .thenReturn(CompletableFuture.failedFuture(new RuntimeException("Kafka error")));

        // When & Then - should still complete deletion despite Kafka failure
        assertDoesNotThrow(() -> userService.completeUserDeletion(userId, deletedBy));

        verify(userRepository).findById(userId);
        verify(userRepository).deleteById(userId);
        verify(orderInfoCacheService).removeFromCache(userId);
        verify(kafkaTemplate).send(eq("user-deletion-completed"), eq(userId), any());
    }

    @Test
    @DisplayName("Should request order info update when getting deletion info")
    void shouldRequestOrderInfoUpdateWhenGettingDeletionInfo() {
        // Given
        String userId = "user-123";

        OrderInfoCacheService.OrderInfo cachedInfo =
                new OrderInfoCacheService.OrderInfo(true, 3, true);

        when(orderInfoCacheService.getCachedInfo(userId)).thenReturn(cachedInfo);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(CompletableFuture.completedFuture(null));

        // When
        UserDeletionInfoResponse result = userService.getDeletionInfo(userId);

        // Then - verify that order info request was sent
        verify(kafkaTemplate).send(eq("order-info-request"), eq(userId), any());
        assertNotNull(result);
    }

    @Test
    @DisplayName("Should handle Kafka failure gracefully in order info request")
    void shouldHandleKafkaFailureGracefullyInOrderInfoRequest() {
        // Given
        String userId = "user-123";

        OrderInfoCacheService.OrderInfo cachedInfo =
                new OrderInfoCacheService.OrderInfo(false, 0, false);

        when(orderInfoCacheService.getCachedInfo(userId)).thenReturn(cachedInfo);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any()))
                .thenReturn(CompletableFuture.failedFuture(new RuntimeException("Kafka error")));

        // When & Then - should not throw exception
        assertDoesNotThrow(() -> userService.getDeletionInfo(userId));

        verify(kafkaTemplate).send(eq("order-info-request"), eq(userId), any());
    }

    @Test
    @DisplayName("Should not request order info when user not found")
    void shouldNotRequestOrderInfoWhenUserNotFound() {
        // Given
        String userId = "non-existent-user";

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, () -> userService.getDeletionInfo(userId));

        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should verify event content in initiateUserDeletion")
    void shouldVerifyEventContentInInitiateUserDeletion() {
        // Given
        String userId = "user-123";

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(CompletableFuture.completedFuture(null));

        // When
        userService.initiateUserDeletion(userId);

        // Then
        verify(kafkaTemplate).send(eq("user-deletion-requested"), eq(userId),
                argThat((UserDeletionRequestedEvent event) ->
                        event.userId().equals(userId) &&
                                event.email().equals("test@example.com") &&
                                event.requestedAt() != null
                ));
    }

    @Test
    @DisplayName("Should verify event content in completeUserDeletion")
    void shouldVerifyEventContentInCompleteUserDeletion() {
        // Given
        String userId = "user-123";
        String deletedBy = "admin";

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(CompletableFuture.completedFuture(null));

        // When
        userService.completeUserDeletion(userId, deletedBy);

        // Then
        verify(kafkaTemplate).send(eq("user-deletion-completed"), eq(userId),
                argThat((UserDeletionCompletedEvent event) ->
                        event.userId().equals(userId) &&
                                event.email().equals("test@example.com") &&
                                event.deletedAt() != null &&
                                event.deletedBy().equals("admin")
                ));
    }

    @Test
    @DisplayName("Should handle cache operations in deletion flow")
    void shouldHandleCacheOperationsInDeletionFlow() {
        // Given
        String userId = "user-123";

        // Test getDeletionInfo uses cache
        OrderInfoCacheService.OrderInfo cachedInfo =
                new OrderInfoCacheService.OrderInfo(true, 5, false);

        when(orderInfoCacheService.getCachedInfo(userId)).thenReturn(cachedInfo);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(CompletableFuture.completedFuture(null));

        UserDeletionInfoResponse response = userService.getDeletionInfo(userId);
        assertEquals(5, response.orderCount());

        // Test completeUserDeletion clears cache
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserProfile));
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(CompletableFuture.completedFuture(null));

        userService.completeUserDeletion(userId, "user");

        verify(orderInfoCacheService).getCachedInfo(userId);
        verify(orderInfoCacheService).removeFromCache(userId);
    }
}