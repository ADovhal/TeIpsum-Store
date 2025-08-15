package com.teipsum.adminproductservice.service;

import com.teipsum.adminproductservice.dto.ProductResponse;
import com.teipsum.adminproductservice.event.ProductEventPublisher;
import com.teipsum.adminproductservice.exception.ProductAlreadyExistsException;
import com.teipsum.adminproductservice.model.Product;
import com.teipsum.adminproductservice.repository.AdminProductRepository;
import com.teipsum.adminproductservice.util.SkuGenerator;
import com.teipsum.shared.exceptions.ProductNotFoundException;
import com.teipsum.shared.product.dto.ProductFilterRequest;
import com.teipsum.shared.product.dto.ProductRequest;
import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import com.teipsum.shared.product.filter.ProductSpecifications;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdminProductService Tests")
class AdminProductServiceTest {

    @Mock
    private AdminProductRepository repository;

    @Mock
    private ProductEventPublisher eventPublisher;

    @Mock
    private ImageService imageService;

    @Mock
    private SkuGenerator skuGenerator;

    @InjectMocks
    private AdminProductService adminProductService;

    private ProductRequest productRequest;
    private Product testProduct;
    private List<MultipartFile> testImages;

    @BeforeEach
    void setUp() {
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

        testProduct = Product.builder()
                .id(UUID.randomUUID())
                .sku("TEST-SKU-001")
                .title("Test Product")
                .description("Test Description")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("10.00"))
                .category(ProductCategory.CLOTHING)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("S", "M", "L"))
                .available(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        testImages = List.of(
                new MockMultipartFile("image1", "image1.jpg", "image/jpeg", "test image 1".getBytes()),
                new MockMultipartFile("image2", "image2.jpg", "image/jpeg", "test image 2".getBytes())
        );
    }

    @Test
    @DisplayName("Should create product successfully")
    void shouldCreateProductSuccessfully() throws IOException {
        // Given
        when(repository.existsByTitle(productRequest.title())).thenReturn(false);
        when(skuGenerator.generateSku(any())).thenReturn("TEST-SKU-001");
        when(repository.save(any(Product.class))).thenReturn(testProduct);
        when(imageService.uploadImages(any(UUID.class), anyList())).thenReturn(List.of("url1", "url2"));

        // When
        ProductResponse response = adminProductService.createProduct(productRequest, testImages);

        // Then
        assertNotNull(response);
        assertEquals("Test Product", response.title());
        assertEquals("TEST-SKU-001", response.sku());
        assertEquals(new BigDecimal("99.99"), response.price());

        verify(repository).existsByTitle(productRequest.title());
        verify(repository, times(2)).save(any(Product.class));
        verify(imageService).uploadImages(any(UUID.class), eq(testImages));
        verify(eventPublisher).publishProductCreated(any(Product.class));
    }

    @Test
    @DisplayName("Should throw ProductAlreadyExistsException when product title exists")
    void shouldThrowProductAlreadyExistsExceptionWhenTitleExists() {
        // Given
        when(repository.existsByTitle(productRequest.title())).thenReturn(true);

        // When & Then
        assertThrows(ProductAlreadyExistsException.class,
                () -> adminProductService.createProduct(productRequest, testImages));

        verify(repository).existsByTitle(productRequest.title());
        verify(repository, never()).save(any());
        verify(eventPublisher, never()).publishProductCreated(any());
    }

    @Test
    @DisplayName("Should create product without images")
    void shouldCreateProductWithoutImages() throws IOException {
        // Given
        when(repository.existsByTitle(productRequest.title())).thenReturn(false);
        when(skuGenerator.generateSku(any())).thenReturn("TEST-SKU-001");
        when(repository.save(any(Product.class))).thenReturn(testProduct);
        when(imageService.uploadImages(any(UUID.class), isNull())).thenReturn(List.of());

        // When
        ProductResponse response = adminProductService.createProduct(productRequest, null);

        // Then
        assertNotNull(response);
        assertEquals("Test Product", response.title());

        verify(repository).save(any(Product.class));
        verify(imageService).uploadImages(any(UUID.class), isNull());
        verify(eventPublisher).publishProductCreated(any(Product.class));
    }

    @Test
    @DisplayName("Should handle image upload failure during creation")
    void shouldHandleImageUploadFailureDuringCreation() throws IOException {
        // Given
        when(repository.existsByTitle(productRequest.title())).thenReturn(false);
        when(skuGenerator.generateSku(any())).thenReturn("TEST-SKU-001");
        when(repository.save(any(Product.class))).thenReturn(testProduct);
        when(imageService.uploadImages(any(UUID.class), anyList())).thenThrow(new IOException("Upload failed"));

        // When & Then
        assertThrows(RuntimeException.class,
                () -> adminProductService.createProduct(productRequest, testImages));

        verify(repository).save(any(Product.class));
        verify(imageService).uploadImages(any(UUID.class), eq(testImages));
        verify(eventPublisher, never()).publishProductCreated(any());
    }

    @Test
    @DisplayName("Should update product successfully")
    void shouldUpdateProductSuccessfully() throws IOException {
        // Given
        UUID productId = testProduct.getId();
        when(repository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(repository.existsByTitleAndIdNot(productRequest.title(), productId)).thenReturn(false);
        when(repository.save(any(Product.class))).thenReturn(testProduct);
        when(imageService.uploadImages(any(UUID.class), anyList())).thenReturn(List.of("new-url1", "new-url2"));

        // When
        ProductResponse response = adminProductService.updateProduct(productId, productRequest, testImages);

        // Then
        assertNotNull(response);
        assertEquals("Test Product", response.title());

        verify(repository).findById(productId);
        verify(repository).existsByTitleAndIdNot(productRequest.title(), productId);
        verify(imageService).deleteImages(productId);
        verify(imageService).uploadImages(productId, testImages);
        verify(repository).save(any(Product.class));
        verify(eventPublisher).publishProductUpdated(any(Product.class));
    }

    @Test
    @DisplayName("Should throw ProductNotFoundException when updating non-existent product")
    void shouldThrowProductNotFoundExceptionWhenUpdatingNonExistentProduct() {
        // Given
        UUID productId = UUID.randomUUID();
        when(repository.findById(productId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ProductNotFoundException.class,
                () -> adminProductService.updateProduct(productId, productRequest, testImages));

        verify(repository).findById(productId);
        verify(repository, never()).save(any());
        verify(eventPublisher, never()).publishProductUpdated(any());
    }

    @Test
    @DisplayName("Should throw ProductAlreadyExistsException when updating to existing title")
    void shouldThrowProductAlreadyExistsExceptionWhenUpdatingToExistingTitle() {
        // Given
        UUID productId = testProduct.getId();
        when(repository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(repository.existsByTitleAndIdNot(productRequest.title(), productId)).thenReturn(true);

        // When & Then
        assertThrows(ProductAlreadyExistsException.class,
                () -> adminProductService.updateProduct(productId, productRequest, testImages));

        verify(repository).findById(productId);
        verify(repository).existsByTitleAndIdNot(productRequest.title(), productId);
        verify(repository, never()).save(any());
        verify(eventPublisher, never()).publishProductUpdated(any());
    }

    @Test
    @DisplayName("Should update product without changing images")
    void shouldUpdateProductWithoutChangingImages() throws IOException {
        // Given
        UUID productId = testProduct.getId();
        when(repository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(repository.existsByTitleAndIdNot(productRequest.title(), productId)).thenReturn(false);
        when(repository.save(any(Product.class))).thenReturn(testProduct);

        // When
        ProductResponse response = adminProductService.updateProduct(productId, productRequest, null);

        // Then
        assertNotNull(response);

        verify(repository).save(any(Product.class));
        verify(imageService, never()).deleteImages(any());
        verify(imageService, never()).uploadImages(any(), any());
        verify(eventPublisher).publishProductUpdated(any(Product.class));
    }

    @Test
    @DisplayName("Should handle image upload failure during update")
    void shouldHandleImageUploadFailureDuringUpdate() throws IOException {
        // Given
        UUID productId = testProduct.getId();
        when(repository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(repository.existsByTitleAndIdNot(productRequest.title(), productId)).thenReturn(false);
        when(imageService.uploadImages(any(UUID.class), anyList())).thenThrow(new IOException("Upload failed"));

        // When & Then
        assertThrows(RuntimeException.class,
                () -> adminProductService.updateProduct(productId, productRequest, testImages));

        verify(imageService).deleteImages(productId);
        verify(imageService).uploadImages(productId, testImages);
        verify(repository, never()).save(any());
        verify(eventPublisher, never()).publishProductUpdated(any());
    }

    @Test
    @DisplayName("Should delete product successfully")
    void shouldDeleteProductSuccessfully() {
        // Given
        UUID productId = testProduct.getId();
        when(repository.findById(productId)).thenReturn(Optional.of(testProduct));

        // When
        adminProductService.deleteProduct(productId);

        // Then
        verify(repository).findById(productId);
        verify(repository).delete(testProduct);
        verify(eventPublisher).publishProductDeleted(testProduct);
    }

    @Test
    @DisplayName("Should throw ProductNotFoundException when deleting non-existent product")
    void shouldThrowProductNotFoundExceptionWhenDeletingNonExistentProduct() {
        // Given
        UUID productId = UUID.randomUUID();
        when(repository.findById(productId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ProductNotFoundException.class,
                () -> adminProductService.deleteProduct(productId));

        verify(repository).findById(productId);
        verify(repository, never()).delete(any());
        verify(eventPublisher, never()).publishProductDeleted(any());
    }

    @Test
    @DisplayName("Should get product by id successfully")
    void shouldGetProductByIdSuccessfully() {
        // Given
        UUID productId = testProduct.getId();
        when(repository.findById(productId)).thenReturn(Optional.of(testProduct));

        // When
        ProductResponse response = adminProductService.getProduct(productId);

        // Then
        assertNotNull(response);
        assertEquals(testProduct.getId(), response.id());
        assertEquals(testProduct.getTitle(), response.title());

        verify(repository).findById(productId);
    }

    @Test
    @DisplayName("Should throw ProductNotFoundException when getting non-existent product")
    void shouldThrowProductNotFoundExceptionWhenGettingNonExistentProduct() {
        // Given
        UUID productId = UUID.randomUUID();
        when(repository.findById(productId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ProductNotFoundException.class,
                () -> adminProductService.getProduct(productId));

        verify(repository).findById(productId);
    }

    @Test
    @DisplayName("Should get all products with pagination")
    void shouldGetAllProductsWithPagination() {
        // Given
        ProductFilterRequest filter = new ProductFilterRequest(
                null, null, null, null, null, null, null, null, null, null
        );
        Pageable pageable = Pageable.ofSize(10);
        Page<Product> productPage = new PageImpl<>(List.of(testProduct));

        try (MockedStatic<ProductSpecifications> mockedStatic = mockStatic(ProductSpecifications.class)) {
            mockedStatic.when(() -> ProductSpecifications.withFilters(filter))
                    .thenReturn(Specification.where(null));
            when(repository.findAll(any(Specification.class), eq(pageable))).thenReturn(productPage);

            // When
            Page<ProductResponse> response = adminProductService.getAllProducts(filter, pageable);

            // Then
            assertNotNull(response);
            assertEquals(1, response.getTotalElements());
            assertEquals(testProduct.getTitle(), response.getContent().get(0).title());

            verify(repository).findAll(any(Specification.class), eq(pageable));
        }
    }

    @Test
    @DisplayName("Should handle empty product list")
    void shouldHandleEmptyProductList() {
        // Given
        ProductFilterRequest filter = new ProductFilterRequest(
                null, null, null, null, null, null, null, null, null, null
        );
        Pageable pageable = Pageable.ofSize(10);
        Page<Product> emptyPage = new PageImpl<>(List.of());

        try (MockedStatic<ProductSpecifications> mockedStatic = mockStatic(ProductSpecifications.class)) {
            mockedStatic.when(() -> ProductSpecifications.withFilters(filter))
                    .thenReturn(Specification.where(null));
            when(repository.findAll(any(Specification.class), eq(pageable))).thenReturn(emptyPage);

            // When
            Page<ProductResponse> response = adminProductService.getAllProducts(filter, pageable);

            // Then
            assertNotNull(response);
            assertEquals(0, response.getTotalElements());
            assertTrue(response.getContent().isEmpty());

            verify(repository).findAll(any(Specification.class), eq(pageable));
        }
    }

    @Test
    @DisplayName("Should apply filters correctly")
    void shouldApplyFiltersCorrectly() {
        // Given
        ProductFilterRequest filter = new ProductFilterRequest(
                "Test", ProductCategory.CLOTHING, ProductSubcategory.T_SHIRTS, 
                Gender.UNISEX, new BigDecimal("50"), new BigDecimal("150"), 
                true, List.of("M", "L"), null, null
        );
        Pageable pageable = Pageable.ofSize(10);
        Page<Product> productPage = new PageImpl<>(List.of(testProduct));

        try (MockedStatic<ProductSpecifications> mockedStatic = mockStatic(ProductSpecifications.class)) {
            mockedStatic.when(() -> ProductSpecifications.withFilters(filter))
                    .thenReturn(Specification.where(null));
            when(repository.findAll(any(Specification.class), eq(pageable))).thenReturn(productPage);

            // When
            Page<ProductResponse> response = adminProductService.getAllProducts(filter, pageable);

            // Then
            assertNotNull(response);
            assertEquals(1, response.getTotalElements());

            mockedStatic.verify(() -> ProductSpecifications.withFilters(filter));
            verify(repository).findAll(any(Specification.class), eq(pageable));
        }
    }
}
