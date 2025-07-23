package com.teipsum.shared.product.enums;

import lombok.Getter;

@Getter
public enum Gender {
    MEN("Men"),
    WOMEN("Women"),
    UNISEX("Unisex");

    private final String displayName;

    Gender(String displayName) {
        this.displayName = displayName;
    }

}