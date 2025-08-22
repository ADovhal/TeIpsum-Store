package com.teipsum.inventoryservice.listener;

import com.teipsum.inventoryservice.model.Inventory;
import com.teipsum.inventoryservice.repository.InventoryRepository;
import com.teipsum.shared.product.event.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@ActiveProfiles("test")
@DisplayName("InventoryEventListener Tests")
class InventoryEventListenerTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private InventoryEventListener inventoryEventListener;

    private ProductCreatedEvent productCreatedEvent;
    private OrderCreatedEvent orderCreatedEvent;
    private OrderCancelledEvent orderCancelledEvent;
    private Inventory testInventory;

    @BeforeEach
    void setUp() {
        String productId = UUID.randomUUID().toString();
        
        productCreatedEvent = new ProductCreatedEvent(
                productId,
                "Test Product",
                "Test Description",
                new BigDecimal("99.99"),
                new BigDecimal("10.00"),
                null, null, null, null, null, true
        );

        List<OrderLineItem> orderItems = List.of(
                new OrderLineItem(productId, 2, new BigDecimal("50.00")),
                new OrderLineItem(UUID.randomUUID().toString(), 1, new BigDecimal("30.00"))
        );

        orderCreatedEvent = new OrderCreatedEvent(
                UUID.randomUUID().toString(),
                null,
                orderItems
        );

        orderCancelledEvent = new OrderCancelledEvent(
                UUID.randomUUID().toString(),
                null,
                orderItems
        );

        testInventory = Inventory.builder()
                .productId(UUID.fromString(productId))
                .quantity(10)
                .build();
    }

    @Test
    @DisplayName("Should create inventory for new product")
    void shouldCreateInventoryForNewProduct() {
        // Given
        UUID productId = UUID.fromString(productCreatedEvent.id());
        when(inventoryRepository.existsById(productId)).thenReturn(false);
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(testInventory);

        // When
        inventoryEventListener.onProductCreated(productCreatedEvent);

        // Then
        verify(inventoryRepository).existsById(productId);
        verify(inventoryRepository).save(argThat(inventory ->
                inventory.getProductId().equals(productId) &&
                inventory.getQuantity() == 0
        ));
    }

    @Test
    @DisplayName("Should not create inventory if product already exists")
    void shouldNotCreateInventoryIfProductAlreadyExists() {
        // Given
        UUID productId = UUID.fromString(productCreatedEvent.id());
        when(inventoryRepository.existsById(productId)).thenReturn(true);

        // When
        inventoryEventListener.onProductCreated(productCreatedEvent);

        // Then
        verify(inventoryRepository).existsById(productId);
        verify(inventoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should reduce inventory when order is created")
    void shouldReduceInventoryWhenOrderIsCreated() {
        // Given
        String productId = orderCreatedEvent.items().get(0).productId();
        UUID productUuid = UUID.fromString(productId);
        int orderQuantity = orderCreatedEvent.items().get(0).quantity();
        
        Inventory inventory = Inventory.builder()
                .productId(productUuid)
                .quantity(15)
                .build();

        when(inventoryRepository.findById(productUuid)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory);
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(null);

        // When
        inventoryEventListener.onOrderCreated(orderCreatedEvent);

        // Then
        verify(inventoryRepository).findById(productUuid);
        verify(inventoryRepository).save(inventory);
        assertEquals(13, inventory.getQuantity()); // 15 - 2 = 13

        verify(kafkaTemplate).send(eq("stock-adjusted"), eq(productId), any(StockAdjustedEvent.class));
        verify(kafkaTemplate, never()).send(eq("stock-depleted"), anyString(), any());
    }

    @Test
    @DisplayName("Should publish stock depleted event when inventory reaches zero")
    void shouldPublishStockDepletedEventWhenInventoryReachesZero() {
        // Given
        String productId = orderCreatedEvent.items().get(0).productId();
        UUID productUuid = UUID.fromString(productId);
        int orderQuantity = orderCreatedEvent.items().get(0).quantity();
        
        Inventory inventory = Inventory.builder()
                .productId(productUuid)
                .quantity(2) // Exact quantity being ordered
                .build();

        when(inventoryRepository.findById(productUuid)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory);
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(null);

        // When
        inventoryEventListener.onOrderCreated(orderCreatedEvent);

        // Then
        assertEquals(0, inventory.getQuantity());

        verify(kafkaTemplate).send(eq("stock-adjusted"), eq(productId), any(StockAdjustedEvent.class));
        verify(kafkaTemplate).send(eq("stock-depleted"), eq(productId), any(StockDepletedEvent.class));
    }

    @Test
    @DisplayName("Should handle negative inventory when order quantity exceeds stock")
    void shouldHandleNegativeInventoryWhenOrderQuantityExceedsStock() {
        // Given
        String productId = orderCreatedEvent.items().get(0).productId();
        UUID productUuid = UUID.fromString(productId);
        
        Inventory inventory = Inventory.builder()
                .productId(productUuid)
                .quantity(1) // Less than order quantity (2)
                .build();

        when(inventoryRepository.findById(productUuid)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory);
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(null);

        // When
        inventoryEventListener.onOrderCreated(orderCreatedEvent);

        // Then
        assertEquals(-1, inventory.getQuantity()); // 1 - 2 = -1

        verify(kafkaTemplate).send(eq("stock-adjusted"), eq(productId), any(StockAdjustedEvent.class));
        verify(kafkaTemplate, never()).send(eq("stock-depleted"), anyString(), any());
    }

    @Test
    @DisplayName("Should not process order item if inventory not found")
    void shouldNotProcessOrderItemIfInventoryNotFound() {
        // Given
        String productId = orderCreatedEvent.items().get(0).productId();
        UUID productUuid = UUID.fromString(productId);
        
        when(inventoryRepository.findById(productUuid)).thenReturn(Optional.empty());

        // When
        inventoryEventListener.onOrderCreated(orderCreatedEvent);

        // Then
        verify(inventoryRepository).findById(productUuid);
        verify(inventoryRepository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should increase inventory when order is cancelled")
    void shouldIncreaseInventoryWhenOrderIsCancelled() {
        // Given
        String productId = orderCancelledEvent.items().get(0).productId();
        UUID productUuid = UUID.fromString(productId);
        int cancelledQuantity = orderCancelledEvent.items().get(0).quantity();
        
        Inventory inventory = Inventory.builder()
                .productId(productUuid)
                .quantity(8)
                .build();

        when(inventoryRepository.findById(productUuid)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory);
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(null);

        // When
        inventoryEventListener.onOrderCancelled(orderCancelledEvent);

        // Then
        verify(inventoryRepository).findById(productUuid);
        verify(inventoryRepository).save(inventory);
        assertEquals(10, inventory.getQuantity()); // 8 + 2 = 10

        verify(kafkaTemplate).send(eq("stock-adjusted"), eq(productId), any(StockAdjustedEvent.class));
        verify(kafkaTemplate, never()).send(eq("stock-depleted"), anyString(), any());
    }

    @Test
    @DisplayName("Should restore inventory from negative to positive when order is cancelled")
    void shouldRestoreInventoryFromNegativeToPositiveWhenOrderIsCancelled() {
        // Given
        String productId = orderCancelledEvent.items().get(0).productId();
        UUID productUuid = UUID.fromString(productId);
        
        Inventory inventory = Inventory.builder()
                .productId(productUuid)
                .quantity(-2) // Negative inventory
                .build();

        when(inventoryRepository.findById(productUuid)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory);
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(null);

        // When
        inventoryEventListener.onOrderCancelled(orderCancelledEvent);

        // Then
        assertEquals(0, inventory.getQuantity()); // -2 + 2 = 0

        verify(kafkaTemplate).send(eq("stock-adjusted"), eq(productId), any(StockAdjustedEvent.class));
        verify(kafkaTemplate).send(eq("stock-depleted"), eq(productId), any(StockDepletedEvent.class));
    }

    @Test
    @DisplayName("Should not process cancelled order item if inventory not found")
    void shouldNotProcessCancelledOrderItemIfInventoryNotFound() {
        // Given
        String productId = orderCancelledEvent.items().get(0).productId();
        UUID productUuid = UUID.fromString(productId);
        
        when(inventoryRepository.findById(productUuid)).thenReturn(Optional.empty());

        // When
        inventoryEventListener.onOrderCancelled(orderCancelledEvent);

        // Then
        verify(inventoryRepository).findById(productUuid);
        verify(inventoryRepository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should process multiple items in order created event")
    void shouldProcessMultipleItemsInOrderCreatedEvent() {
        // Given
        List<OrderLineItem> multipleItems = List.of(
                new OrderLineItem(UUID.randomUUID().toString(), 1, new BigDecimal("25.00")),
                new OrderLineItem(UUID.randomUUID().toString(), 3, new BigDecimal("15.00")),
                new OrderLineItem(UUID.randomUUID().toString(), 2, new BigDecimal("30.00"))
        );
        
        OrderCreatedEvent multiItemEvent = new OrderCreatedEvent(
                UUID.randomUUID().toString(),
                null,
                multipleItems
        );

        // Mock inventories for all products
        multipleItems.forEach(item -> {
            UUID productId = UUID.fromString(item.productId());
            Inventory inventory = Inventory.builder()
                    .productId(productId)
                    .quantity(10)
                    .build();
            
            when(inventoryRepository.findById(productId)).thenReturn(Optional.of(inventory));
            when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory);
        });
        
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(null);

        // When
        inventoryEventListener.onOrderCreated(multiItemEvent);

        // Then
        verify(inventoryRepository, times(3)).findById(any(UUID.class));
        verify(inventoryRepository, times(3)).save(any(Inventory.class));
        verify(kafkaTemplate, times(3)).send(eq("stock-adjusted"), anyString(), any(StockAdjustedEvent.class));
        verify(kafkaTemplate, never()).send(eq("stock-depleted"), anyString(), any());
    }

    @Test
    @DisplayName("Should handle mixed inventory scenarios in single order")
    void shouldHandleMixedInventoryScenariosInSingleOrder() {
        // Given
        String product1Id = UUID.randomUUID().toString();
        String product2Id = UUID.randomUUID().toString();
        String product3Id = UUID.randomUUID().toString();
        
        List<OrderLineItem> mixedItems = List.of(
                new OrderLineItem(product1Id, 5, new BigDecimal("10.00")), // Will have stock
                new OrderLineItem(product2Id, 2, new BigDecimal("20.00")), // Will deplete stock
                new OrderLineItem(product3Id, 1, new BigDecimal("30.00"))  // Not found
        );
        
        OrderCreatedEvent mixedEvent = new OrderCreatedEvent(
                UUID.randomUUID().toString(),
                null,
                mixedItems
        );

        // Setup different inventory scenarios
        Inventory inventory1 = Inventory.builder()
                .productId(UUID.fromString(product1Id))
                .quantity(10) // Sufficient stock
                .build();
        
        Inventory inventory2 = Inventory.builder()
                .productId(UUID.fromString(product2Id))
                .quantity(2) // Exact stock, will be depleted
                .build();

        when(inventoryRepository.findById(UUID.fromString(product1Id))).thenReturn(Optional.of(inventory1));
        when(inventoryRepository.findById(UUID.fromString(product2Id))).thenReturn(Optional.of(inventory2));
        when(inventoryRepository.findById(UUID.fromString(product3Id))).thenReturn(Optional.empty());
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(null);

        // When
        inventoryEventListener.onOrderCreated(mixedEvent);

        // Then
        assertEquals(5, inventory1.getQuantity()); // 10 - 5 = 5
        assertEquals(0, inventory2.getQuantity()); // 2 - 2 = 0

        verify(inventoryRepository, times(2)).save(any(Inventory.class));
        verify(kafkaTemplate, times(2)).send(eq("stock-adjusted"), anyString(), any(StockAdjustedEvent.class));
        verify(kafkaTemplate, times(1)).send(eq("stock-depleted"), eq(product2Id), any(StockDepletedEvent.class));
    }

    @Test
    @DisplayName("Should handle large quantity orders")
    void shouldHandleLargeQuantityOrders() {
        // Given
        String productId = UUID.randomUUID().toString();
        List<OrderLineItem> largeQuantityItems = List.of(
                new OrderLineItem(productId, 1000, new BigDecimal("1.50"))
        );
        
        OrderCreatedEvent largeOrderEvent = new OrderCreatedEvent(
                UUID.randomUUID().toString(),
                null,
                largeQuantityItems
        );

        Inventory inventory = Inventory.builder()
                .productId(UUID.fromString(productId))
                .quantity(1500)
                .build();

        when(inventoryRepository.findById(UUID.fromString(productId))).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory);
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(null);

        // When
        inventoryEventListener.onOrderCreated(largeOrderEvent);

        // Then
        assertEquals(500, inventory.getQuantity()); // 1500 - 1000 = 500

        verify(kafkaTemplate).send(eq("stock-adjusted"), eq(productId), any(StockAdjustedEvent.class));
        verify(kafkaTemplate, never()).send(eq("stock-depleted"), anyString(), any());
    }

    @Test
    @DisplayName("Should handle concurrent inventory updates")
    void shouldHandleConcurrentInventoryUpdates() {
        // Given
        String productId = UUID.randomUUID().toString();
        UUID productUuid = UUID.fromString(productId);
        
        List<OrderLineItem> items1 = List.of(new OrderLineItem(productId, 3, new BigDecimal("10.00")));
        List<OrderLineItem> items2 = List.of(new OrderLineItem(productId, 2, new BigDecimal("10.00")));
        
        OrderCreatedEvent event1 = new OrderCreatedEvent(UUID.randomUUID().toString(), null, items1);
        OrderCreatedEvent event2 = new OrderCreatedEvent(UUID.randomUUID().toString(), null, items2);

        Inventory inventory = Inventory.builder()
                .productId(productUuid)
                .quantity(10)
                .build();

        when(inventoryRepository.findById(productUuid)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(kafkaTemplate.send(anyString(), anyString(), any())).thenReturn(null);

        // When - simulate concurrent processing
        inventoryEventListener.onOrderCreated(event1);
        inventoryEventListener.onOrderCreated(event2);

        // Then - final quantity should reflect both deductions
        assertEquals(5, inventory.getQuantity()); // 10 - 3 - 2 = 5

        verify(inventoryRepository, times(2)).findById(productUuid);
        verify(inventoryRepository, times(2)).save(inventory);
        verify(kafkaTemplate, times(2)).send(eq("stock-adjusted"), eq(productId), any(StockAdjustedEvent.class));
    }

    @Test
    @DisplayName("Should handle null or empty order items gracefully")
    void shouldHandleNullOrEmptyOrderItemsGracefully() {
        // Given
        OrderCreatedEvent emptyItemsEvent = new OrderCreatedEvent(
                UUID.randomUUID().toString(),
                null,
                List.of()
        );

        // When & Then - should not throw exception
        assertDoesNotThrow(() -> inventoryEventListener.onOrderCreated(emptyItemsEvent));
        assertDoesNotThrow(() -> inventoryEventListener.onOrderCancelled(
                new OrderCancelledEvent(UUID.randomUUID().toString(), null, List.of())
        ));

        verify(inventoryRepository, never()).findById(any());
        verify(inventoryRepository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }
}
