package com.teipsum.adminproductservice.dto;

import com.teipsum.shared.product.enums.*;
import com.teipsum.adminproductservice.model.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String sku,
        String title,
        String description,
        BigDecimal price,
        BigDecimal discount,
        ProductCategory category,
        ProductSubcategory subcategory,
        Gender gender,
        List<String> imageUrls,
        List<String> sizes,
        boolean available,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String createdBy,
        String updatedBy
) {
    public static ProductResponse fromEntity(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getTitle(),
                product.getDescription(),
                product.getPrice(),
                product.getDiscount(),
                product.getCategory(),
                product.getSubcategory(),
                product.getGender(),
                product.getImageUrls(),
                product.getSizes(),
                product.isAvailable(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                product.getCreatedBy(),
                product.getUpdatedBy()
        );
    }
}