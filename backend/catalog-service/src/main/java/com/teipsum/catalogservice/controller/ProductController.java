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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final CatalogService catalogService;
    private final PagedResourcesAssembler<CatalogProduct> pagedResourcesAssembler;
    private static final Logger logger = LogManager.getLogger(ProductController.class);
    private final ProductDtoConverter dtoConverter;

    @GetMapping
    @Operation(
        summary = "Get all products",
        description = "Retrieves a list of products with optional filtering",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Products found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Page.class)
                )
            )
        }
    )
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
    @Operation(
        summary = "Get product by ID",
        description = "Retrieves a product by its unique ID",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Product found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = CatalogProductDTO.class)
                )
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Product not found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
    public CatalogProductDTO getProduct(@PathVariable String id) {
        logger.debug("Fetching product with ID: {}", id);
        return dtoConverter.convertToDto(catalogService.getProductById(id));
    }
}
