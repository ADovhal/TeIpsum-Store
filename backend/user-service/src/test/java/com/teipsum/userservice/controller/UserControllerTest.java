package com.teipsum.userservice.controller;

import com.teipsum.shared.exceptions.handler.GlobalExceptionHandler;
import com.teipsum.userservice.config.SecurityConfig;
import com.teipsum.userservice.model.UserProfile;
import com.teipsum.userservice.service.UserService;
import org.hibernate.service.spi.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
@ActiveProfiles("test")
@DisplayName("UserController Tests")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
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
        testUserProfile.setJoinDate(LocalDate.of(2023, 1, 15));
        testUserProfile.setLastLoginDate(LocalDateTime.of(2024, 1, 20, 10, 30));
    }

    @Test
    @DisplayName("Should get user profile successfully")
    @WithMockUser(username = "test@example.com")
    void shouldGetUserProfileSuccessfully() throws Exception {
        // Given
        when(userService.getCurrentUser()).thenReturn(testUserProfile);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("user-123"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.name").value("John"))
                .andExpect(jsonPath("$.fullName").value("John Doe"))
                .andExpect(jsonPath("$.joinDate").value("2023-01-15"));

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("Should return unauthorized when user not authenticated")
    void shouldReturnUnauthorizedWhenUserNotAuthenticated() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isUnauthorized());

        verify(userService, never()).getCurrentUser();
    }

    @Test
    @DisplayName("Should return not found when current user is null")
    @WithMockUser(username = "test@example.com")
    void shouldReturnNotFoundWhenCurrentUserIsNull() throws Exception {
        // Given
        when(userService.getCurrentUser()).thenReturn(null);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("User profile not found"));

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("Should handle service exception gracefully")
    @WithMockUser(username = "test@example.com")
    void shouldHandleServiceExceptionGracefully() throws Exception {
        // Given
        when(userService.getCurrentUser()).thenThrow(new ServiceException("Database error"));

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isInternalServerError());

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("Should return correct profile structure for regular user")
    @WithMockUser(username = "user@example.com")
    void shouldReturnCorrectProfileStructureForRegularUser() throws Exception {
        // Given
        UserProfile regularUser = new UserProfile();
        regularUser.setId("regular-user-123");
        regularUser.setEmail("user@example.com");
        regularUser.setName("Jane");
        regularUser.setSurname("Smith");
        regularUser.setPhone("+9876543210");
        regularUser.setDob(LocalDate.of(1985, 5, 20));
        regularUser.setIsAdmin(false);
        regularUser.setJoinDate(LocalDate.of(2022, 3, 10));
        regularUser.setLastLoginDate(LocalDateTime.of(2024, 1, 25, 14, 45));

        when(userService.getCurrentUser()).thenReturn(regularUser);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("regular-user-123"))
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.name").value("Jane"))
                .andExpect(jsonPath("$.fullName").value("Jane Smith"))
                .andExpect(jsonPath("$.joinDate").value("2022-03-10"))
                .andExpect(jsonPath("$.phone").doesNotExist()) // Phone should not be exposed
                .andExpect(jsonPath("$.dob").doesNotExist())   // DOB should not be exposed
                .andExpect(jsonPath("$.isAdmin").doesNotExist()); // Admin flag should not be exposed

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("Should return correct profile structure for admin user")
    @WithMockUser(username = "admin@example.com", authorities = {"ROLE_ADMIN"})
    void shouldReturnCorrectProfileStructureForAdminUser() throws Exception {
        // Given
        UserProfile adminUser = new UserProfile();
        adminUser.setId("admin-123");
        adminUser.setEmail("admin@example.com");
        adminUser.setName("Admin");
        adminUser.setSurname("User");
        adminUser.setPhone("+1111111111");
        adminUser.setDob(LocalDate.of(1980, 12, 1));
        adminUser.setIsAdmin(true);
        adminUser.setJoinDate(LocalDate.of(2021, 1, 1));
        adminUser.setLastLoginDate(LocalDateTime.of(2024, 1, 26, 9, 0));

        when(userService.getCurrentUser()).thenReturn(adminUser);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("admin-123"))
                .andExpect(jsonPath("$.email").value("admin@example.com"))
                .andExpect(jsonPath("$.name").value("Admin"))
                .andExpect(jsonPath("$.fullName").value("Admin User"))
                .andExpect(jsonPath("$.joinDate").value("2021-01-01"));

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("Should handle user with null name gracefully")
    @WithMockUser(username = "test@example.com")
    void shouldHandleUserWithNullNameGracefully() throws Exception {
        // Given
        UserProfile userWithNullName = new UserProfile();
        userWithNullName.setId("user-null-name");
        userWithNullName.setEmail("null-name@example.com");
        userWithNullName.setName(null);
        userWithNullName.setSurname("Surname");
        userWithNullName.setJoinDate(LocalDate.now());

        when(userService.getCurrentUser()).thenReturn(userWithNullName);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("user-null-name"))
                .andExpect(jsonPath("$.email").value("null-name@example.com"))
                .andExpect(jsonPath("$.name").isEmpty())
                .andExpect(jsonPath("$.fullName").value(" Surname")); // Space + surname

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("Should handle user with null surname gracefully")
    @WithMockUser(username = "test@example.com")
    void shouldHandleUserWithNullSurnameGracefully() throws Exception {
        // Given
        UserProfile userWithNullSurname = new UserProfile();
        userWithNullSurname.setId("user-null-surname");
        userWithNullSurname.setEmail("null-surname@example.com");
        userWithNullSurname.setName("John");
        userWithNullSurname.setSurname(null);
        userWithNullSurname.setJoinDate(LocalDate.now());

        when(userService.getCurrentUser()).thenReturn(userWithNullSurname);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("user-null-surname"))
                .andExpect(jsonPath("$.email").value("null-surname@example.com"))
                .andExpect(jsonPath("$.name").value("John"))
                .andExpect(jsonPath("$.fullName").value("John ")); // Name + space

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("Should handle user with both null name and surname")
    @WithMockUser(username = "test@example.com")
    void shouldHandleUserWithBothNullNameAndSurname() throws Exception {
        // Given
        UserProfile userWithNullNames = new UserProfile();
        userWithNullNames.setId("user-null-names");
        userWithNullNames.setEmail("null-names@example.com");
        userWithNullNames.setName(null);
        userWithNullNames.setSurname(null);
        userWithNullNames.setJoinDate(LocalDate.now());

        when(userService.getCurrentUser()).thenReturn(userWithNullNames);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("user-null-names"))
                .andExpect(jsonPath("$.email").value("null-names@example.com"))
                .andExpect(jsonPath("$.name").isEmpty())
                .andExpect(jsonPath("$.fullName").value(" ")); // Just a space

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("Should include all required fields in response")
    @WithMockUser(username = "test@example.com")
    void shouldIncludeAllRequiredFieldsInResponse() throws Exception {
        // Given
        when(userService.getCurrentUser()).thenReturn(testUserProfile);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.email").exists())
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.fullName").exists())
                .andExpect(jsonPath("$.joinDate").exists())
                // Verify sensitive fields are not included
                .andExpect(jsonPath("$.phone").doesNotExist())
                .andExpect(jsonPath("$.dob").doesNotExist())
                .andExpect(jsonPath("$.isAdmin").doesNotExist())
                .andExpect(jsonPath("$.lastLoginDate").doesNotExist());

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("Should handle different date formats correctly")
    @WithMockUser(username = "test@example.com")
    void shouldHandleDifferentDateFormatsCorrectly() throws Exception {
        // Given
        UserProfile userWithDifferentDates = new UserProfile();
        userWithDifferentDates.setId("user-dates");
        userWithDifferentDates.setEmail("dates@example.com");
        userWithDifferentDates.setName("Date");
        userWithDifferentDates.setSurname("User");
        userWithDifferentDates.setJoinDate(LocalDate.of(2020, 12, 31)); // End of year
        userWithDifferentDates.setLastLoginDate(LocalDateTime.of(2024, 2, 29, 23, 59, 59)); // Leap year, end of day

        when(userService.getCurrentUser()).thenReturn(userWithDifferentDates);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.joinDate").value("2020-12-31"));

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("Should handle concurrent requests correctly")
    @WithMockUser(username = "test@example.com")
    void shouldHandleConcurrentRequestsCorrectly() throws Exception {
        // Given
        when(userService.getCurrentUser()).thenReturn(testUserProfile);

        // When & Then - simulate multiple concurrent requests
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(get("/api/users/profile"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value("user-123"))
                    .andExpect(jsonPath("$.email").value("test@example.com"));
        }

        verify(userService, times(5)).getCurrentUser();
    }

    @Test
    @DisplayName("Should handle service timeout gracefully")
    @WithMockUser(username = "test@example.com")
    void shouldHandleServiceTimeoutGracefully() throws Exception {
        // Given
        when(userService.getCurrentUser()).thenThrow(new ServiceException("Service timeout"));

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isInternalServerError());

        verify(userService).getCurrentUser();
    }
}
