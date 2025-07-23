package com.teipsum.shared.product.model;

import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class ProductBase {

    @Column(nullable = false)
    protected String title;

    @Column(columnDefinition = "TEXT")
    protected String description;

    @Column(nullable = false, precision = 10, scale = 2)
    protected BigDecimal price;

    @Column(precision = 5, scale = 2)
    protected BigDecimal discount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    protected ProductCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    protected ProductSubcategory subcategory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    protected Gender gender;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    protected List<String> imageUrls;

    @Column(nullable = false)
    protected boolean available = true;
}

