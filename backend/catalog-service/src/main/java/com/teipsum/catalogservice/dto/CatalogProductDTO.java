package com.teipsum.catalogservice.dto;

import com.teipsum.shared.product.enums.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogProductDTO {
    private String id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal discount;
    private ProductCategory category;
    private ProductSubcategory subcategory;
    private Gender gender;
    private List<String> imageUrls;
    private List<String> sizes;
    private boolean available;
}