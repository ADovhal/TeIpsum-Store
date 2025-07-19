package com.dovhal.shared.event;

import java.time.LocalDateTime;

public record UserLoggedInEvent(
    String email,
    LocalDateTime timestamp
) {}