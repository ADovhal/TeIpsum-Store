package com.teipsum.shared.product.enums;

import lombok.Getter;

public enum ProductCategory {
    // Основные категории одежды
    MENS_CLOTHING("Men's Clothing", true, true, true),
    WOMENS_CLOTHING("Women's Clothing", true, true, true),
    KIDS_CLOTHING("Kids' Clothing", true, true, false),
    ACCESSORIES("Accessories", true, true, false),
    SHOES("Shoes", true, true, true);

    @Getter
    private final String displayName;
    private final boolean requiresSubcategory;
    private final boolean requiresGender;
    private final boolean requiresSize;

    ProductCategory(String displayName, boolean requiresSubcategory,
                    boolean requiresGender, boolean requiresSize) {
        this.displayName = displayName;
        this.requiresSubcategory = requiresSubcategory;
        this.requiresGender = requiresGender;
        this.requiresSize = requiresSize;
    }

    public boolean requiresSubcategory() {
        return requiresSubcategory;
    }

    public boolean requiresGender() {
        return requiresGender;
    }

    public boolean requiresSize() {
        return requiresSize;
    }

    public static ProductCategory fromDisplayName(String displayName) {
        for (ProductCategory category : values()) {
            if (category.displayName.equalsIgnoreCase(displayName)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Unknown category: " + displayName);
    }
}