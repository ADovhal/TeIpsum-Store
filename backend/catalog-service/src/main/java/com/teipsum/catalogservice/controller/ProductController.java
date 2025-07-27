package com.teipsum.catalogservice.controller;

import com.teipsum.catalogservice.dto.CatalogProductDTO;
import com.teipsum.catalogservice.model.CatalogProduct;
import com.teipsum.catalogservice.service.CatalogService;
import com.teipsum.catalogservice.util.ProductDtoConverter;
import com.teipsum.shared.product.dto.ProductFilterRequest;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final CatalogService catalogService;
    private final PagedResourcesAssembler<CatalogProduct> pagedResourcesAssembler;
    private static final Logger logger = LogManager.getLogger(ProductController.class);
    private final ProductDtoConverter dtoConverter;

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<CatalogProductDTO>>> getFilteredProducts(
            ProductFilterRequest filter,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        logger.debug("Fetching filtered products with: {}", filter);
        try {
            Page<CatalogProduct> products = catalogService.getFilteredProducts(filter, pageable);
            logger.trace("Found {} matching products", products.getTotalElements());

            PagedModel<EntityModel<CatalogProductDTO>> pagedModel = pagedResourcesAssembler.toModel(
                    products,
                    product -> EntityModel.of(dtoConverter.convertToDto(product))
            );
            return ResponseEntity.ok(pagedModel);
        } catch (Exception e) {
            logger.error("Failed to fetch filtered products: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    public CatalogProductDTO getProduct(@PathVariable String id) {
        logger.debug("Fetching product with ID: {}", id);
        return dtoConverter.convertToDto(catalogService.getProductById(id));
    }
}
