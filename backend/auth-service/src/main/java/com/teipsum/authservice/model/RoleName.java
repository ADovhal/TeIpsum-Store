package com.teipsum.authservice.model;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum RoleName {
    ROLE_USER("USER"),
    ROLE_ADMIN("ADMIN");

    private final String value;

    RoleName(String value) {
        this.value = value;
    }

    public static RoleName fromValue(String value) {
        return Arrays.stream(values())
                .filter(role -> role.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown role value: " + value));
    }
}