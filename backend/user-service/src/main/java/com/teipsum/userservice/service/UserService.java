package com.teipsum.userservice.service;

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
import org.springframework.kafka.core.KafkaTemplate;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private static final Logger logger = LogManager.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final WebClient.Builder webClientBuilder;

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
        OrderInfo orderInfo = getOrderInfo(userId);
        
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
        UserProfile user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        logger.info("Initiating deletion for user: {} ({})", user.getEmail(), userId);

        // Get order information
        OrderInfo orderInfo = getOrderInfo(userId);

        // Publish deletion requested event - this will trigger order anonymization
        UserDeletionRequestedEvent event = new UserDeletionRequestedEvent(
                userId,
                user.getEmail(),
                LocalDateTime.now(),
                orderInfo.hasOrders(),
                orderInfo.orderCount()
        );

        kafkaTemplate.send("user-deletion-requested", userId, event);
        
        logger.info("Published user deletion requested event for user: {}", userId);
    }

    /**
     * Completes the user deletion after orders are handled
     */
    @Transactional
    public void completeUserDeletion(String userId, String deletedBy) {
        UserProfile user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        String email = user.getEmail();
        
        // Delete user profile
        userRepository.deleteById(userId);
        
        logger.info("Deleted user profile for: {} ({})", email, userId);

        // Publish completion event - this will trigger auth service cleanup
        UserDeletionCompletedEvent event = new UserDeletionCompletedEvent(
                userId,
                email,
                LocalDateTime.now(),
                deletedBy
        );

        kafkaTemplate.send("user-deletion-completed", userId, event);
        
        logger.info("Published user deletion completed event for user: {}", userId);
    }

    /**
     * Gets order information from order-service
     */
    private OrderInfo getOrderInfo(String userId) {
        try {
            WebClient webClient = webClientBuilder.baseUrl("http://order-service:8080").build();
            
            // Call order-service to get order count and status
            OrderInfoResponse response = webClient.get()
                    .uri("/api/orders/user/{userId}/info", userId)
                    .retrieve()
                    .bodyToMono(OrderInfoResponse.class)
                    .block();
                    
            if (response != null) {
                return new OrderInfo(
                    response.orderCount() > 0,
                    response.orderCount(),
                    response.hasActiveOrders()
                );
            }
        } catch (Exception e) {
            logger.warn("Failed to get order info for user {}: {}", userId, e.getMessage());
        }
        
        // Default to no orders if service call fails
        return new OrderInfo(false, 0, false);
    }

    private record OrderInfo(boolean hasOrders, int orderCount, boolean hasActiveOrders) {}
    
    private record OrderInfoResponse(int orderCount, boolean hasActiveOrders) {}
}