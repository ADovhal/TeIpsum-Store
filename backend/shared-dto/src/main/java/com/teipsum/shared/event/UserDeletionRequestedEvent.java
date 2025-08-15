package com.teipsum.shared.event;

import java.time.LocalDateTime;

/**
 * Event published when a user requests account deletion.
 * This event triggers the coordinated deletion process across services.
 */
public record UserDeletionRequestedEvent(
        String userId,
        String email,
        LocalDateTime requestedAt,
        boolean hasOrders,
        int orderCount
) {
}
