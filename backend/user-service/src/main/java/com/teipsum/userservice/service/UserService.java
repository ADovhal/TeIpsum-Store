package com.teipsum.userservice.service;

import com.teipsum.shared.event.OrderInfoRequestEvent;
import com.teipsum.shared.event.OrderInfoResponseEvent;
import com.teipsum.shared.exceptions.ConflictException;
import com.teipsum.shared.exceptions.NotFoundException;
import com.teipsum.shared.exceptions.UserNotFoundException;
import com.teipsum.userservice.model.UserProfile;
import com.teipsum.userservice.repository.UserRepository;
import com.teipsum.shared.event.UserDeletionCompletedEvent;
import com.teipsum.shared.event.UserDeletionRequestedEvent;
import com.teipsum.userservice.dto.UserDeletionInfoResponse;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.service.spi.ServiceException;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private static final Logger logger = LogManager.getLogger(UserService.class);
    private final OrderInfoCacheService orderInfoCacheService;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
//    private final WebClient.Builder webClientBuilder;

    @Transactional
    public void createUserProfile(
            String userId,
            String email,
            String name,
            String surname,
            String phone,
            LocalDate dob,
            Boolean isAdmin
    ) {
        if (userRepository.existsById(userId)) {
            logger.warn("Attempt to create duplicate user profile for userId: {}", userId);
            throw new ConflictException("User profile already exists");
        }
        
        logger.info("Creating user profile for userId: {} with email: {}", userId, email);

        UserProfile profile = new UserProfile();
        profile.setId(userId);
        profile.setEmail(email);
        profile.setName(name);
        profile.setSurname(surname);
        profile.setPhone(phone);
        profile.setDob(dob);
        profile.setIsAdmin(isAdmin);
        profile.setJoinDate(LocalDate.now());
        profile.setLastLoginDate(LocalDateTime.now());
        userRepository.save(profile);
        
        logger.info("Successfully created user profile for userId: {}", userId);
    }

    @Transactional(readOnly = true)
    public UserProfile getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
    }

    @Transactional(readOnly = true)
    public UserProfile getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        }
        return null;
    }

    @Transactional
    public void updateLastLogin(String email, LocalDateTime loginDate) {
        UserProfile user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        user.setLastLoginDate(loginDate);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserProfile getByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public void deleteUserById(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        
        logger.info("Deleting user profile for userId: {}", userId);
        userRepository.deleteById(userId);
        logger.info("Successfully deleted user profile for userId: {}", userId);
    }
    
    @Transactional(readOnly = true)
    public boolean existsById(String userId) {
        return userRepository.existsById(userId);
    }

    /**
     * Gets information about what will be deleted when user deletes account
     */
    @Transactional(readOnly = true)
    public UserDeletionInfoResponse getDeletionInfo(String userId) {
        UserProfile user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        // Get order information from order-service
        OrderInfoCacheService.OrderInfo orderInfo = orderInfoCacheService.getCachedInfo(userId);

        requestOrderInfoUpdate(userId);

        return UserDeletionInfoResponse.of(
                user.getId(),
                user.getEmail(),
                user.getName() + " " + user.getSurname(),
                user.getJoinDate(),
                user.getLastLoginDate(),
                orderInfo.hasOrders(),
                orderInfo.orderCount(),
                orderInfo.hasActiveOrders()
        );
    }

    /**
     * Initiates the user deletion process
     */
    @Transactional
    public void initiateUserDeletion(String userId) {
        try {
            UserProfile user = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

            logger.info("Initiating deletion for user: {} ({})", user.getEmail(), userId);

            UserDeletionRequestedEvent event = new UserDeletionRequestedEvent(
                    userId,
                    user.getEmail(),
                    LocalDateTime.now(),
                    true,
                    0
            );

            kafkaTemplate.send("user-deletion-requested", userId, event)
                    .thenAccept(result ->
                            logger.info("Deletion event sent for user: {}", userId))
                    .exceptionally(ex -> {
                        logger.error("Failed to send deletion event for user {}: {}", userId, ex.getMessage());

                        throw new KafkaException("Failed to send deletion event for user: " + userId);
                    });

            logger.info("Published user deletion requested event for user: {}", userId);
        } catch (Exception e) {
            logger.error("Failed to initiate deletion process: {}", e.getMessage());
            throw new ServiceException("Failed to initiate deletion process");
        }
    }

    /**
     * Completes the user deletion after orders are handled
     */
    @Transactional
    public void completeUserDeletion(String userId, String deletedBy) {
        try {
            UserProfile user = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

            userRepository.deleteById(userId);

            logger.info("Deleted user profile for: {} ({})", user.getEmail(), userId);

            UserDeletionCompletedEvent event = new UserDeletionCompletedEvent(
                    userId,
                    user.getEmail(),
                    LocalDateTime.now(),
                    deletedBy
            );

            kafkaTemplate.send("user-deletion-completed", userId, event)
                    .thenAccept(result ->
                            logger.info("Deleted user profile for: {} ({})", userId))
                    .exceptionally(ex -> {
                                logger.error("Failed to send completion event for user {}: {}", userId, ex.getMessage());
                                throw new KafkaException("Failed to send completion event for user: " + userId);
                    });
            logger.info("Published user deletion completed event for user: {}", userId);

        } catch (Exception e) {
            logger.error("Error completing user deletion for {}: {}", userId, e.getMessage());
            throw new ServiceException("Failed to complete account deletion", e);
        }
    }

    private void requestOrderInfoUpdate(String userId) {
        try {
            UserProfile user = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found"));

            OrderInfoRequestEvent event = new OrderInfoRequestEvent(
                    userId,
                    user.getEmail(),
                    LocalDateTime.now()
            );

            kafkaTemplate.send("order-info-request", userId, event)
                    .thenAccept(result ->
                            logger.debug("Order info request sent for user: {}", userId))
                    .exceptionally(ex -> {
                        logger.warn("Failed to send order info request for user {}: {}",
                                userId, ex.getMessage());
                        return null;
                    });

        } catch (Exception e) {
            logger.warn("Error requesting order info for user {}: {}", userId, e.getMessage());
        }
    }
}