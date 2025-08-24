package com.teipsum.userservice.event;

import com.teipsum.shared.event.OrderInfoResponseEvent;
import com.teipsum.userservice.service.OrderInfoCacheService;
import com.teipsum.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.teipsum.shared.event.UserLoggedInEvent;
import com.teipsum.shared.event.UserOrdersAnonymizedEvent;
import com.teipsum.shared.event.UserRegisteredEvent;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class UserEventListener {
    
    private static final Logger logger = LogManager.getLogger(UserEventListener.class);
    private final OrderInfoCacheService orderInfoCacheService;
    private final UserService userService;

    @KafkaListener(
            topics = "user-registered",
            groupId = "user-service-group"
    )
    public void handleUserRegistration(UserRegisteredEvent event) {
        userService.createUserProfile(
                event.userId(),
                event.email(),
                event.name(),
                event.surname(),
                event.phone(),
                event.dob(),
                event.isAdmin()
        );
    }

    @KafkaListener(
            topics = "user-login",
            groupId = "user-service-group"
    )
    public void handleUserLogin(UserLoggedInEvent event) {
        userService.updateLastLogin(
                event.email(), 
                event.timestamp()
        );
    }

    @KafkaListener(
            topics = "user-orders-anonymized",
            groupId = "user-service-group"
    )
    public void handleUserOrdersAnonymized(UserOrdersAnonymizedEvent event) {
        logger.info("Received user orders anonymized event for user: {} - {} orders anonymized", 
                 event.userId(), event.anonymizedOrderCount());
        userService.completeUserDeletion(event.userId(), "user");
    }

    @KafkaListener(topics = "order-info-response", groupId = "user-service")
    @Transactional
    public void handleOrderInfoResponse(OrderInfoResponseEvent event) {
        try {
            logger.info("Received order info for user: {} - {} orders",
                    event.userId(), event.orderCount());

            orderInfoCacheService.updateCache(
                    event.userId(),
                    event.orderCount(),
                    event.hasActiveOrders()
            );

        } catch (Exception e) {
            logger.error("Error processing order info response for user {}: {}",
                    event.userId(), e.getMessage());
        }
    }
}