package com.teipsum.adminproductservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teipsum.adminproductservice.dto.ProductResponse;
import com.teipsum.adminproductservice.exception.ProductAlreadyExistsException;
import com.teipsum.adminproductservice.service.AdminProductService;
import com.teipsum.shared.exceptions.ProductNotFoundException;
import com.teipsum.shared.product.dto.ProductFilterRequest;
import com.teipsum.shared.product.dto.ProductRequest;
import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminProductController.class)
@DisplayName("AdminProductController Tests")
class AdminProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminProductService adminProductService;

    private ProductRequest productRequest;
    private ProductResponse productResponse;
    private MockMultipartFile productRequestFile;
    private MockMultipartFile imageFile1;
    private MockMultipartFile imageFile2;

    @BeforeEach
    void setUp() throws Exception {
        productRequest = new ProductRequest(
                "Test Product",
                "Test Description",
                new BigDecimal("99.99"),
                new BigDecimal("10.00"),
                ProductCategory.CLOTHING,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of("S", "M", "L"),
                true
        );

        productResponse = new ProductResponse(
                UUID.randomUUID(),
                "TEST-SKU-001",
                "Test Product",
                "Test Description",
                new BigDecimal("99.99"),
                new BigDecimal("10.00"),
                ProductCategory.CLOTHING,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of("url1", "url2"),
                List.of("S", "M", "L"),
                true,
                LocalDateTime.now(),
                LocalDateTime.now(),
                "admin",
                "admin"
        );

        productRequestFile = new MockMultipartFile(
                "product",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(productRequest)
        );

        imageFile1 = new MockMultipartFile(
                "images",
                "image1.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image 1".getBytes()
        );

        imageFile2 = new MockMultipartFile(
                "images",
                "image2.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image 2".getBytes()
        );
    }

    @Test
    @DisplayName("Should create product successfully")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldCreateProductSuccessfully() throws Exception {
        // Given
        when(adminProductService.createProduct(any(ProductRequest.class), anyList()))
                .thenReturn(productResponse);

        // When & Then
        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .file(imageFile1)
                        .file(imageFile2)
                        .with(csrf())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(productResponse.id().toString()))
                .andExpect(jsonPath("$.title").value("Test Product"))
                .andExpect(jsonPath("$.price").value(99.99))
                .andExpect(jsonPath("$.sku").value("TEST-SKU-001"));

        verify(adminProductService).createProduct(any(ProductRequest.class), anyList());
    }

    @Test
    @DisplayName("Should create product without images")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldCreateProductWithoutImages() throws Exception {
        // Given
        when(adminProductService.createProduct(any(ProductRequest.class), isNull()))
                .thenReturn(productResponse);

        // When & Then
        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .with(csrf())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Test Product"));

        verify(adminProductService).createProduct(any(ProductRequest.class), isNull());
    }

    @Test
    @DisplayName("Should return forbidden when non-admin tries to create product")
    @WithMockUser(authorities = {"ROLE_USER"})
    void shouldReturnForbiddenWhenNonAdminTriesToCreateProduct() throws Exception {
        // When & Then
        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .file(imageFile1)
                        .with(csrf())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isForbidden());

        verify(adminProductService, never()).createProduct(any(), any());
    }

    @Test
    @DisplayName("Should return conflict when product already exists")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldReturnConflictWhenProductAlreadyExists() throws Exception {
        // Given
        when(adminProductService.createProduct(any(ProductRequest.class), anyList()))
                .thenThrow(new ProductAlreadyExistsException("Test Product"));

        // When & Then
        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .file(imageFile1)
                        .with(csrf())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").exists());

        verify(adminProductService).createProduct(any(ProductRequest.class), anyList());
    }

    @Test
    @DisplayName("Should update product successfully")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldUpdateProductSuccessfully() throws Exception {
        // Given
        UUID productId = UUID.randomUUID();
        when(adminProductService.updateProduct(eq(productId), any(ProductRequest.class), anyList()))
                .thenReturn(productResponse);

        // When & Then
        mockMvc.perform(multipart("/api/admin/products/{id}", productId)
                        .file(productRequestFile)
                        .file(imageFile1)
                        .with(csrf())
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        })
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productResponse.id().toString()))
                .andExpect(jsonPath("$.title").value("Test Product"));

        verify(adminProductService).updateProduct(eq(productId), any(ProductRequest.class), anyList());
    }

    @Test
    @DisplayName("Should return not found when updating non-existent product")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldReturnNotFoundWhenUpdatingNonExistentProduct() throws Exception {
        // Given
        UUID productId = UUID.randomUUID();
        when(adminProductService.updateProduct(eq(productId), any(ProductRequest.class), anyList()))
                .thenThrow(new ProductNotFoundException(productId));

        // When & Then
        mockMvc.perform(multipart("/api/admin/products/{id}", productId)
                        .file(productRequestFile)
                        .with(csrf())
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        })
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());

        verify(adminProductService).updateProduct(eq(productId), any(ProductRequest.class), anyList());
    }

    @Test
    @DisplayName("Should get product by id successfully")
    void shouldGetProductByIdSuccessfully() throws Exception {
        // Given
        UUID productId = UUID.randomUUID();
        when(adminProductService.getProduct(productId)).thenReturn(productResponse);

        // When & Then
        mockMvc.perform(get("/api/admin/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productResponse.id().toString()))
                .andExpect(jsonPath("$.title").value("Test Product"))
                .andExpect(jsonPath("$.price").value(99.99));

        verify(adminProductService).getProduct(productId);
    }

    @Test
    @DisplayName("Should return not found when getting non-existent product")
    void shouldReturnNotFoundWhenGettingNonExistentProduct() throws Exception {
        // Given
        UUID productId = UUID.randomUUID();
        when(adminProductService.getProduct(productId))
                .thenThrow(new ProductNotFoundException(productId));

        // When & Then
        mockMvc.perform(get("/api/admin/products/{id}", productId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());

        verify(adminProductService).getProduct(productId);
    }

    @Test
    @DisplayName("Should get all products successfully")
    void shouldGetAllProductsSuccessfully() throws Exception {
        // Given
        Page<ProductResponse> productPage = new PageImpl<>(List.of(productResponse));
        when(adminProductService.getAllProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenReturn(productPage);

        // When & Then
        mockMvc.perform(get("/api/admin/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].title").value("Test Product"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(adminProductService).getAllProducts(any(ProductFilterRequest.class), any(Pageable.class));
    }

    @Test
    @DisplayName("Should get products with filters")
    void shouldGetProductsWithFilters() throws Exception {
        // Given
        Page<ProductResponse> productPage = new PageImpl<>(List.of(productResponse));
        when(adminProductService.getAllProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenReturn(productPage);

        // When & Then
        mockMvc.perform(get("/api/admin/products")
                        .param("title", "Test")
                        .param("category", "CLOTHING")
                        .param("subcategory", "T_SHIRTS")
                        .param("gender", "UNISEX")
                        .param("minPrice", "50")
                        .param("maxPrice", "150")
                        .param("available", "true")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(adminProductService).getAllProducts(any(ProductFilterRequest.class), any(Pageable.class));
    }

    @Test
    @DisplayName("Should delete product successfully")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldDeleteProductSuccessfully() throws Exception {
        // Given
        UUID productId = UUID.randomUUID();
        doNothing().when(adminProductService).deleteProduct(productId);

        // When & Then
        mockMvc.perform(delete("/api/admin/products/{id}", productId)
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(adminProductService).deleteProduct(productId);
    }

    @Test
    @DisplayName("Should return forbidden when non-admin tries to delete product")
    @WithMockUser(authorities = {"ROLE_USER"})
    void shouldReturnForbiddenWhenNonAdminTriesToDeleteProduct() throws Exception {
        // Given
        UUID productId = UUID.randomUUID();

        // When & Then
        mockMvc.perform(delete("/api/admin/products/{id}", productId)
                        .with(csrf()))
                .andExpect(status().isForbidden());

        verify(adminProductService, never()).deleteProduct(any());
    }

    @Test
    @DisplayName("Should return not found when deleting non-existent product")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldReturnNotFoundWhenDeletingNonExistentProduct() throws Exception {
        // Given
        UUID productId = UUID.randomUUID();
        doThrow(new ProductNotFoundException(productId))
                .when(adminProductService).deleteProduct(productId);

        // When & Then
        mockMvc.perform(delete("/api/admin/products/{id}", productId)
                        .with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());

        verify(adminProductService).deleteProduct(productId);
    }

    @Test
    @DisplayName("Should require authentication for admin endpoints")
    void shouldRequireAuthenticationForAdminEndpoints() throws Exception {
        // When & Then - create product without authentication
        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .with(csrf())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isUnauthorized());

        // When & Then - delete product without authentication
        mockMvc.perform(delete("/api/admin/products/{id}", UUID.randomUUID())
                        .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(adminProductService, never()).createProduct(any(), any());
        verify(adminProductService, never()).deleteProduct(any());
    }

    @Test
    @DisplayName("Should require CSRF token for modifying operations")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldRequireCsrfTokenForModifyingOperations() throws Exception {
        // When & Then - create product without CSRF
        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isForbidden());

        // When & Then - delete product without CSRF
        mockMvc.perform(delete("/api/admin/products/{id}", UUID.randomUUID()))
                .andExpect(status().isForbidden());

        verify(adminProductService, never()).createProduct(any(), any());
        verify(adminProductService, never()).deleteProduct(any());
    }

    @Test
    @DisplayName("Should handle invalid UUID in path parameter")
    void shouldHandleInvalidUuidInPathParameter() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/admin/products/invalid-uuid"))
                .andExpect(status().isBadRequest());

        verify(adminProductService, never()).getProduct(any());
    }

    @Test
    @DisplayName("Should handle malformed product request")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldHandleMalformedProductRequest() throws Exception {
        // Given - malformed JSON
        MockMultipartFile malformedRequest = new MockMultipartFile(
                "product",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                "{\"title\":\"Test\",\"price\":}".getBytes() // malformed JSON
        );

        // When & Then
        mockMvc.perform(multipart("/api/admin/products")
                        .file(malformedRequest)
                        .with(csrf())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest());

        verify(adminProductService, never()).createProduct(any(), any());
    }

    @Test
    @DisplayName("Should handle empty product request")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldHandleEmptyProductRequest() throws Exception {
        // Given - empty product request
        ProductRequest emptyRequest = new ProductRequest(
                "", "", null, null, null, null, null, null, null
        );
        MockMultipartFile emptyRequestFile = new MockMultipartFile(
                "product",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(emptyRequest)
        );

        // When & Then
        mockMvc.perform(multipart("/api/admin/products")
                        .file(emptyRequestFile)
                        .with(csrf())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest());

        verify(adminProductService, never()).createProduct(any(), any());
    }
}
