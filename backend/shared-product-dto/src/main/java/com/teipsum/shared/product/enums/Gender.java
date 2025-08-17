package com.teipsum.shared.product.enums;

import lombok.Getter;

/**
 * Gender categories for clothing products
 */
@Getter
public enum Gender {
    MEN("Men"),
    WOMEN("Women"),
    BOYS("Boys"),
    GIRLS("Girls"),
    BABY_BOY("Baby Boy"),
    BABY_GIRL("Baby Girl"),
    UNISEX("Unisex");

    private final String displayName;

    Gender(String displayName) {
        this.displayName = displayName;
    }

    public static Gender fromDisplayName(String displayName) {
        for (Gender gender : values()) {
            if (gender.displayName.equalsIgnoreCase(displayName)) {
                return gender;
            }
        }
        throw new IllegalArgumentException("Unknown gender: " + displayName);
    }

    /**
     * Check if this gender is for adult clothing
     */
    public boolean isAdult() {
        return this == MEN || this == WOMEN || this == UNISEX;
    }

    /**
     * Check if this gender is for kids clothing
     */
    public boolean isKids() {
        return this == BOYS || this == GIRLS;
    }

    /**
     * Check if this gender is for baby clothing
     */
    public boolean isBaby() {
        return this == BABY_BOY || this == BABY_GIRL;
    }
}