package com.teipsum.orderservice.event;

import com.teipsum.orderservice.service.OrderService;
import com.teipsum.shared.event.UserDeletionRequestedEvent;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Listens for user deletion events and handles order anonymization
 */
@Component
@RequiredArgsConstructor
public class UserDeletionEventListener {
    
    private static final Logger logger = LogManager.getLogger(UserDeletionEventListener.class);

    private final OrderService orderService;

    @KafkaListener(
            topics = "user-deletion-requested",
            groupId = "order-service-group"
    )
    public void handleUserDeletionRequested(UserDeletionRequestedEvent event) {
        logger.info("Received user deletion requested event for user: {} ({})", 
                 event.email(), event.userId());

        UUID userId = UUID.fromString(event.userId());
        
        // Anonymize user's orders instead of deleting them
        orderService.anonymizeUserOrders(userId, event.email());
    }
}
