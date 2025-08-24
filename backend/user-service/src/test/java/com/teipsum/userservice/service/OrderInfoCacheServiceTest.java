package com.teipsum.userservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderInfoCacheService Tests")
class OrderInfoCacheServiceTest {

    private OrderInfoCacheService cacheService;

    @BeforeEach
    void setUp() {
        cacheService = new OrderInfoCacheService();
    }

    @Test
    @DisplayName("Should update and get cache successfully")
    void shouldUpdateAndGetCacheSuccessfully() {
        // Given
        String userId = "user-123";

        // When
        cacheService.updateCache(userId, 5, true);
        OrderInfoCacheService.OrderInfo result = cacheService.getCachedInfo(userId);

        // Then
        assertNotNull(result);
        assertTrue(result.hasOrders());
        assertEquals(5, result.orderCount());
        assertTrue(result.hasActiveOrders());
    }

    @Test
    @DisplayName("Should return default values for non-existent user")
    void shouldReturnDefaultValuesForNonExistentUser() {
        // Given
        String nonExistentUserId = "non-existent-user";

        // When
        OrderInfoCacheService.OrderInfo result = cacheService.getCachedInfo(nonExistentUserId);

        // Then
        assertNotNull(result);
        assertFalse(result.hasOrders());
        assertEquals(0, result.orderCount());
        assertFalse(result.hasActiveOrders());
    }

    @Test
    @DisplayName("Should remove user from cache successfully")
    void shouldRemoveUserFromCacheSuccessfully() {
        // Given
        String userId = "user-123";
        cacheService.updateCache(userId, 3, false);

        // When
        cacheService.removeFromCache(userId);
        OrderInfoCacheService.OrderInfo result = cacheService.getCachedInfo(userId);

        // Then
        assertNotNull(result);
        assertFalse(result.hasOrders());
        assertEquals(0, result.orderCount());
        assertFalse(result.hasActiveOrders());
    }

    @Test
    @DisplayName("Should handle multiple users in cache")
    void shouldHandleMultipleUsersInCache() {
        // Given
        String user1 = "user-1";
        String user2 = "user-2";

        // When
        cacheService.updateCache(user1, 2, true);
        cacheService.updateCache(user2, 0, false);

        OrderInfoCacheService.OrderInfo result1 = cacheService.getCachedInfo(user1);
        OrderInfoCacheService.OrderInfo result2 = cacheService.getCachedInfo(user2);

        // Then
        assertTrue(result1.hasOrders());
        assertEquals(2, result1.orderCount());
        assertTrue(result1.hasActiveOrders());

        assertFalse(result2.hasOrders());
        assertEquals(0, result2.orderCount());
        assertFalse(result2.hasActiveOrders());
    }

    @Test
    @DisplayName("Should overwrite existing cache entry")
    void shouldOverwriteExistingCacheEntry() {
        // Given
        String userId = "user-123";
        cacheService.updateCache(userId, 2, false);

        // When
        cacheService.updateCache(userId, 5, true);
        OrderInfoCacheService.OrderInfo result = cacheService.getCachedInfo(userId);

        // Then
        assertTrue(result.hasOrders());
        assertEquals(5, result.orderCount());
        assertTrue(result.hasActiveOrders());
    }
}