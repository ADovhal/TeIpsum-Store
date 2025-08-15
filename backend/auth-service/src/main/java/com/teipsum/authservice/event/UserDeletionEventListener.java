package com.teipsum.authservice.event;

import com.teipsum.authservice.service.AuthService;
import com.teipsum.shared.event.UserDeletionCompletedEvent;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Listens for user deletion completion events and handles auth cleanup
 */
@Component
@RequiredArgsConstructor
public class UserDeletionEventListener {
    
    private static final Logger logger = LogManager.getLogger(UserDeletionEventListener.class);

    private final AuthService authService;

    @KafkaListener(
            topics = "user-deletion-completed",
            groupId = "auth-service-group"
    )
    public void handleUserDeletionCompleted(UserDeletionCompletedEvent event) {
        logger.info("Received user deletion completed event for user: {} ({})", 
                 event.email(), event.userId());

        // Delete user credentials and auth data
        authService.deleteUserCredentials(event.userId(), event.email());
        
        logger.info("Completed auth cleanup for deleted user: {} ({})", 
                 event.email(), event.userId());
    }
}
