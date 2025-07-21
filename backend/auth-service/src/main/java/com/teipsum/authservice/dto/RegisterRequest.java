package com.teipsum.authservice.dto;

import java.time.LocalDate;

public record RegisterRequest(
        String email,
        String password,
        String name,
        String surname,
        String phone,
        LocalDate dob
) {}