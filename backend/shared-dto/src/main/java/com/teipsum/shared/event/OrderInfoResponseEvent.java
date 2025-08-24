package com.teipsum.shared.event;

import java.time.LocalDateTime;

public record OrderInfoResponseEvent(
        String userId,
        String email,
        int orderCount,
        boolean hasActiveOrders,
        LocalDateTime respondedAt
) {}
