package com.teipsum.shared.product.enums;

import lombok.Getter;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.Set;

/**
 * Comprehensive size system for clothing e-commerce
 */
@Getter
public enum ClothingSize {
    // Standard adult sizes (US/International)
    XXS("XXS", SizeCategory.ADULT, "Extra Extra Small"),
    XS("XS", SizeCategory.ADULT, "Extra Small"),
    S("S", SizeCategory.ADULT, "Small"),
    M("M", SizeCategory.ADULT, "Medium"),
    L("L", SizeCategory.ADULT, "Large"),
    XL("XL", SizeCategory.ADULT, "Extra Large"),
    XXL("XXL", SizeCategory.ADULT, "Extra Extra Large"),
    XXXL("XXXL", SizeCategory.ADULT, "3X Large"),
    
    // Numeric sizes for pants/jeans (waist)
    SIZE_26("26", SizeCategory.ADULT, "Waist 26"),
    SIZE_28("28", SizeCategory.ADULT, "Waist 28"),
    SIZE_30("30", SizeCategory.ADULT, "Waist 30"),
    SIZE_32("32", SizeCategory.ADULT, "Waist 32"),
    SIZE_34("34", SizeCategory.ADULT, "Waist 34"),
    SIZE_36("36", SizeCategory.ADULT, "Waist 36"),
    SIZE_38("38", SizeCategory.ADULT, "Waist 38"),
    SIZE_40("40", SizeCategory.ADULT, "Waist 40"),
    SIZE_42("42", SizeCategory.ADULT, "Waist 42"),
    SIZE_44("44", SizeCategory.ADULT, "Waist 44"),
    
    // Women's dress sizes
    SIZE_0("0", SizeCategory.ADULT, "Size 0"),
    SIZE_2("2", SizeCategory.ADULT, "Size 2"),
    SIZE_4("4", SizeCategory.ADULT, "Size 4"),
    SIZE_6("6", SizeCategory.ADULT, "Size 6"),
    SIZE_8("8", SizeCategory.ADULT, "Size 8"),
    SIZE_10("10", SizeCategory.ADULT, "Size 10"),
    SIZE_12("12", SizeCategory.ADULT, "Size 12"),
    SIZE_14("14", SizeCategory.ADULT, "Size 14"),
    SIZE_16("16", SizeCategory.ADULT, "Size 16"),
    SIZE_18("18", SizeCategory.ADULT, "Size 18"),
    SIZE_20("20", SizeCategory.ADULT, "Size 20"),
    
    // Shoe sizes (US)
    SHOE_5("5", SizeCategory.SHOES, "US 5"),
    SHOE_5_5("5.5", SizeCategory.SHOES, "US 5.5"),
    SHOE_6("6", SizeCategory.SHOES, "US 6"),
    SHOE_6_5("6.5", SizeCategory.SHOES, "US 6.5"),
    SHOE_7("7", SizeCategory.SHOES, "US 7"),
    SHOE_7_5("7.5", SizeCategory.SHOES, "US 7.5"),
    SHOE_8("8", SizeCategory.SHOES, "US 8"),
    SHOE_8_5("8.5", SizeCategory.SHOES, "US 8.5"),
    SHOE_9("9", SizeCategory.SHOES, "US 9"),
    SHOE_9_5("9.5", SizeCategory.SHOES, "US 9.5"),
    SHOE_10("10", SizeCategory.SHOES, "US 10"),
    SHOE_10_5("10.5", SizeCategory.SHOES, "US 10.5"),
    SHOE_11("11", SizeCategory.SHOES, "US 11"),
    SHOE_11_5("11.5", SizeCategory.SHOES, "US 11.5"),
    SHOE_12("12", SizeCategory.SHOES, "US 12"),
    SHOE_13("13", SizeCategory.SHOES, "US 13"),
    SHOE_14("14", SizeCategory.SHOES, "US 14"),
    
    // Kids sizes
    KIDS_2T("2T", SizeCategory.KIDS, "Toddler 2T"),
    KIDS_3T("3T", SizeCategory.KIDS, "Toddler 3T"),
    KIDS_4T("4T", SizeCategory.KIDS, "Toddler 4T"),
    KIDS_XS("XS", SizeCategory.KIDS, "Kids Extra Small"),
    KIDS_S("S", SizeCategory.KIDS, "Kids Small"),
    KIDS_M("M", SizeCategory.KIDS, "Kids Medium"),
    KIDS_L("L", SizeCategory.KIDS, "Kids Large"),
    KIDS_XL("XL", SizeCategory.KIDS, "Kids Extra Large"),
    
    // Kids numeric sizes
    KIDS_4("4", SizeCategory.KIDS, "Kids 4"),
    KIDS_5("5", SizeCategory.KIDS, "Kids 5"),
    KIDS_6("6", SizeCategory.KIDS, "Kids 6"),
    KIDS_7("7", SizeCategory.KIDS, "Kids 7"),
    KIDS_8("8", SizeCategory.KIDS, "Kids 8"),
    KIDS_10("10", SizeCategory.KIDS, "Kids 10"),
    KIDS_12("12", SizeCategory.KIDS, "Kids 12"),
    KIDS_14("14", SizeCategory.KIDS, "Kids 14"),
    KIDS_16("16", SizeCategory.KIDS, "Kids 16"),
    
    // Baby sizes
    BABY_NB("NB", SizeCategory.BABY, "Newborn"),
    BABY_0_3M("0-3M", SizeCategory.BABY, "0-3 Months"),
    BABY_3_6M("3-6M", SizeCategory.BABY, "3-6 Months"),
    BABY_6_9M("6-9M", SizeCategory.BABY, "6-9 Months"),
    BABY_9_12M("9-12M", SizeCategory.BABY, "9-12 Months"),
    BABY_12_18M("12-18M", SizeCategory.BABY, "12-18 Months"),
    BABY_18_24M("18-24M", SizeCategory.BABY, "18-24 Months"),
    
    // One size fits all
    ONE_SIZE("One Size", SizeCategory.ACCESSORIES, "One Size Fits All");

    private final String code;
    private final SizeCategory category;
    private final String displayName;

    ClothingSize(String code, SizeCategory category, String displayName) {
        this.code = code;
        this.category = category;
        this.displayName = displayName;
    }

    public enum SizeCategory {
        ADULT, KIDS, BABY, SHOES, ACCESSORIES
    }

    /**
     * Get sizes for a specific category
     */
    public static Set<ClothingSize> getSizesForCategory(SizeCategory category) {
        Set<ClothingSize> result = EnumSet.noneOf(ClothingSize.class);
        for (ClothingSize size : values()) {
            if (size.category == category) {
                result.add(size);
            }
        }
        return result;
    }

    /**
     * Get appropriate sizes based on product category and gender
     */
    public static Set<ClothingSize> getAppropriateSizes(ProductCategory productCategory, Gender gender) {
        if (productCategory == ProductCategory.SHOES) {
            return getSizesForCategory(SizeCategory.SHOES);
        }
        
        if (productCategory == ProductCategory.ACCESSORIES || 
            productCategory == ProductCategory.BAGS || 
            productCategory == ProductCategory.JEWELRY) {
            return EnumSet.of(ONE_SIZE);
        }
        
        if (productCategory == ProductCategory.BABY) {
            return getSizesForCategory(SizeCategory.BABY);
        }
        
        if (productCategory == ProductCategory.KIDS) {
            return getSizesForCategory(SizeCategory.KIDS);
        }
        
        // Adult sizes for all other categories
        return getSizesForCategory(SizeCategory.ADULT);
    }

    public static ClothingSize fromCode(String code) {
        return Arrays.stream(values())
                .filter(size -> size.code.equalsIgnoreCase(code))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown size code: " + code));
    }

    public static ClothingSize fromDisplayName(String displayName) {
        return Arrays.stream(values())
                .filter(size -> size.displayName.equalsIgnoreCase(displayName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown size: " + displayName));
    }
}

