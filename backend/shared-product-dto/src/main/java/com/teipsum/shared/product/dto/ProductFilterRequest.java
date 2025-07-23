package com.teipsum.shared.product.dto;

import com.teipsum.shared.product.enums.*;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;

public record ProductFilterRequest(
        String searchQuery,
        ProductCategory category,
        ProductSubcategory subcategory,
        Gender gender,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        BigDecimal minDiscount,
        BigDecimal maxDiscount,
        Boolean available,
        Sort.Direction sortDirection,
        String sortBy
) {}
