package com.teipsum.adminproductservice.controller;

import com.teipsum.shared.product.dto.ProductFilterRequest;
import com.teipsum.shared.product.dto.ProductRequest;
import com.teipsum.adminproductservice.dto.*;
import com.teipsum.adminproductservice.service.AdminProductService;
import com.teipsum.shared.exceptions.ProductNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;
    private static final Logger logger = LogManager.getLogger(AdminProductController.class);
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse createProduct(@RequestBody @Valid ProductRequest request) {
        logger.info("Creating product with title: {}", request.title());
        try {
            ProductResponse response = adminProductService.createProduct(request);
            logger.debug("Successfully created product with ID: {}", response.id());
            return response;
        } catch (Exception e) {
            logger.error("Failed to create product: {}", e.getMessage());
            throw e;
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse updateProduct(
            @PathVariable UUID id,
            @RequestBody @Valid ProductRequest request
    ) {
        logger.info("Updating product with ID: {}", id);
        try {
            ProductResponse response = adminProductService.updateProduct(id, request);
            logger.debug("Successfully updated product with ID: {}", id);
            return response;
        } catch (ProductNotFoundException e) {
            logger.warn("Product not found for update: {}", id);
            throw e;
        } catch (Exception e) {
            logger.error("Failed to update product {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ProductResponse getProduct(@PathVariable UUID id) {
        logger.debug("Fetching product with ID: {}", id);
        try {
            ProductResponse response = adminProductService.getProduct(id);
            logger.trace("Found product: {}", response);
            return response;
        } catch (ProductNotFoundException e) {
            logger.warn("Product not found: {}", id);
            throw e;
        }
    }

    @GetMapping
    public Page<ProductResponse> getAllProducts(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @ModelAttribute @Valid ProductFilterRequest filter
    ) {
        logger.debug("Fetching products with filter: {}", filter);
        try {
            Page<ProductResponse> response = adminProductService.getAllProducts(filter, pageable);
            logger.trace("Found {} products", response.getTotalElements());
            return response;
        } catch (Exception e) {
            logger.error("Failed to fetch products: {}", e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(@PathVariable UUID id) {
        logger.info("Deleting product with ID: {}", id);
        try {
            adminProductService.deleteProduct(id);
            logger.debug("Successfully deleted product with ID: {}", id);
        } catch (ProductNotFoundException e) {
            logger.warn("Product not found for deletion: {}", id);
            throw e;
        } catch (Exception e) {
            logger.error("Failed to delete product {}: {}", id, e.getMessage());
            throw e;
        }
    }
}
