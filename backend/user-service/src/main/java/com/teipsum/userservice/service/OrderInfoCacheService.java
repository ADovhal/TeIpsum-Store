package com.teipsum.userservice.service;

import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class OrderInfoCacheService {

    private static final Logger logger = LogManager.getLogger(OrderInfoCacheService.class);

    private final Map<String, OrderInfo> cache = new ConcurrentHashMap<>();

    public void updateCache(String userId, int orderCount, boolean hasActiveOrders) {
        cache.put(userId, new OrderInfo(orderCount > 0, orderCount, hasActiveOrders));
        logger.debug("Updated order info cache for user {}: {} orders", userId, orderCount);
    }

    public OrderInfo getCachedInfo(String userId) {
        return cache.getOrDefault(userId, new OrderInfo(false, 0, false));
    }

    public void removeFromCache(String userId) {
        cache.remove(userId);
        logger.debug("Removed user {} from order info cache", userId);
    }

    public record OrderInfo(boolean hasOrders, int orderCount, boolean hasActiveOrders) {}
}
