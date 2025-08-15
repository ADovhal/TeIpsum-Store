package com.teipsum.shared.event;

import java.time.LocalDateTime;

/**
 * Event published when user profile deletion is completed.
 * This triggers cleanup in auth-service and other services.
 */
public record UserDeletionCompletedEvent(
        String userId,
        String email,
        LocalDateTime deletedAt,
        String deletedBy // "user" or "admin"
) {
}
