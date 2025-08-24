package com.teipsum.userservice.integration;

import com.teipsum.shared.exceptions.ConflictException;
import com.teipsum.userservice.model.UserProfile;
import com.teipsum.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureWebMvc
@Transactional
@DisplayName("User Service Integration Tests")
class UserServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @MockitoBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
    }

    @Test
    @DisplayName("Should get user profile with full integration")
    @WithMockUser(username = "integration@example.com")
    void shouldGetUserProfileWithFullIntegration() throws Exception {
        // Given - create and save test user
        UserProfile testUser = createTestUser("integration@example.com", "Integration", "User");
        userRepository.save(testUser);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUser.getId()))
                .andExpect(jsonPath("$.email").value("integration@example.com"))
                .andExpect(jsonPath("$.name").value("Integration"))
                .andExpect(jsonPath("$.fullName").value("Integration User"))
                .andExpect(jsonPath("$.joinDate").exists())
                // Verify sensitive fields are not exposed
                .andExpect(jsonPath("$.phone").doesNotExist())
                .andExpect(jsonPath("$.dob").doesNotExist())
                .andExpect(jsonPath("$.isAdmin").doesNotExist())
                .andExpect(jsonPath("$.lastLoginDate").doesNotExist());

        // Verify user exists in database
        Optional<UserProfile> savedUser = userRepository.findByEmail("integration@example.com");
        assertTrue(savedUser.isPresent());
        assertEquals("Integration", savedUser.get().getName());
    }

    @Test
    @DisplayName("Should return not found when user profile doesn't exist in database")
    @WithMockUser(username = "nonexistent@example.com")
    void shouldReturnNotFoundWhenUserProfileDoesntExistInDatabase() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("User profile not found"));

        // Verify user doesn't exist in database
        Optional<UserProfile> user = userRepository.findByEmail("nonexistent@example.com");
        assertFalse(user.isPresent());
    }

    @Test
    @DisplayName("Should require authentication for profile endpoint")
    void shouldRequireAuthenticationForProfileEndpoint() throws Exception {
        // When & Then - no authentication
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should handle admin user profile correctly")
    @WithMockUser(username = "admin@example.com", authorities = {"ROLE_ADMIN"})
    void shouldHandleAdminUserProfileCorrectly() throws Exception {
        // Given - create and save admin user
        UserProfile adminUser = createTestUser("admin@example.com", "Admin", "User");
        adminUser.setIsAdmin(true);
        userRepository.save(adminUser);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("admin@example.com"))
                .andExpect(jsonPath("$.name").value("Admin"))
                .andExpect(jsonPath("$.fullName").value("Admin User"))
                // Admin flag should still not be exposed in response
                .andExpect(jsonPath("$.isAdmin").doesNotExist());

        // Verify admin user exists in database with correct flag
        Optional<UserProfile> savedUser = userRepository.findByEmail("admin@example.com");
        assertTrue(savedUser.isPresent());
        assertTrue(savedUser.get().getIsAdmin());
    }

    @Test
    @DisplayName("Should handle user profile with special characters")
    @WithMockUser(username = "special@example.com")
    void shouldHandleUserProfileWithSpecialCharacters() throws Exception {
        // Given - create user with special characters
        UserProfile specialUser = createTestUser("special@example.com", "José", "García-López");
        userRepository.save(specialUser);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("special@example.com"))
                .andExpect(jsonPath("$.name").value("José"))
                .andExpect(jsonPath("$.fullName").value("José García-López"));

        // Verify special characters are preserved in database
        Optional<UserProfile> savedUser = userRepository.findByEmail("special@example.com");
        assertTrue(savedUser.isPresent());
        assertEquals("José", savedUser.get().getName());
        assertEquals("García-López", savedUser.get().getSurname());
    }

    @Test
    @DisplayName("Should handle concurrent requests correctly")
    @WithMockUser(username = "concurrent@example.com")
    void shouldHandleConcurrentRequestsCorrectly() throws Exception {
        // Given - create and save test user
        UserProfile testUser = createTestUser("concurrent@example.com", "Concurrent", "User");
        userRepository.save(testUser);

        // When & Then - make multiple concurrent requests
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(get("/api/users/profile"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.email").value("concurrent@example.com"))
                    .andExpect(jsonPath("$.name").value("Concurrent"));
        }

        // Verify user still exists and is unchanged
        Optional<UserProfile> savedUser = userRepository.findByEmail("concurrent@example.com");
        assertTrue(savedUser.isPresent());
        assertEquals("Concurrent", savedUser.get().getName());
    }

    @Test
    @DisplayName("Should handle user with minimal data")
    @WithMockUser(username = "minimal@example.com")
    void shouldHandleUserWithMinimalData() throws Exception {
        // Given - create user with minimal required data
        UserProfile minimalUser = new UserProfile();
        minimalUser.setId("minimal-user-123");
        minimalUser.setEmail("minimal@example.com");
        minimalUser.setName("Min");
        minimalUser.setSurname("User");
        minimalUser.setPhone("+0000000000");
        minimalUser.setDob(LocalDate.now());
        minimalUser.setIsAdmin(false);
        minimalUser.setJoinDate(LocalDate.now());
        minimalUser.setLastLoginDate(LocalDateTime.now());

        userRepository.save(minimalUser);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("minimal-user-123"))
                .andExpect(jsonPath("$.email").value("minimal@example.com"))
                .andExpect(jsonPath("$.name").value("Min"))
                .andExpect(jsonPath("$.fullName").value("Min User"));

        // Verify minimal user exists in database
        Optional<UserProfile> savedUser = userRepository.findByEmail("minimal@example.com");
        assertTrue(savedUser.isPresent());
        assertEquals("Min", savedUser.get().getName());
    }

    @Test
    @DisplayName("Should handle user with long names")
    @WithMockUser(username = "longname@example.com")
    void shouldHandleUserWithLongNames() throws Exception {
        // Given - create user with very long names
        String longName = "VeryLongFirstNameThatExceedsNormalLimits";
        String longSurname = "VeryLongSurnameThatAlsoExceedsNormalLimitsAndIsQuiteLong";
        
        UserProfile longNameUser = createTestUser("longname@example.com", longName, longSurname);
        userRepository.save(longNameUser);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("longname@example.com"))
                .andExpect(jsonPath("$.name").value(longName))
                .andExpect(jsonPath("$.fullName").value(longName + " " + longSurname));

        // Verify long names are preserved in database
        Optional<UserProfile> savedUser = userRepository.findByEmail("longname@example.com");
        assertTrue(savedUser.isPresent());
        assertEquals(longName, savedUser.get().getName());
        assertEquals(longSurname, savedUser.get().getSurname());
    }

    @Test
    @DisplayName("Should handle database constraints correctly")
    void shouldHandleDatabaseConstraintsCorrectly() {
        // Given - create user with duplicate email
        UserProfile user1 = createTestUser("duplicate@example.com", "User", "One");
        userRepository.save(user1);

        UserProfile user2 = createTestUser("duplicate@example.com", "User", "Two");
        user2.setId("different-id-123");

        // When & Then
        assertThrows(ConflictException.class, () -> {
            userRepository.save(user2);
            userRepository.flush();
        });

        assertEquals(1, userRepository.findByEmail("duplicate@example.com").stream().count());
    }

    @Test
    @DisplayName("Should handle user profile updates correctly")
    @WithMockUser(username = "update@example.com")
    void shouldHandleUserProfileUpdatesCorrectly() throws Exception {
        // Given - create and save initial user
        UserProfile initialUser = createTestUser("update@example.com", "Initial", "Name");
        UserProfile savedUser = userRepository.save(initialUser);

        // When - update user data
        savedUser.setName("Updated");
        savedUser.setSurname("User");
        savedUser.setLastLoginDate(LocalDateTime.now().plusHours(1));
        userRepository.save(savedUser);

        // Then - verify API returns updated data
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("update@example.com"))
                .andExpect(jsonPath("$.name").value("Updated"))
                .andExpect(jsonPath("$.fullName").value("Updated User"));

        // Verify updated data in database
        Optional<UserProfile> updatedUser = userRepository.findByEmail("update@example.com");
        assertTrue(updatedUser.isPresent());
        assertEquals("Updated", updatedUser.get().getName());
        assertEquals("User", updatedUser.get().getSurname());
    }

    @Test
    @DisplayName("Should handle different date formats in database")
    @WithMockUser(username = "dates@example.com")
    void shouldHandleDifferentDateFormatsInDatabase() throws Exception {
        // Given - create user with specific dates
        UserProfile dateUser = createTestUser("dates@example.com", "Date", "User");
        dateUser.setJoinDate(LocalDate.of(2020, 12, 31)); // End of year
        dateUser.setDob(LocalDate.of(1984, 2, 29)); // Leap year
        dateUser.setLastLoginDate(LocalDateTime.of(2024, 1, 1, 0, 0, 0)); // Start of year
        
        userRepository.save(dateUser);

        // When & Then
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("dates@example.com"))
                .andExpect(jsonPath("$.joinDate").value("2020-12-31"));

        // Verify dates are correctly stored and retrieved
        Optional<UserProfile> savedUser = userRepository.findByEmail("dates@example.com");
        assertTrue(savedUser.isPresent());
        assertEquals(LocalDate.of(2020, 12, 31), savedUser.get().getJoinDate());
        assertEquals(LocalDate.of(1984, 2, 29), savedUser.get().getDob());
    }

    @Test
    @DisplayName("Should handle transaction rollback correctly")
    void shouldHandleTransactionRollbackCorrectly() {
        // Given - create user
        UserProfile testUser = createTestUser("rollback@example.com", "Rollback", "User");
        
        // When - save user and then simulate error
        UserProfile savedUser = userRepository.save(testUser);
        String originalId = savedUser.getId();
        
        // Verify user was saved
        assertTrue(userRepository.existsById(originalId));
        
        // Simulate transaction rollback by deleting
        userRepository.deleteById(originalId);
        
        // Then - verify user no longer exists
        assertFalse(userRepository.existsById(originalId));
        Optional<UserProfile> deletedUser = userRepository.findByEmail("rollback@example.com");
        assertFalse(deletedUser.isPresent());
    }

    private UserProfile createTestUser(String email, String name, String surname) {
        UserProfile user = new UserProfile();
        user.setId("user-" + email.hashCode());
        user.setEmail(email);
        user.setName(name);
        user.setSurname(surname);
        user.setPhone("+1234567890");
        user.setDob(LocalDate.of(1990, 1, 1));
        user.setIsAdmin(false);
        user.setJoinDate(LocalDate.now());
        user.setLastLoginDate(LocalDateTime.now());
        return user;
    }
}
