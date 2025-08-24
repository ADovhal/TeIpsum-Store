package com.teipsum.shared.event;

import java.time.LocalDateTime;

public record OrderInfoRequestEvent(
        String userId,
        String email,
        LocalDateTime requestedAt
) {}
