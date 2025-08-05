package com.teipsum.catalogservice.util;

import com.teipsum.catalogservice.dto.CatalogProductDTO;
import com.teipsum.catalogservice.model.CatalogProduct;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

@Component
public class ProductDtoConverter {

    private static final Logger logger = LogManager.getLogger(ProductDtoConverter.class);

    public CatalogProductDTO convertToDto(CatalogProduct product) {
        logger.trace("Converting product to DTO: {}", product.getId());
        return CatalogProductDTO.builder()
                .id(product.getId().toString())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .discount(product.getDiscount())
                .category(product.getCategory())
                .subcategory(product.getSubcategory())
                .gender(product.getGender())
                .imageUrls(product.getImageUrls())
                .sizes(product.getSizes())
                .available(product.isAvailable())
                .build();
    }
}