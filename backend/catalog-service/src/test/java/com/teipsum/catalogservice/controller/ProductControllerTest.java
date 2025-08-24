package com.teipsum.catalogservice.controller;

import com.teipsum.catalogservice.dto.CatalogProductDTO;
import com.teipsum.catalogservice.model.CatalogProduct;
import com.teipsum.catalogservice.service.CatalogService;
import com.teipsum.catalogservice.util.ProductDtoConverter;
import com.teipsum.shared.exceptions.ProductNotFoundException;
import com.teipsum.shared.product.dto.ProductFilterRequest;
import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@ActiveProfiles("test")
@DisplayName("ProductController Tests")
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CatalogService catalogService;

    @MockitoBean
    private PagedResourcesAssembler<CatalogProduct> pagedResourcesAssembler;

    @MockitoBean
    private ProductDtoConverter dtoConverter;

    private CatalogProduct testProduct;
    private CatalogProductDTO testProductDTO;

    @BeforeEach
    void setUp() {
        testProduct = CatalogProduct.builder()
                .id(UUID.randomUUID())
                .title("Test Product")
                .description("Test Description")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("10.00"))
                .category(ProductCategory.TOPS)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .imageUrls(List.of("url1", "url2"))
                .sizes(List.of("S", "M", "L"))
                .available(true)
                .build();

        testProductDTO = CatalogProductDTO.builder()
                .id(testProduct.getId().toString())
                .title("Test Product")
                .description("Test Description")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("10.00"))
                .category(ProductCategory.TOPS)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .imageUrls(List.of("url1", "url2"))
                .sizes(List.of("S", "M", "L"))
                .available(true)
                .build();
    }

    @Test
    @DisplayName("Should get filtered products successfully")
    void shouldGetFilteredProductsSuccessfully() throws Exception {
        // Given
        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));
        PagedModel<EntityModel<CatalogProductDTO>> pagedModel = PagedModel.of(
                List.of(EntityModel.of(testProductDTO)), 
                new PagedModel.PageMetadata(1, 0, 1)
        );

        when(catalogService.getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenReturn(productPage);
        when(dtoConverter.convertToDto(testProduct)).thenReturn(testProductDTO);
        when(pagedResourcesAssembler.toModel(eq(productPage), any(RepresentationModelAssembler.class)))
                .thenReturn(pagedModel);

        // When & Then
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList").isArray())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].title").value("Test Product"))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].price").value(99.99))
                .andExpect(jsonPath("$.page.totalElements").value(1));

        verify(catalogService).getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class));
        verify(dtoConverter).convertToDto(testProduct);
        verify(pagedResourcesAssembler).toModel(eq(productPage), any(RepresentationModelAssembler.class));
    }

    @Test
    @DisplayName("Should get products with filters")
    void shouldGetProductsWithFilters() throws Exception {
        // Given
        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));
        PagedModel<EntityModel<CatalogProductDTO>> pagedModel = PagedModel.of(
                List.of(EntityModel.of(testProductDTO)), 
                new PagedModel.PageMetadata(1, 0, 1)
        );

        when(catalogService.getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenReturn(productPage);
        when(dtoConverter.convertToDto(testProduct)).thenReturn(testProductDTO);
        when(pagedResourcesAssembler.toModel(eq(productPage), any(RepresentationModelAssembler.class)))
                .thenReturn(pagedModel);

        // When & Then
        mockMvc.perform(get("/api/products")
                        .param("title", "Test")
                        .param("category", "CLOTHING")
                        .param("subcategory", "T_SHIRTS")
                        .param("gender", "UNISEX")
                        .param("minPrice", "50")
                        .param("maxPrice", "150")
                        .param("available", "true")
                        .param("sizes", "M,L")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList").isArray())
                .andExpect(jsonPath("$.page.totalElements").value(1));

        verify(catalogService).getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class));
    }

    @Test
    @DisplayName("Should handle empty product list")
    void shouldHandleEmptyProductList() throws Exception {
        // Given
        Page<CatalogProduct> emptyPage = new PageImpl<>(List.of());
        PagedModel<EntityModel<CatalogProductDTO>> emptyPagedModel = PagedModel.of(
                List.of(), 
                new PagedModel.PageMetadata(0, 0, 0)
        );

        when(catalogService.getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenReturn(emptyPage);
        when(pagedResourcesAssembler.toModel(eq(emptyPage), any(RepresentationModelAssembler.class)))
                .thenReturn(emptyPagedModel);

        // When & Then
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements").value(0));

        verify(catalogService).getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class));
        verify(dtoConverter, never()).convertToDto(any());
    }

    @Test
    @DisplayName("Should get product by id successfully")
    void shouldGetProductByIdSuccessfully() throws Exception {
        // Given
        String productId = testProduct.getId().toString();
        when(catalogService.getProductById(productId)).thenReturn(testProduct);
        when(dtoConverter.convertToDto(testProduct)).thenReturn(testProductDTO);

        // When & Then
        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productId))
                .andExpect(jsonPath("$.title").value("Test Product"))
                .andExpect(jsonPath("$.price").value(99.99))
                .andExpect(jsonPath("$.discount").value(10.00))
                .andExpect(jsonPath("$.category").value("CLOTHING"))
                .andExpect(jsonPath("$.subcategory").value("T_SHIRTS"))
                .andExpect(jsonPath("$.gender").value("UNISEX"))
                .andExpect(jsonPath("$.available").value(true))
                .andExpect(jsonPath("$.imageUrls").isArray())
                .andExpect(jsonPath("$.imageUrls[0]").value("url1"))
                .andExpect(jsonPath("$.sizes").isArray())
                .andExpect(jsonPath("$.sizes[0]").value("S"));

        verify(catalogService).getProductById(productId);
        verify(dtoConverter).convertToDto(testProduct);
    }

    @Test
    @DisplayName("Should return not found when product doesn't exist")
    void shouldReturnNotFoundWhenProductDoesntExist() throws Exception {
        // Given
        String nonExistentId = UUID.randomUUID().toString();
        when(catalogService.getProductById(nonExistentId))
                .thenThrow(new ProductNotFoundException(nonExistentId));

        // When & Then
        mockMvc.perform(get("/api/products/{id}", nonExistentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());

        verify(catalogService).getProductById(nonExistentId);
        verify(dtoConverter, never()).convertToDto(any());
    }

    @Test
    @DisplayName("Should handle invalid UUID format")
    void shouldHandleInvalidUuidFormat() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/products/invalid-uuid"))
                .andExpect(status().isBadRequest());

        verify(catalogService, never()).getProductById(any());
        verify(dtoConverter, never()).convertToDto(any());
    }

    @Test
    @DisplayName("Should use default pagination parameters")
    void shouldUseDefaultPaginationParameters() throws Exception {
        // Given
        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));
        PagedModel<EntityModel<CatalogProductDTO>> pagedModel = PagedModel.of(
                List.of(EntityModel.of(testProductDTO)), 
                new PagedModel.PageMetadata(1, 0, 1)
        );

        when(catalogService.getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenReturn(productPage);
        when(dtoConverter.convertToDto(testProduct)).thenReturn(testProductDTO);
        when(pagedResourcesAssembler.toModel(eq(productPage), any(RepresentationModelAssembler.class)))
                .thenReturn(pagedModel);

        // When & Then - no pagination parameters provided
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements").value(1));

        verify(catalogService).getFilteredProducts(any(ProductFilterRequest.class), argThat(pageable -> 
                pageable.getPageSize() == 10 && pageable.getPageNumber() == 0
        ));
    }

    @Test
    @DisplayName("Should handle custom pagination parameters")
    void shouldHandleCustomPaginationParameters() throws Exception {
        // Given
        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));
        PagedModel<EntityModel<CatalogProductDTO>> pagedModel = PagedModel.of(
                List.of(EntityModel.of(testProductDTO)), 
                new PagedModel.PageMetadata(1, 2, 1)
        );

        when(catalogService.getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenReturn(productPage);
        when(dtoConverter.convertToDto(testProduct)).thenReturn(testProductDTO);
        when(pagedResourcesAssembler.toModel(eq(productPage), any(RepresentationModelAssembler.class)))
                .thenReturn(pagedModel);

        // When & Then
        mockMvc.perform(get("/api/products")
                        .param("page", "2")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements").value(1));

        verify(catalogService).getFilteredProducts(any(ProductFilterRequest.class), argThat(pageable -> 
                pageable.getPageSize() == 5 && pageable.getPageNumber() == 2
        ));
    }

    @Test
    @DisplayName("Should handle service exception gracefully")
    void shouldHandleServiceExceptionGracefully() throws Exception {
        // Given
        when(catalogService.getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When & Then
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isInternalServerError());

        verify(catalogService).getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class));
    }

    @Test
    @DisplayName("Should handle price range filters correctly")
    void shouldHandlePriceRangeFiltersCorrectly() throws Exception {
        // Given
        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));
        PagedModel<EntityModel<CatalogProductDTO>> pagedModel = PagedModel.of(
                List.of(EntityModel.of(testProductDTO)), 
                new PagedModel.PageMetadata(1, 0, 1)
        );

        when(catalogService.getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenReturn(productPage);
        when(dtoConverter.convertToDto(testProduct)).thenReturn(testProductDTO);
        when(pagedResourcesAssembler.toModel(eq(productPage), any(RepresentationModelAssembler.class)))
                .thenReturn(pagedModel);

        // When & Then
        mockMvc.perform(get("/api/products")
                        .param("minPrice", "50.00")
                        .param("maxPrice", "150.00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements").value(1));

        verify(catalogService).getFilteredProducts(argThat(filter -> 
                filter.minPrice().equals(new BigDecimal("50.00")) && 
                filter.maxPrice().equals(new BigDecimal("150.00"))
        ), any(Pageable.class));
    }

    @Test
    @DisplayName("Should handle boolean availability filter")
    void shouldHandleBooleanAvailabilityFilter() throws Exception {
        // Given
        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));
        PagedModel<EntityModel<CatalogProductDTO>> pagedModel = PagedModel.of(
                List.of(EntityModel.of(testProductDTO)), 
                new PagedModel.PageMetadata(1, 0, 1)
        );

        when(catalogService.getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenReturn(productPage);
        when(dtoConverter.convertToDto(testProduct)).thenReturn(testProductDTO);
        when(pagedResourcesAssembler.toModel(eq(productPage), any(RepresentationModelAssembler.class)))
                .thenReturn(pagedModel);

        // When & Then - test both true and false values
        mockMvc.perform(get("/api/products")
                        .param("available", "true"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/products")
                        .param("available", "false"))
                .andExpect(status().isOk());

        verify(catalogService, times(2)).getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class));
    }

//    @Test
//    @DisplayName("Should handle multiple size filters")
//    void shouldHandleMultipleSizeFilters() throws Exception {
//        // Given
//        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));
//        PagedModel<EntityModel<CatalogProductDTO>> pagedModel = PagedModel.of(
//                List.of(EntityModel.of(testProductDTO)),
//                new PagedModel.PageMetadata(1, 0, 1)
//        );
//
//        when(catalogService.getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class)))
//                .thenReturn(productPage);
//        when(dtoConverter.convertToDto(testProduct)).thenReturn(testProductDTO);
//        when(pagedResourcesAssembler.toModel(eq(productPage), any()))
//                .thenReturn(pagedModel);
//
//        // When & Then
//        mockMvc.perform(get("/api/products")
//                        .param("sizes", "S")
//                        .param("sizes", "M")
//                        .param("sizes", "L"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.page.totalElements").value(1));
//
//        verify(catalogService).getFilteredProducts(argThat(filter ->
//                filter.sizes() != null && filter.sizes().containsAll(List.of("S", "M", "L"))
//        ), any(Pageable.class));
//    }

    @Test
    @DisplayName("Should handle sorting parameters")
    void shouldHandleSortingParameters() throws Exception {
        // Given
        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));
        PagedModel<EntityModel<CatalogProductDTO>> pagedModel = PagedModel.of(
                List.of(EntityModel.of(testProductDTO)), 
                new PagedModel.PageMetadata(1, 0, 1)
        );

        when(catalogService.getFilteredProducts(any(ProductFilterRequest.class), any(Pageable.class)))
                .thenReturn(productPage);
        when(dtoConverter.convertToDto(testProduct)).thenReturn(testProductDTO);
        when(pagedResourcesAssembler.toModel(eq(productPage), any(RepresentationModelAssembler.class)))
                .thenReturn(pagedModel);

        // When & Then
        mockMvc.perform(get("/api/products")
                        .param("sort", "price,desc")
                        .param("sort", "title,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements").value(1));

        verify(catalogService).getFilteredProducts(any(ProductFilterRequest.class), argThat(pageable -> 
                pageable.getSort().isSorted()
        ));
    }
}
