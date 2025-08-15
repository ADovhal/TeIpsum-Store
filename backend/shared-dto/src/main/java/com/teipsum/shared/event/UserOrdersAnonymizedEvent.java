package com.teipsum.shared.event;

import java.time.LocalDateTime;

/**
 * Event published when user's orders are anonymized (instead of deleted).
 * This preserves business data while removing personal information.
 */
public record UserOrdersAnonymizedEvent(
        String userId,
        String email,
        int anonymizedOrderCount,
        LocalDateTime anonymizedAt
) {
}
