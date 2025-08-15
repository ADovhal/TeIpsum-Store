package com.teipsum.userservice.event;

import com.teipsum.shared.event.UserLoggedInEvent;
import com.teipsum.shared.event.UserRegisteredEvent;
import com.teipsum.userservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserEventListener Tests")
class UserEventListenerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserEventListener userEventListener;

    private UserRegisteredEvent userRegisteredEvent;
    private UserLoggedInEvent userLoggedInEvent;

    @BeforeEach
    void setUp() {
        userRegisteredEvent = new UserRegisteredEvent(
                "user-123",
                "test@example.com",
                "John",
                "Doe",
                "+1234567890",
                LocalDate.of(1990, 1, 1),
                false
        );

        userLoggedInEvent = new UserLoggedInEvent(
                "test@example.com",
                LocalDateTime.now()
        );
    }

    @Test
    @DisplayName("Should handle user registration event successfully")
    void shouldHandleUserRegistrationEventSuccessfully() {
        // Given
        doNothing().when(userService).createUserProfile(
                userRegisteredEvent.userId(),
                userRegisteredEvent.email(),
                userRegisteredEvent.name(),
                userRegisteredEvent.surname(),
                userRegisteredEvent.phone(),
                userRegisteredEvent.dob(),
                userRegisteredEvent.isAdmin()
        );

        // When
        userEventListener.handleUserRegistration(userRegisteredEvent);

        // Then
        verify(userService).createUserProfile(
                "user-123",
                "test@example.com",
                "John",
                "Doe",
                "+1234567890",
                LocalDate.of(1990, 1, 1),
                false
        );
    }

    @Test
    @DisplayName("Should handle admin registration event successfully")
    void shouldHandleAdminRegistrationEventSuccessfully() {
        // Given
        UserRegisteredEvent adminRegisteredEvent = new UserRegisteredEvent(
                "admin-123",
                "admin@example.com",
                "Admin",
                "User",
                "+9876543210",
                LocalDate.of(1985, 5, 15),
                true
        );

        doNothing().when(userService).createUserProfile(
                adminRegisteredEvent.userId(),
                adminRegisteredEvent.email(),
                adminRegisteredEvent.name(),
                adminRegisteredEvent.surname(),
                adminRegisteredEvent.phone(),
                adminRegisteredEvent.dob(),
                adminRegisteredEvent.isAdmin()
        );

        // When
        userEventListener.handleUserRegistration(adminRegisteredEvent);

        // Then
        verify(userService).createUserProfile(
                "admin-123",
                "admin@example.com",
                "Admin",
                "User",
                "+9876543210",
                LocalDate.of(1985, 5, 15),
                true
        );
    }

    @Test
    @DisplayName("Should handle user login event successfully")
    void shouldHandleUserLoginEventSuccessfully() {
        // Given
        LocalDateTime loginTime = LocalDateTime.of(2024, 1, 20, 10, 30);
        UserLoggedInEvent loginEvent = new UserLoggedInEvent("user@example.com", loginTime);
        
        doNothing().when(userService).updateLastLogin(loginEvent.email(), loginEvent.timestamp());

        // When
        userEventListener.handleUserLogin(loginEvent);

        // Then
        verify(userService).updateLastLogin("user@example.com", loginTime);
    }

    @Test
    @DisplayName("Should handle service exception during user registration")
    void shouldHandleServiceExceptionDuringUserRegistration() {
        // Given
        doThrow(new RuntimeException("Database error"))
                .when(userService).createUserProfile(any(), any(), any(), any(), any(), any(), any());

        // When & Then
        assertThrows(RuntimeException.class, 
                () -> userEventListener.handleUserRegistration(userRegisteredEvent));

        verify(userService).createUserProfile(
                userRegisteredEvent.userId(),
                userRegisteredEvent.email(),
                userRegisteredEvent.name(),
                userRegisteredEvent.surname(),
                userRegisteredEvent.phone(),
                userRegisteredEvent.dob(),
                userRegisteredEvent.isAdmin()
        );
    }

    @Test
    @DisplayName("Should handle service exception during login update")
    void shouldHandleServiceExceptionDuringLoginUpdate() {
        // Given
        doThrow(new RuntimeException("Update failed"))
                .when(userService).updateLastLogin(any(), any());

        // When & Then
        assertThrows(RuntimeException.class, 
                () -> userEventListener.handleUserLogin(userLoggedInEvent));

        verify(userService).updateLastLogin(
                userLoggedInEvent.email(),
                userLoggedInEvent.timestamp()
        );
    }

    @Test
    @DisplayName("Should handle multiple registration events")
    void shouldHandleMultipleRegistrationEvents() {
        // Given
        UserRegisteredEvent event1 = new UserRegisteredEvent(
                "user-1", "user1@example.com", "User", "One",
                "+1111111111", LocalDate.of(1990, 1, 1), false
        );
        UserRegisteredEvent event2 = new UserRegisteredEvent(
                "user-2", "user2@example.com", "User", "Two",
                "+2222222222", LocalDate.of(1985, 5, 15), false
        );

        doNothing().when(userService).createUserProfile(any(), any(), any(), any(), any(), any(), any());

        // When
        userEventListener.handleUserRegistration(event1);
        userEventListener.handleUserRegistration(event2);

        // Then
        verify(userService).createUserProfile("user-1", "user1@example.com", "User", "One",
                "+1111111111", LocalDate.of(1990, 1, 1), false);
        verify(userService).createUserProfile("user-2", "user2@example.com", "User", "Two",
                "+2222222222", LocalDate.of(1985, 5, 15), false);
        verify(userService, times(2)).createUserProfile(any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should handle multiple login events")
    void shouldHandleMultipleLoginEvents() {
        // Given
        LocalDateTime time1 = LocalDateTime.of(2024, 1, 20, 10, 0);
        LocalDateTime time2 = LocalDateTime.of(2024, 1, 20, 15, 30);
        
        UserLoggedInEvent login1 = new UserLoggedInEvent("user1@example.com", time1);
        UserLoggedInEvent login2 = new UserLoggedInEvent("user2@example.com", time2);

        doNothing().when(userService).updateLastLogin(any(), any());

        // When
        userEventListener.handleUserLogin(login1);
        userEventListener.handleUserLogin(login2);

        // Then
        verify(userService).updateLastLogin("user1@example.com", time1);
        verify(userService).updateLastLogin("user2@example.com", time2);
        verify(userService, times(2)).updateLastLogin(any(), any());
    }

    @Test
    @DisplayName("Should handle registration event with null values")
    void shouldHandleRegistrationEventWithNullValues() {
        // Given
        UserRegisteredEvent eventWithNulls = new UserRegisteredEvent(
                "user-nulls",
                "nulls@example.com",
                null, // null name
                null, // null surname
                null, // null phone
                null, // null dob
                null  // null isAdmin
        );

        doNothing().when(userService).createUserProfile(any(), any(), any(), any(), any(), any(), any());

        // When & Then
        assertDoesNotThrow(() -> userEventListener.handleUserRegistration(eventWithNulls));

        verify(userService).createUserProfile(
                "user-nulls",
                "nulls@example.com",
                null,
                null,
                null,
                null,
                null
        );
    }

    @Test
    @DisplayName("Should handle login event with null timestamp")
    void shouldHandleLoginEventWithNullTimestamp() {
        // Given
        UserLoggedInEvent eventWithNullTimestamp = new UserLoggedInEvent(
                "user@example.com",
                null
        );

        doNothing().when(userService).updateLastLogin(any(), any());

        // When & Then
        assertDoesNotThrow(() -> userEventListener.handleUserLogin(eventWithNullTimestamp));

        verify(userService).updateLastLogin("user@example.com", null);
    }

    @Test
    @DisplayName("Should handle events with edge case dates")
    void shouldHandleEventsWithEdgeCaseDates() {
        // Given
        LocalDate futureDob = LocalDate.now().plusYears(1);
        LocalDate veryOldDob = LocalDate.of(1900, 1, 1);
        LocalDateTime futureLogin = LocalDateTime.now().plusDays(1);
        LocalDateTime veryOldLogin = LocalDateTime.of(1970, 1, 1, 0, 0);

        UserRegisteredEvent futureEvent = new UserRegisteredEvent(
                "future-user", "future@example.com", "Future", "User",
                "+1234567890", futureDob, false
        );

        UserRegisteredEvent oldEvent = new UserRegisteredEvent(
                "old-user", "old@example.com", "Old", "User",
                "+1234567890", veryOldDob, false
        );

        UserLoggedInEvent futureLoginEvent = new UserLoggedInEvent("future@example.com", futureLogin);
        UserLoggedInEvent oldLoginEvent = new UserLoggedInEvent("old@example.com", veryOldLogin);

        doNothing().when(userService).createUserProfile(any(), any(), any(), any(), any(), any(), any());
        doNothing().when(userService).updateLastLogin(any(), any());

        // When & Then
        assertDoesNotThrow(() -> userEventListener.handleUserRegistration(futureEvent));
        assertDoesNotThrow(() -> userEventListener.handleUserRegistration(oldEvent));
        assertDoesNotThrow(() -> userEventListener.handleUserLogin(futureLoginEvent));
        assertDoesNotThrow(() -> userEventListener.handleUserLogin(oldLoginEvent));

        verify(userService, times(2)).createUserProfile(any(), any(), any(), any(), any(), any(), any());
        verify(userService, times(2)).updateLastLogin(any(), any());
    }

    @Test
    @DisplayName("Should handle concurrent event processing")
    void shouldHandleConcurrentEventProcessing() {
        // Given
        doNothing().when(userService).createUserProfile(any(), any(), any(), any(), any(), any(), any());
        doNothing().when(userService).updateLastLogin(any(), any());

        // When - simulate concurrent processing
        userEventListener.handleUserRegistration(userRegisteredEvent);
        userEventListener.handleUserLogin(userLoggedInEvent);
        userEventListener.handleUserRegistration(userRegisteredEvent);
        userEventListener.handleUserLogin(userLoggedInEvent);

        // Then
        verify(userService, times(2)).createUserProfile(any(), any(), any(), any(), any(), any(), any());
        verify(userService, times(2)).updateLastLogin(any(), any());
    }

    @Test
    @DisplayName("Should handle events with special characters in data")
    void shouldHandleEventsWithSpecialCharactersInData() {
        // Given
        UserRegisteredEvent specialCharEvent = new UserRegisteredEvent(
                "user-special-123",
                "special+chars@example.com",
                "José",
                "García-López",
                "+1-234-567-8900",
                LocalDate.of(1990, 1, 1),
                false
        );

        doNothing().when(userService).createUserProfile(any(), any(), any(), any(), any(), any(), any());

        // When & Then
        assertDoesNotThrow(() -> userEventListener.handleUserRegistration(specialCharEvent));

        verify(userService).createUserProfile(
                "user-special-123",
                "special+chars@example.com",
                "José",
                "García-López",
                "+1-234-567-8900",
                LocalDate.of(1990, 1, 1),
                false
        );
    }

    @Test
    @DisplayName("Should handle null events gracefully")
    void shouldHandleNullEventsGracefully() {
        // When & Then - should not throw exceptions
        assertDoesNotThrow(() -> userEventListener.handleUserRegistration(null));
        assertDoesNotThrow(() -> userEventListener.handleUserLogin(null));

        // Service methods should be called with null (service should handle null check)
        verify(userService).createUserProfile(null, null, null, null, null, null, null);
        verify(userService).updateLastLogin(null, null);
    }

    private void assertDoesNotThrow(Runnable runnable) {
        try {
            runnable.run();
        } catch (Exception e) {
            fail("Expected no exception but got: " + e.getMessage());
        }
    }

    private void fail(String message) {
        throw new AssertionError(message);
    }
}
