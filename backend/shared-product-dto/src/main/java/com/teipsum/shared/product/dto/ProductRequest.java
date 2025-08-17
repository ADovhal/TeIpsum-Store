package com.teipsum.shared.product.dto;

import com.teipsum.shared.product.enums.*;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 100, message = "Title must be less than 100 characters")
        String title,

        @Size(max = 1000, message = "Description must be less than 1000 characters")
        String description,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        BigDecimal price,

        @Positive(message = "Discount must be positive")
        @DecimalMax(value = "100.0", inclusive = true, message = "Discount cannot be more than 100%")
        BigDecimal discount,

        @NotNull(message = "Category is required")
        ProductCategory category,

        ProductSubcategory subcategory,

        Gender gender,

        List<@URL(message = "Image URL must be valid") MultipartFile> imageUrls,

        List<String> sizes,

        boolean available
) {}
