package com.teipsum.shared.product.enums;

import lombok.Getter;

/**
 * Main product categories for a comprehensive clothing e-commerce store
 */
public enum ProductCategory {
    // Main clothing categories
    TOPS("Tops", true, true, true),
    BOTTOMS("Bottoms", true, true, true),
    DRESSES_SKIRTS("Dresses & Skirts", true, true, true),
    OUTERWEAR("Outerwear", true, true, true),
    UNDERWEAR_SLEEPWEAR("Underwear & Sleepwear", true, true, true),
    ACTIVEWEAR("Activewear", true, true, true),
    SWIMWEAR("Swimwear", true, true, true),
    
    // Footwear
    SHOES("Shoes", true, true, true),
    
    // Accessories
    ACCESSORIES("Accessories", true, false, false),
    BAGS("Bags", true, false, false),
    JEWELRY("Jewelry", true, false, false),
    
    // Special categories
    KIDS("Kids", true, true, true),
    BABY("Baby", true, true, true);

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