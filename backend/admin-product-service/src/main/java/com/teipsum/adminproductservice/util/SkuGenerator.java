package com.teipsum.adminproductservice.util;

import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Component
public class SkuGenerator {
    
    private static final Random RANDOM = new Random();
    
    public String generateSku(ProductCategory category, ProductSubcategory subcategory, Gender gender) {
        StringBuilder sku = new StringBuilder();
        
        // Category prefix (2 characters)
        sku.append(getCategoryPrefix(category));
        
        // Subcategory prefix (2 characters)
        if (subcategory != null) {
            sku.append(getSubcategoryPrefix(subcategory));
        } else {
            sku.append("00");
        }
        
        // Gender prefix (1 character)
        if (gender != null) {
            sku.append(getGenderPrefix(gender));
        } else {
            sku.append("U");
        }
        
        // Date component (YYMM format)
        String dateComponent = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMM"));
        sku.append(dateComponent);
        
        // Random 4-digit number
        String randomComponent = String.format("%04d", RANDOM.nextInt(10000));
        sku.append(randomComponent);
        
        return sku.toString();
    }
    
    private String getCategoryPrefix(ProductCategory category) {
        return switch (category) {
            case MENS_CLOTHING -> "MC";
            case WOMENS_CLOTHING -> "WC";
            case KIDS_CLOTHING -> "KC";
            case ACCESSORIES -> "AC";
            case SHOES -> "SH";
        };
    }
    
    private String getSubcategoryPrefix(ProductSubcategory subcategory) {
        return switch (subcategory) {
            case T_SHIRTS -> "TS";
            case SHIRTS -> "SH";
            case PANTS -> "PA";
            case JEANS -> "JE";
            case JACKETS -> "JA";
            case BOYS_CLOTHING -> "BC";
            case GIRLS_CLOTHING -> "GC";
            case BABY_CLOTHING -> "BB";
            case BAGS -> "BG";
            case BELTS -> "BE";
            case HATS -> "HA";
            case SUNGLASSES -> "SG";
            case SNEAKERS -> "SN";
            case BOOTS -> "BO";
            case SANDALS -> "SA";
            case DRESS_SHOES -> "DS";
        };
    }
    
    private String getGenderPrefix(Gender gender) {
        return switch (gender) {
            case MEN -> "M";
            case WOMEN -> "W";
            case UNISEX -> "U";
        };
    }
}