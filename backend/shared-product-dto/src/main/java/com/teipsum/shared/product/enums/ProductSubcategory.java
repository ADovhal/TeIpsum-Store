package com.teipsum.shared.product.enums;

import lombok.Getter;

import java.util.EnumSet;
import java.util.Set;

@Getter
public enum ProductSubcategory {
    // Одежда
    T_SHIRTS("T-Shirts", EnumSet.of(ProductCategory.MENS_CLOTHING, ProductCategory.WOMENS_CLOTHING)),
    SHIRTS("Shirts", EnumSet.of(ProductCategory.MENS_CLOTHING, ProductCategory.WOMENS_CLOTHING)),
    PANTS("Pants", EnumSet.of(ProductCategory.MENS_CLOTHING, ProductCategory.WOMENS_CLOTHING)),
    JEANS("Jeans", EnumSet.of(ProductCategory.MENS_CLOTHING, ProductCategory.WOMENS_CLOTHING, ProductCategory.KIDS_CLOTHING)),
    JACKETS("Jackets", EnumSet.of(ProductCategory.MENS_CLOTHING, ProductCategory.WOMENS_CLOTHING, ProductCategory.KIDS_CLOTHING)),

    // Детская одежда
    BOYS_CLOTHING("Boys' Clothing", EnumSet.of(ProductCategory.KIDS_CLOTHING)),
    GIRLS_CLOTHING("Girls' Clothing", EnumSet.of(ProductCategory.KIDS_CLOTHING)),
    BABY_CLOTHING("Baby Clothing", EnumSet.of(ProductCategory.KIDS_CLOTHING)),

    // Аксессуары
    BAGS("Bags", EnumSet.of(ProductCategory.ACCESSORIES)),
    BELTS("Belts", EnumSet.of(ProductCategory.ACCESSORIES)),
    HATS("Hats", EnumSet.of(ProductCategory.ACCESSORIES)),
    SUNGLASSES("Sunglasses", EnumSet.of(ProductCategory.ACCESSORIES)),

    // Обувь
    SNEAKERS("Sneakers", EnumSet.of(ProductCategory.SHOES)),
    BOOTS("Boots", EnumSet.of(ProductCategory.SHOES)),
    SANDALS("Sandals", EnumSet.of(ProductCategory.SHOES)),
    DRESS_SHOES("Dress Shoes", EnumSet.of(ProductCategory.SHOES));

    private final String displayName;
    private final Set<ProductCategory> parentCategories;

    ProductSubcategory(String displayName, Set<ProductCategory> parentCategories) {
        this.displayName = displayName;
        this.parentCategories = parentCategories;
    }

    public boolean belongsTo(ProductCategory category) {
        return parentCategories.contains(category);
    }

    public static ProductSubcategory fromDisplayName(String displayName) {
        for (ProductSubcategory subcategory : values()) {
            if (subcategory.displayName.equalsIgnoreCase(displayName)) {
                return subcategory;
            }
        }
        throw new IllegalArgumentException("Unknown subcategory: " + displayName);
    }
}