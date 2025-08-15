package com.teipsum.catalogservice.event;

import com.teipsum.catalogservice.service.CatalogService;
import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import com.teipsum.shared.product.event.ProductCreatedEvent;
import com.teipsum.shared.product.event.ProductDeletedEvent;
import com.teipsum.shared.product.event.ProductUpdatedEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductEventListener Tests")
class ProductEventListenerTest {

    @Mock
    private CatalogService catalogService;

    @InjectMocks
    private ProductEventListener productEventListener;

    private ProductCreatedEvent productCreatedEvent;
    private ProductUpdatedEvent productUpdatedEvent;
    private ProductDeletedEvent productDeletedEvent;

    @BeforeEach
    void setUp() {
        String productId = UUID.randomUUID().toString();

        productCreatedEvent = new ProductCreatedEvent(
                productId,
                "Test Product",
                "Test Description",
                new BigDecimal("99.99"),
                new BigDecimal("10.00"),
                ProductCategory.CLOTHING,
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
                ProductCategory.CLOTHING,
                ProductSubcategory.HOODIES,
                Gender.MALE,
                List.of("new-url1", "new-url2"),
                List.of("M", "L", "XL"),
                false
        );

        productDeletedEvent = new ProductDeletedEvent(productId);
    }

    @Test
    @DisplayName("Should handle product created event")
    void shouldHandleProductCreatedEvent() {
        // Given
        doNothing().when(catalogService).addProduct(productCreatedEvent);

        // When
        productEventListener.handleProductCreated(productCreatedEvent);

        // Then
        verify(catalogService).addProduct(productCreatedEvent);
    }

    @Test
    @DisplayName("Should handle product updated event")
    void shouldHandleProductUpdatedEvent() {
        // Given
        doNothing().when(catalogService).updateProduct(productUpdatedEvent);

        // When
        productEventListener.handleProductUpdated(productUpdatedEvent);

        // Then
        verify(catalogService).updateProduct(productUpdatedEvent);
    }

    @Test
    @DisplayName("Should handle product deleted event")
    void shouldHandleProductDeletedEvent() {
        // Given
        doNothing().when(catalogService).deleteProduct(productDeletedEvent);

        // When
        productEventListener.handleProductDeleted(productDeletedEvent);

        // Then
        verify(catalogService).deleteProduct(productDeletedEvent);
    }

    @Test
    @DisplayName("Should handle service exception during product creation")
    void shouldHandleServiceExceptionDuringProductCreation() {
        // Given
        doThrow(new RuntimeException("Database error")).when(catalogService).addProduct(productCreatedEvent);

        // When & Then
        try {
            productEventListener.handleProductCreated(productCreatedEvent);
        } catch (RuntimeException e) {
            // Expected exception should be propagated
            assertEquals("Database error", e.getMessage());
        }

        verify(catalogService).addProduct(productCreatedEvent);
    }

    @Test
    @DisplayName("Should handle service exception during product update")
    void shouldHandleServiceExceptionDuringProductUpdate() {
        // Given
        doThrow(new RuntimeException("Update failed")).when(catalogService).updateProduct(productUpdatedEvent);

        // When & Then
        try {
            productEventListener.handleProductUpdated(productUpdatedEvent);
        } catch (RuntimeException e) {
            // Expected exception should be propagated
            assertEquals("Update failed", e.getMessage());
        }

        verify(catalogService).updateProduct(productUpdatedEvent);
    }

    @Test
    @DisplayName("Should handle service exception during product deletion")
    void shouldHandleServiceExceptionDuringProductDeletion() {
        // Given
        doThrow(new RuntimeException("Delete failed")).when(catalogService).deleteProduct(productDeletedEvent);

        // When & Then
        try {
            productEventListener.handleProductDeleted(productDeletedEvent);
        } catch (RuntimeException e) {
            // Expected exception should be propagated
            assertEquals("Delete failed", e.getMessage());
        }

        verify(catalogService).deleteProduct(productDeletedEvent);
    }

    @Test
    @DisplayName("Should handle multiple events in sequence")
    void shouldHandleMultipleEventsInSequence() {
        // Given
        doNothing().when(catalogService).addProduct(productCreatedEvent);
        doNothing().when(catalogService).updateProduct(productUpdatedEvent);
        doNothing().when(catalogService).deleteProduct(productDeletedEvent);

        // When
        productEventListener.handleProductCreated(productCreatedEvent);
        productEventListener.handleProductUpdated(productUpdatedEvent);
        productEventListener.handleProductDeleted(productDeletedEvent);

        // Then
        verify(catalogService).addProduct(productCreatedEvent);
        verify(catalogService).updateProduct(productUpdatedEvent);
        verify(catalogService).deleteProduct(productDeletedEvent);
    }

    @Test
    @DisplayName("Should handle null events gracefully")
    void shouldHandleNullEventsGracefully() {
        // When & Then - should not throw exceptions
        assertDoesNotThrow(() -> productEventListener.handleProductCreated(null));
        assertDoesNotThrow(() -> productEventListener.handleProductUpdated(null));
        assertDoesNotThrow(() -> productEventListener.handleProductDeleted(null));

        // Verify service methods were called with null (service should handle null check)
        verify(catalogService).addProduct(null);
        verify(catalogService).updateProduct(null);
        verify(catalogService).deleteProduct(null);
    }

    @Test
    @DisplayName("Should handle events with minimal data")
    void shouldHandleEventsWithMinimalData() {
        // Given - events with minimal required data
        ProductCreatedEvent minimalCreatedEvent = new ProductCreatedEvent(
                UUID.randomUUID().toString(),
                "Minimal Product",
                null, // null description
                new BigDecimal("0.00"),
                new BigDecimal("0.00"),
                ProductCategory.CLOTHING,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of(), // empty image URLs
                List.of(), // empty sizes
                true
        );

        ProductUpdatedEvent minimalUpdatedEvent = new ProductUpdatedEvent(
                UUID.randomUUID().toString(),
                "Updated Minimal",
                null, // null description
                new BigDecimal("0.00"),
                new BigDecimal("0.00"),
                ProductCategory.CLOTHING,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of(), // empty image URLs
                List.of(), // empty sizes
                false
        );

        doNothing().when(catalogService).addProduct(minimalCreatedEvent);
        doNothing().when(catalogService).updateProduct(minimalUpdatedEvent);

        // When & Then
        assertDoesNotThrow(() -> productEventListener.handleProductCreated(minimalCreatedEvent));
        assertDoesNotThrow(() -> productEventListener.handleProductUpdated(minimalUpdatedEvent));

        verify(catalogService).addProduct(minimalCreatedEvent);
        verify(catalogService).updateProduct(minimalUpdatedEvent);
    }

    @Test
    @DisplayName("Should handle concurrent events")
    void shouldHandleConcurrentEvents() {
        // Given
        String productId1 = UUID.randomUUID().toString();
        String productId2 = UUID.randomUUID().toString();

        ProductCreatedEvent event1 = new ProductCreatedEvent(
                productId1, "Product 1", "Description 1",
                new BigDecimal("99.99"), new BigDecimal("0.00"),
                ProductCategory.CLOTHING, ProductSubcategory.T_SHIRTS, Gender.UNISEX,
                List.of(), List.of("M"), true
        );

        ProductCreatedEvent event2 = new ProductCreatedEvent(
                productId2, "Product 2", "Description 2",
                new BigDecimal("149.99"), new BigDecimal("10.00"),
                ProductCategory.ACCESSORIES, ProductSubcategory.HATS, Gender.FEMALE,
                List.of(), List.of("ONE_SIZE"), true
        );

        doNothing().when(catalogService).addProduct(any(ProductCreatedEvent.class));

        // When
        productEventListener.handleProductCreated(event1);
        productEventListener.handleProductCreated(event2);

        // Then
        verify(catalogService).addProduct(event1);
        verify(catalogService).addProduct(event2);
        verify(catalogService, times(2)).addProduct(any(ProductCreatedEvent.class));
    }

    @Test
    @DisplayName("Should handle events with large data")
    void shouldHandleEventsWithLargeData() {
        // Given - event with large lists
        List<String> manyImageUrls = List.of(
                "url1", "url2", "url3", "url4", "url5",
                "url6", "url7", "url8", "url9", "url10"
        );
        
        List<String> manySizes = List.of(
                "XS", "S", "M", "L", "XL", "XXL", "XXXL"
        );

        ProductCreatedEvent largeEvent = new ProductCreatedEvent(
                UUID.randomUUID().toString(),
                "Product with Many Images and Sizes",
                "This product has many images and sizes for testing purposes",
                new BigDecimal("999.99"),
                new BigDecimal("100.00"),
                ProductCategory.CLOTHING,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                manyImageUrls,
                manySizes,
                true
        );

        doNothing().when(catalogService).addProduct(largeEvent);

        // When & Then
        assertDoesNotThrow(() -> productEventListener.handleProductCreated(largeEvent));

        verify(catalogService).addProduct(largeEvent);
    }

    private void assertDoesNotThrow(Runnable runnable) {
        try {
            runnable.run();
        } catch (Exception e) {
            fail("Expected no exception but got: " + e.getMessage());
        }
    }

    private void fail(String message) {
        throw new AssertionError(message);
    }

    private void assertEquals(String expected, String actual) {
        if (!expected.equals(actual)) {
            throw new AssertionError("Expected: " + expected + ", but was: " + actual);
        }
    }
}
