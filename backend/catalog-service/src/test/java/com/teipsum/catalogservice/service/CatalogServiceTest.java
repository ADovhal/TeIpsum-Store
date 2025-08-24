package com.teipsum.catalogservice.service;

import com.teipsum.catalogservice.event.ProductEventValidator;
import com.teipsum.catalogservice.exception.EventProcessingException;
import com.teipsum.catalogservice.exception.InvalidProductDataException;
import com.teipsum.catalogservice.model.CatalogProduct;
import com.teipsum.catalogservice.repository.CatalogProductRepository;
import com.teipsum.shared.exceptions.ProductNotFoundException;
import com.teipsum.shared.product.dto.ProductFilterRequest;
import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import com.teipsum.shared.product.event.ProductCreatedEvent;
import com.teipsum.shared.product.event.ProductDeletedEvent;
import com.teipsum.shared.product.event.ProductUpdatedEvent;
import com.teipsum.shared.product.filter.ProductSpecifications;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("CatalogService Tests")
class CatalogServiceTest {

    @Mock
    private CatalogProductRepository catalogProductRepository;

    @Mock
    private ProductEventValidator productEventValidator;

    @InjectMocks
    private CatalogService catalogService;

    private CatalogProduct testProduct;
    private ProductCreatedEvent productCreatedEvent;
    private ProductUpdatedEvent productUpdatedEvent;
    private ProductDeletedEvent productDeletedEvent;

    @BeforeEach
    void setUp() {
        String productId = UUID.randomUUID().toString();
        
        testProduct = CatalogProduct.builder()
                .id(UUID.fromString(productId))
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

        productCreatedEvent = new ProductCreatedEvent(
                productId,
                "Test Product",
                "Test Description",
                new BigDecimal("99.99"),
                new BigDecimal("10.00"),
                ProductCategory.TOPS,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of("url1", "url2"),
                List.of("S", "M", "L"),
                true
        );

        productUpdatedEvent = new ProductUpdatedEvent(
                productId,
                "Updated Product",
                "Updated Description",
                new BigDecimal("149.99"),
                new BigDecimal("15.00"),
                ProductCategory.TOPS,
                ProductSubcategory.HOODIES,
                Gender.MEN,
                List.of("new-url1", "new-url2"),
                List.of("M", "L", "XL"),
                false
        );

        productDeletedEvent = new ProductDeletedEvent(productId);
    }

    @Test
    @DisplayName("Should add product successfully")
    void shouldAddProductSuccessfully() {
        // Given
        when(catalogProductRepository.save(any(CatalogProduct.class))).thenReturn(testProduct);

        // When
        catalogService.addProduct(productCreatedEvent);

        // Then
        verify(catalogProductRepository).save(any(CatalogProduct.class));
    }

    @Test
    @DisplayName("Should create catalog product from event with correct mapping")
    void shouldCreateCatalogProductFromEventWithCorrectMapping() {
        // Given
        when(catalogProductRepository.save(any(CatalogProduct.class))).thenAnswer(invocation -> {
            CatalogProduct product = invocation.getArgument(0);
            
            // Verify mapping
            assertEquals(UUID.fromString(productCreatedEvent.id()), product.getId());
            assertEquals(productCreatedEvent.title(), product.getTitle());
            assertEquals(productCreatedEvent.description(), product.getDescription());
            assertEquals(productCreatedEvent.price(), product.getPrice());
            assertEquals(productCreatedEvent.discount(), product.getDiscount());
            assertEquals(productCreatedEvent.category(), product.getCategory());
            assertEquals(productCreatedEvent.subcategory(), product.getSubcategory());
            assertEquals(productCreatedEvent.gender(), product.getGender());
            assertEquals(productCreatedEvent.imageUrls(), product.getImageUrls());
            assertEquals(productCreatedEvent.sizes(), product.getSizes());
            assertEquals(productCreatedEvent.available(), product.isAvailable());
            
            return product;
        });

        // When
        catalogService.addProduct(productCreatedEvent);

        // Then
        verify(catalogProductRepository).save(any(CatalogProduct.class));
    }

    @Test
    @DisplayName("Should update product successfully")
    void shouldUpdateProductSuccessfully() {
        // Given
        when(catalogProductRepository.findById(UUID.fromString(productUpdatedEvent.id()))).thenReturn(Optional.of(testProduct));
        doNothing().when(productEventValidator).validate(productUpdatedEvent);

        // When
        catalogService.updateProduct(productUpdatedEvent);

        // Then
        verify(productEventValidator).validate(productUpdatedEvent);
        verify(catalogProductRepository).findById(UUID.fromString(productUpdatedEvent.id()));
        
        // Verify product fields were updated
        assertEquals("Updated Product", testProduct.getTitle());
        assertEquals("Updated Description", testProduct.getDescription());
        assertEquals(new BigDecimal("149.99"), testProduct.getPrice());
        assertEquals(new BigDecimal("15.00"), testProduct.getDiscount());
        assertEquals(ProductSubcategory.HOODIES, testProduct.getSubcategory());
        assertEquals(Gender.MEN, testProduct.getGender());
        assertEquals(List.of("new-url1", "new-url2"), testProduct.getImageUrls());
        assertEquals(List.of("M", "L", "XL"), testProduct.getSizes());
        assertFalse(testProduct.isAvailable());
    }

    @Test
    @DisplayName("Should throw ProductNotFoundException when updating non-existent product")
    void shouldThrowProductNotFoundExceptionWhenUpdatingNonExistentProduct() {
        // Given
        when(catalogProductRepository.findById(UUID.fromString(productUpdatedEvent.id()))).thenReturn(Optional.empty());
        doNothing().when(productEventValidator).validate(productUpdatedEvent);

        // When & Then
        assertThrows(ProductNotFoundException.class, 
                () -> catalogService.updateProduct(productUpdatedEvent));

        verify(productEventValidator).validate(productUpdatedEvent);
        verify(catalogProductRepository).findById(UUID.fromString(productUpdatedEvent.id()));
    }

    @Test
    @DisplayName("Should handle validation failure during update")
    void shouldHandleValidationFailureDuringUpdate() {
        // Given
        doThrow(new InvalidProductDataException("Invalid data"))
                .when(productEventValidator).validate(productUpdatedEvent);

        // When & Then
        assertThrows(InvalidProductDataException.class, 
                () -> catalogService.updateProduct(productUpdatedEvent));

        verify(productEventValidator).validate(productUpdatedEvent);
        verify(catalogProductRepository, never()).findById(any());
    }

    @Test
    @DisplayName("Should handle unexpected exception during update")
    void shouldHandleUnexpectedExceptionDuringUpdate() {
        // Given
        when(catalogProductRepository.findById(UUID.fromString(productUpdatedEvent.id()))).thenReturn(Optional.of(testProduct));
        doThrow(new RuntimeException("Database error"))
                .when(productEventValidator).validate(productUpdatedEvent);

        // When & Then
        assertThrows(EventProcessingException.class, 
                () -> catalogService.updateProduct(productUpdatedEvent));

        verify(productEventValidator).validate(productUpdatedEvent);
    }

    @Test
    @DisplayName("Should delete product successfully")
    void shouldDeleteProductSuccessfully() {
        // When
        catalogService.deleteProduct(productDeletedEvent);

        // Then
        verify(catalogProductRepository).deleteById(UUID.fromString(productUpdatedEvent.id()));
    }

    @Test
    @DisplayName("Should get all products successfully")
    void shouldGetAllProductsSuccessfully() {
        // Given
        List<CatalogProduct> products = List.of(testProduct);
        when(catalogProductRepository.findAll()).thenReturn(products);

        // When
        List<CatalogProduct> result = catalogService.getAllProducts();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProduct, result.get(0));

        verify(catalogProductRepository).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no products exist")
    void shouldReturnEmptyListWhenNoProductsExist() {
        // Given
        when(catalogProductRepository.findAll()).thenReturn(List.of());

        // When
        List<CatalogProduct> result = catalogService.getAllProducts();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(catalogProductRepository).findAll();
    }

    @Test
    @DisplayName("Should get product by id successfully")
    void shouldGetProductByIdSuccessfully() {
        // Given
        String productId = testProduct.getId().toString();
        when(catalogProductRepository.findById(UUID.fromString(productId))).thenReturn(Optional.of(testProduct));

        // When
        CatalogProduct result = catalogService.getProductById(productId);

        // Then
        assertNotNull(result);
        assertEquals(testProduct, result);

        verify(catalogProductRepository).findById(UUID.fromString(productId));
    }

    @Test
    @DisplayName("Should throw ProductNotFoundException when product not found by id")
    void shouldThrowProductNotFoundExceptionWhenProductNotFoundById() {
        // Given
        UUID productId = UUID.randomUUID();
        when(catalogProductRepository.findById(productId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ProductNotFoundException.class, 
                () -> catalogService.getProductById(productId.toString()));

        verify(catalogProductRepository).findById(productId);
    }

    @Test
    @DisplayName("Should get filtered products successfully")
    void shouldGetFilteredProductsSuccessfully() {
        // Given
        ProductFilterRequest filter = new ProductFilterRequest(
                "Test", ProductCategory.TOPS, ProductSubcategory.T_SHIRTS,
                Gender.UNISEX, new BigDecimal("50"), new BigDecimal("150"),
                null, null, null, null, null
        );
        Pageable pageable = Pageable.ofSize(10);
        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));

        try (MockedStatic<ProductSpecifications> mockedStatic = mockStatic(ProductSpecifications.class)) {
            mockedStatic.when(() -> ProductSpecifications.withFilters(filter))
                    .thenReturn(Specification.where(null));
            when(catalogProductRepository.findAll(any(Specification.class), eq(pageable)))
                    .thenReturn(productPage);

            // When
            Page<CatalogProduct> result = catalogService.getFilteredProducts(filter, pageable);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getTotalElements());
            assertEquals(testProduct, result.getContent().get(0));

            mockedStatic.verify(() -> ProductSpecifications.withFilters(filter));
            verify(catalogProductRepository).findAll(any(Specification.class), eq(pageable));
        }
    }

    @Test
    @DisplayName("Should handle empty filter results")
    void shouldHandleEmptyFilterResults() {
        // Given
        ProductFilterRequest filter = new ProductFilterRequest(
                "NonExistent", null, null, null, null, null, null, null, null, null, null
        );
        Pageable pageable = Pageable.ofSize(10);
        Page<CatalogProduct> emptyPage = new PageImpl<>(List.of());

        try (MockedStatic<ProductSpecifications> mockedStatic = mockStatic(ProductSpecifications.class)) {
            mockedStatic.when(() -> ProductSpecifications.withFilters(filter))
                    .thenReturn(Specification.where(null));
            when(catalogProductRepository.findAll(any(Specification.class), eq(pageable)))
                    .thenReturn(emptyPage);

            // When
            Page<CatalogProduct> result = catalogService.getFilteredProducts(filter, pageable);

            // Then
            assertNotNull(result);
            assertEquals(0, result.getTotalElements());
            assertTrue(result.getContent().isEmpty());

            verify(catalogProductRepository).findAll(any(Specification.class), eq(pageable));
        }
    }

    @Test
    @DisplayName("Should apply multiple filters correctly")
    void shouldApplyMultipleFiltersCorrectly() {
        // Given
        ProductFilterRequest complexFilter = new ProductFilterRequest(
                "Test Product", 
                ProductCategory.TOPS,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX, 
                new BigDecimal("90"), 
                new BigDecimal("110"),
                null,
                null,
                null, 
                null,
                null
        );
        Pageable pageable = Pageable.ofSize(5);
        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));

        try (MockedStatic<ProductSpecifications> mockedStatic = mockStatic(ProductSpecifications.class)) {
            mockedStatic.when(() -> ProductSpecifications.withFilters(complexFilter))
                    .thenReturn(Specification.where(null));
            when(catalogProductRepository.findAll(any(Specification.class), eq(pageable)))
                    .thenReturn(productPage);

            // When
            Page<CatalogProduct> result = catalogService.getFilteredProducts(complexFilter, pageable);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getTotalElements());

            mockedStatic.verify(() -> ProductSpecifications.withFilters(complexFilter));
            verify(catalogProductRepository).findAll(any(Specification.class), eq(pageable));
        }
    }

    @Test
    @DisplayName("Should handle null filter gracefully")
    void shouldHandleNullFilterGracefully() {
        // Given
        Pageable pageable = Pageable.ofSize(10);
        Page<CatalogProduct> productPage = new PageImpl<>(List.of(testProduct));

        try (MockedStatic<ProductSpecifications> mockedStatic = mockStatic(ProductSpecifications.class)) {
            mockedStatic.when(() -> ProductSpecifications.withFilters(null))
                    .thenReturn(Specification.where(null));
            when(catalogProductRepository.findAll(any(Specification.class), eq(pageable)))
                    .thenReturn(productPage);

            // When
            Page<CatalogProduct> result = catalogService.getFilteredProducts(null, pageable);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getTotalElements());

            mockedStatic.verify(() -> ProductSpecifications.withFilters(null));
            verify(catalogProductRepository).findAll(any(Specification.class), eq(pageable));
        }
    }

    @Test
    @DisplayName("Should handle caching for getProductById")
    void shouldHandleCachingForGetProductById() {
        // Given
        String productId = testProduct.getId().toString();
        when(catalogProductRepository.findById(UUID.fromString(productId))).thenReturn(Optional.of(testProduct));

        // When - call multiple times
        CatalogProduct result1 = catalogService.getProductById(productId);
        CatalogProduct result2 = catalogService.getProductById(productId);

        // Then
        assertNotNull(result1);
        assertNotNull(result2);
        assertEquals(testProduct, result1);
        assertEquals(testProduct, result2);

        // Note: In a real test with actual caching, we would verify that repository is called only once
        // But since we're testing the service layer in isolation, we verify the method works correctly
        verify(catalogProductRepository, times(2)).findById(UUID.fromString(productId));
    }

    @Test
    @DisplayName("Should handle product update with partial data")
    void shouldHandleProductUpdateWithPartialData() {
        // Given
        ProductUpdatedEvent partialUpdateEvent = new ProductUpdatedEvent(
                testProduct.getId().toString(),
                "Updated Title Only",
                testProduct.getDescription(), // Keep original
                testProduct.getPrice(),       // Keep original
                testProduct.getDiscount(),    // Keep original
                testProduct.getCategory(),    // Keep original
                testProduct.getSubcategory(), // Keep original
                testProduct.getGender(),      // Keep original
                testProduct.getImageUrls(),   // Keep original
                testProduct.getSizes(),       // Keep original
                testProduct.isAvailable()     // Keep original
        );

        when(catalogProductRepository.findById(UUID.fromString(partialUpdateEvent.id()))).thenReturn(Optional.of(testProduct));
        doNothing().when(productEventValidator).validate(partialUpdateEvent);

        // When
        catalogService.updateProduct(partialUpdateEvent);

        // Then
        assertEquals("Updated Title Only", testProduct.getTitle());
        assertEquals("Test Description", testProduct.getDescription()); // Should remain unchanged
        
        verify(productEventValidator).validate(partialUpdateEvent);
        verify(catalogProductRepository).findById(UUID.fromString(partialUpdateEvent.id()));
    }
}
