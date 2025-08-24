package com.teipsum.catalogservice.event;

import com.teipsum.shared.product.event.ProductUpdatedEvent;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import com.teipsum.shared.product.enums.Gender;
import com.teipsum.catalogservice.exception.InvalidProductDataException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.net.URL;
import java.util.List;
import java.util.Set;

@Component
public class ProductEventValidator {
    private static final Logger logger = LogManager.getLogger(ProductEventValidator.class);

    private static final Set<ProductSubcategory> REQUIRES_IMAGE_SUBCATEGORIES = Set.of(
            ProductSubcategory.T_SHIRTS,
            ProductSubcategory.SHIRTS,
            ProductSubcategory.DRESS_SHOES
    );

    public void validate(ProductUpdatedEvent event) {
        try {
            validateBasicFields(event);
            validatePrice(event.price());
            validateDiscount(event.discount());
            validateCategories(event);
            validateGender(event.category(), event.gender());
            validateImages(event.category(), event.subcategory(), event.imageUrls());

            logger.debug("Product event validation passed for product: {}", event.id());
        } catch (InvalidProductDataException e) {
            logger.warn("Product validation failed: {}", e.getMessage());
            throw e;
        }
    }

    private void validateBasicFields(ProductUpdatedEvent event) {
        if (event.title() == null || event.title().isBlank()) {
            throw new InvalidProductDataException("Product title cannot be empty");
        }

        if (event.title().length() > 100) {
            throw new InvalidProductDataException("Product title exceeds 100 characters limit");
        }

        if (event.description() != null && event.description().length() > 1000) {
            throw new InvalidProductDataException("Product description exceeds 1000 characters limit");
        }
    }

    private void validatePrice(BigDecimal price) {
        if (price == null) {
            throw new InvalidProductDataException("Product price is required");
        }

        if (price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidProductDataException("Product price must be positive");
        }

        if (price.scale() > 2) {
            throw new InvalidProductDataException("Product price can have max 2 decimal places");
        }

        if (price.compareTo(new BigDecimal("10000")) > 0) {
            throw new InvalidProductDataException("Product price cannot exceed $10,000");
        }
    }

    private void validateDiscount(BigDecimal discount) {
        if (discount != null) {
            if (discount.compareTo(BigDecimal.ZERO) < 0) {
                throw new InvalidProductDataException("Discount cannot be negative");
            }

            if (discount.compareTo(new BigDecimal("100")) > 0) {
                throw new InvalidProductDataException("Discount cannot exceed 100%");
            }

            if (discount.scale() > 2) {
                throw new InvalidProductDataException("Discount can have max 2 decimal places");
            }
        }
    }

    private void validateCategories(ProductUpdatedEvent event) {
        if (event.category() == null) {
            throw new InvalidProductDataException("Product category is required");
        }

        if (event.category().requiresSubcategory() && event.subcategory() == null) {
            throw new InvalidProductDataException(
                    "Subcategory is required for category: " + event.category().getDisplayName());
        }
    }

    private void validateGender(ProductCategory category, Gender gender) {
        if (category.requiresGender() && gender == null) {
            throw new InvalidProductDataException(
                    "Gender is required for category: " + category.getDisplayName());
        }

        if (gender != null) {
            if (category == ProductCategory.TOPS && gender != Gender.MEN) {
                throw new InvalidProductDataException(
                        "Mens clothing category requires MEN gender");
            }

            if (category == ProductCategory.TOPS && gender != Gender.WOMEN) {
                throw new InvalidProductDataException(
                        "Womens clothing category requires WOMEN gender");
            }
        }
    }

    private void validateImages(ProductCategory category, ProductSubcategory subcategory,
                                List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            if (REQUIRES_IMAGE_SUBCATEGORIES.contains(subcategory)) {
                throw new InvalidProductDataException(
                        "At least one image is required for " + subcategory.getDisplayName());
            }
            return;
        }

        if (imageUrls.size() > 10) {
            throw new InvalidProductDataException("Maximum 10 images allowed");
        }

        for (String url : imageUrls) {
            if (!isValidUrl(url)) {
                throw new InvalidProductDataException("Invalid image URL: " + url);
            }

            if (!url.matches("^https?://.+\\.(jpg|jpeg|png|webp)$")) {
                throw new InvalidProductDataException(
                        "Image URL must end with .jpg, .jpeg, .png or .webp");
            }
        }
    }

    private boolean isValidUrl(String url) {
        try {
            new URL(url).toURI();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}