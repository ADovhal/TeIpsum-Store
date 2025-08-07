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
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;
    private static final Logger logger = LogManager.getLogger(AdminProductController.class);

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Create a new product",
            description = "Creates a new product with the provided details and images",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Product created successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ProductResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid input",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = Map.class)
                            )
                    )
            }
    )
    public ProductResponse createProduct(
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        logger.info("Creating product with title: {}", request.title());
        return adminProductService.createProduct(request, images);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Update an existing product",
            description = "Updates an existing product with the provided details and images",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Product updated successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ProductResponse.class)
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
    public ProductResponse updateProduct(
            @PathVariable UUID id,
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return adminProductService.updateProduct(id, request, images);
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
                                    schema = @Schema(implementation = ProductResponse.class)
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
    @ResponseStatus(HttpStatus.OK)
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
    @Operation(
            summary = "Delete a product by ID",
            description = "Deletes a product by its unique ID",
            responses = {
                    @ApiResponse(
                            responseCode = "204",
                            description = "Product deleted successfully"
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