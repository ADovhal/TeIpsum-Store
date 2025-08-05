package com.teipsum.shared.product.event;

import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;

import java.math.BigDecimal;
import java.util.List;

public record ProductUpdatedEvent(
        String id,
        String title,
        String description,
        BigDecimal price,
        BigDecimal discount,
        ProductCategory category,
        ProductSubcategory subcategory,
        Gender gender,
        List<String> imageUrls,
        List<String> sizes,
        boolean available
) {}