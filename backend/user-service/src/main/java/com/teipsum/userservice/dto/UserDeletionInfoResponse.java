package com.teipsum.userservice.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response containing information about what will be deleted when user deletes account
 */
public record UserDeletionInfoResponse(
        String userId,
        String email,
        String fullName,
        LocalDate joinDate,
        LocalDateTime lastLogin,
        boolean hasOrders,
        int orderCount,
        boolean hasActiveOrders,
        String warning
) {
    public static UserDeletionInfoResponse of(
            String userId,
            String email,
            String fullName,
            LocalDate joinDate,
            LocalDateTime lastLogin,
            boolean hasOrders,
            int orderCount,
            boolean hasActiveOrders
    ) {
        String warning = hasOrders 
            ? String.format("You have %d order(s) in your history. Deleting your account will anonymize these orders - you won't be able to access them anymore.", orderCount)
            : "Your account will be permanently deleted and cannot be recovered.";
            
        if (hasActiveOrders) {
            warning += " You have active/pending orders that will also be affected.";
        }
        
        return new UserDeletionInfoResponse(
            userId, email, fullName, joinDate, lastLogin, 
            hasOrders, orderCount, hasActiveOrders, warning
        );
    }
}
