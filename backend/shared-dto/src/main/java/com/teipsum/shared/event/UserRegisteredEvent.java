package com.teipsum.shared.event;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserRegisteredEvent(
        String userId,
        String email,
        String name,
        String surname,
        String phone,
        LocalDate dob,
        LocalDateTime registeredAt,
        Boolean isAdmin
) {
    public UserRegisteredEvent(String userId, String email, String name, String surname, String phone, LocalDate dob, Boolean isAdmin) {
        this(userId, email, name, surname, phone, dob, LocalDateTime.now(), isAdmin);
    }
}
