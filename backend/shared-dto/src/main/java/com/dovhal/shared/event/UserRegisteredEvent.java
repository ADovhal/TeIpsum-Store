package com.dovhal.shared.event;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserRegisteredEvent(
        String userId,
        String email,
        String name,
        String surname,
        String phone,
        LocalDate dob,
        LocalDateTime registeredAt
) {
    public UserRegisteredEvent(String userId, String email, String name, String surname, String phone, LocalDate dob) {
        this(userId, email, name, surname, phone, dob, LocalDateTime.now());
    }
}
