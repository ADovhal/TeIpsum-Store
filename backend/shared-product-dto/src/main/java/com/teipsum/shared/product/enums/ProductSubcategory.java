package com.teipsum.shared.product.enums;

import lombok.Getter;

import java.util.EnumSet;
import java.util.Set;

/**
 * Comprehensive subcategories for clothing e-commerce store
 */
@Getter
public enum ProductSubcategory {
    // TOPS subcategories
    T_SHIRTS("T-Shirts", EnumSet.of(ProductCategory.TOPS)),
    SHIRTS("Shirts", EnumSet.of(ProductCategory.TOPS)),
    BLOUSES("Blouses", EnumSet.of(ProductCategory.TOPS)),
    TANK_TOPS("Tank Tops", EnumSet.of(ProductCategory.TOPS)),
    HOODIES("Hoodies", EnumSet.of(ProductCategory.TOPS)),
    SWEATERS("Sweaters", EnumSet.of(ProductCategory.TOPS)),
    CARDIGANS("Cardigans", EnumSet.of(ProductCategory.TOPS)),
    CROP_TOPS("Crop Tops", EnumSet.of(ProductCategory.TOPS)),
    POLO_SHIRTS("Polo Shirts", EnumSet.of(ProductCategory.TOPS)),
    
    // BOTTOMS subcategories
    JEANS("Jeans", EnumSet.of(ProductCategory.BOTTOMS)),
    PANTS("Pants", EnumSet.of(ProductCategory.BOTTOMS)),
    SHORTS("Shorts", EnumSet.of(ProductCategory.BOTTOMS)),
    LEGGINGS("Leggings", EnumSet.of(ProductCategory.BOTTOMS)),
    JOGGERS("Joggers", EnumSet.of(ProductCategory.BOTTOMS)),
    CHINOS("Chinos", EnumSet.of(ProductCategory.BOTTOMS)),
    CARGO_PANTS("Cargo Pants", EnumSet.of(ProductCategory.BOTTOMS)),
    
    // DRESSES & SKIRTS subcategories
    CASUAL_DRESSES("Casual Dresses", EnumSet.of(ProductCategory.DRESSES_SKIRTS)),
    FORMAL_DRESSES("Formal Dresses", EnumSet.of(ProductCategory.DRESSES_SKIRTS)),
    EVENING_DRESSES("Evening Dresses", EnumSet.of(ProductCategory.DRESSES_SKIRTS)),
    MAXI_DRESSES("Maxi Dresses", EnumSet.of(ProductCategory.DRESSES_SKIRTS)),
    MINI_SKIRTS("Mini Skirts", EnumSet.of(ProductCategory.DRESSES_SKIRTS)),
    MIDI_SKIRTS("Midi Skirts", EnumSet.of(ProductCategory.DRESSES_SKIRTS)),
    MAXI_SKIRTS("Maxi Skirts", EnumSet.of(ProductCategory.DRESSES_SKIRTS)),
    
    // OUTERWEAR subcategories
    COATS("Coats", EnumSet.of(ProductCategory.OUTERWEAR)),
    JACKETS("Jackets", EnumSet.of(ProductCategory.OUTERWEAR)),
    BLAZERS("Blazers", EnumSet.of(ProductCategory.OUTERWEAR)),
    VESTS("Vests", EnumSet.of(ProductCategory.OUTERWEAR)),
    PARKAS("Parkas", EnumSet.of(ProductCategory.OUTERWEAR)),
    BOMBER_JACKETS("Bomber Jackets", EnumSet.of(ProductCategory.OUTERWEAR)),
    LEATHER_JACKETS("Leather Jackets", EnumSet.of(ProductCategory.OUTERWEAR)),
    
    // UNDERWEAR & SLEEPWEAR subcategories
    BRAS("Bras", EnumSet.of(ProductCategory.UNDERWEAR_SLEEPWEAR)),
    PANTIES("Panties", EnumSet.of(ProductCategory.UNDERWEAR_SLEEPWEAR)),
    BOXERS("Boxers", EnumSet.of(ProductCategory.UNDERWEAR_SLEEPWEAR)),
    BRIEFS("Briefs", EnumSet.of(ProductCategory.UNDERWEAR_SLEEPWEAR)),
    PAJAMAS("Pajamas", EnumSet.of(ProductCategory.UNDERWEAR_SLEEPWEAR)),
    NIGHTGOWNS("Nightgowns", EnumSet.of(ProductCategory.UNDERWEAR_SLEEPWEAR)),
    ROBES("Robes", EnumSet.of(ProductCategory.UNDERWEAR_SLEEPWEAR)),
    LOUNGEWEAR("Loungewear", EnumSet.of(ProductCategory.UNDERWEAR_SLEEPWEAR)),
    
    // ACTIVEWEAR subcategories
    SPORTS_TOPS("Sports Tops", EnumSet.of(ProductCategory.ACTIVEWEAR)),
    SPORTS_BOTTOMS("Sports Bottoms", EnumSet.of(ProductCategory.ACTIVEWEAR)),
    TRACKSUITS("Tracksuits", EnumSet.of(ProductCategory.ACTIVEWEAR)),
    YOGA_WEAR("Yoga Wear", EnumSet.of(ProductCategory.ACTIVEWEAR)),
    GYM_WEAR("Gym Wear", EnumSet.of(ProductCategory.ACTIVEWEAR)),
    RUNNING_GEAR("Running Gear", EnumSet.of(ProductCategory.ACTIVEWEAR)),
    
    // SWIMWEAR subcategories
    BIKINIS("Bikinis", EnumSet.of(ProductCategory.SWIMWEAR)),
    ONE_PIECE("One Piece", EnumSet.of(ProductCategory.SWIMWEAR)),
    SWIM_TRUNKS("Swim Trunks", EnumSet.of(ProductCategory.SWIMWEAR)),
    BOARD_SHORTS("Board Shorts", EnumSet.of(ProductCategory.SWIMWEAR)),
    COVER_UPS("Cover Ups", EnumSet.of(ProductCategory.SWIMWEAR)),
    
    // SHOES subcategories
    SNEAKERS("Sneakers", EnumSet.of(ProductCategory.SHOES)),
    BOOTS("Boots", EnumSet.of(ProductCategory.SHOES)),
    SANDALS("Sandals", EnumSet.of(ProductCategory.SHOES)),
    HIGH_HEELS("High Heels", EnumSet.of(ProductCategory.SHOES)),
    FLATS("Flats", EnumSet.of(ProductCategory.SHOES)),
    DRESS_SHOES("Dress Shoes", EnumSet.of(ProductCategory.SHOES)),
    ATHLETIC_SHOES("Athletic Shoes", EnumSet.of(ProductCategory.SHOES)),
    LOAFERS("Loafers", EnumSet.of(ProductCategory.SHOES)),
    
    // ACCESSORIES subcategories
    BELTS("Belts", EnumSet.of(ProductCategory.ACCESSORIES)),
    HATS("Hats", EnumSet.of(ProductCategory.ACCESSORIES)),
    CAPS("Caps", EnumSet.of(ProductCategory.ACCESSORIES)),
    SCARVES("Scarves", EnumSet.of(ProductCategory.ACCESSORIES)),
    GLOVES("Gloves", EnumSet.of(ProductCategory.ACCESSORIES)),
    SUNGLASSES("Sunglasses", EnumSet.of(ProductCategory.ACCESSORIES)),
    WATCHES("Watches", EnumSet.of(ProductCategory.ACCESSORIES)),
    TIES("Ties", EnumSet.of(ProductCategory.ACCESSORIES)),
    
    // BAGS subcategories
    HANDBAGS("Handbags", EnumSet.of(ProductCategory.BAGS)),
    BACKPACKS("Backpacks", EnumSet.of(ProductCategory.BAGS)),
    TOTE_BAGS("Tote Bags", EnumSet.of(ProductCategory.BAGS)),
    CROSSBODY_BAGS("Crossbody Bags", EnumSet.of(ProductCategory.BAGS)),
    CLUTCHES("Clutches", EnumSet.of(ProductCategory.BAGS)),
    WALLETS("Wallets", EnumSet.of(ProductCategory.BAGS)),
    BRIEFCASES("Briefcases", EnumSet.of(ProductCategory.BAGS)),
    
    // JEWELRY subcategories
    NECKLACES("Necklaces", EnumSet.of(ProductCategory.JEWELRY)),
    EARRINGS("Earrings", EnumSet.of(ProductCategory.JEWELRY)),
    BRACELETS("Bracelets", EnumSet.of(ProductCategory.JEWELRY)),
    RINGS("Rings", EnumSet.of(ProductCategory.JEWELRY)),
    BROOCHES("Brooches", EnumSet.of(ProductCategory.JEWELRY)),
    
    // KIDS subcategories
    BOYS_TOPS("Boys' Tops", EnumSet.of(ProductCategory.KIDS)),
    BOYS_BOTTOMS("Boys' Bottoms", EnumSet.of(ProductCategory.KIDS)),
    BOYS_OUTERWEAR("Boys' Outerwear", EnumSet.of(ProductCategory.KIDS)),
    GIRLS_TOPS("Girls' Tops", EnumSet.of(ProductCategory.KIDS)),
    GIRLS_BOTTOMS("Girls' Bottoms", EnumSet.of(ProductCategory.KIDS)),
    GIRLS_DRESSES("Girls' Dresses", EnumSet.of(ProductCategory.KIDS)),
    GIRLS_OUTERWEAR("Girls' Outerwear", EnumSet.of(ProductCategory.KIDS)),
    KIDS_SHOES("Kids' Shoes", EnumSet.of(ProductCategory.KIDS)),
    KIDS_ACCESSORIES("Kids' Accessories", EnumSet.of(ProductCategory.KIDS)),
    
    // BABY subcategories
    BABY_BODYSUITS("Baby Bodysuits", EnumSet.of(ProductCategory.BABY)),
    BABY_SLEEPWEAR("Baby Sleepwear", EnumSet.of(ProductCategory.BABY)),
    BABY_OUTERWEAR("Baby Outerwear", EnumSet.of(ProductCategory.BABY)),
    BABY_SHOES("Baby Shoes", EnumSet.of(ProductCategory.BABY)),
    BABY_ACCESSORIES("Baby Accessories", EnumSet.of(ProductCategory.BABY));

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
    
    /**
     * Get all subcategories for a given parent category
     */
    public static Set<ProductSubcategory> getSubcategoriesFor(ProductCategory category) {
        Set<ProductSubcategory> result = EnumSet.noneOf(ProductSubcategory.class);
        for (ProductSubcategory subcategory : values()) {
            if (subcategory.belongsTo(category)) {
                result.add(subcategory);
            }
        }
        return result;
    }
}