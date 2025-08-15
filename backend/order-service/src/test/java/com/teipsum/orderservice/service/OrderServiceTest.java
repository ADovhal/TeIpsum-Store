package com.teipsum.orderservice.service;

import com.teipsum.orderservice.dto.OrderRequest;
import com.teipsum.orderservice.dto.UserOrderInfoResponse;
import com.teipsum.orderservice.event.OrderEventPublisher;
import com.teipsum.shared.event.UserOrdersAnonymizedEvent;
import com.teipsum.orderservice.model.Order;
import com.teipsum.orderservice.model.OrderItem;
import com.teipsum.orderservice.model.OrderStatus;
import com.teipsum.orderservice.repository.OrderRepository;
import com.teipsum.shared.exceptions.ConflictException;
import com.teipsum.shared.exceptions.NotFoundException;
import com.teipsum.shared.product.event.OrderLineItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService Tests")
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderEventPublisher orderEventPublisher;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private OrderService orderService;

    private OrderRequest orderRequest;
    private Order testOrder;
    private UUID userId;
    private UUID orderId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        orderId = UUID.randomUUID();

        List<OrderLineItem> items = List.of(
                new OrderLineItem("product-1", 2, new BigDecimal("50.00")),
                new OrderLineItem("product-2", 1, new BigDecimal("30.00"))
        );

        orderRequest = new OrderRequest(items);

        testOrder = Order.builder()
                .id(orderId)
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("130.00"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        List<OrderItem> orderItems = List.of(
                OrderItem.builder()
                        .id(UUID.randomUUID())
                        .order(testOrder)
                        .productId("product-1")
                        .quantity(2)
                        .priceSnapshot(new BigDecimal("50.00"))
                        .build(),
                OrderItem.builder()
                        .id(UUID.randomUUID())
                        .order(testOrder)
                        .productId("product-2")
                        .quantity(1)
                        .priceSnapshot(new BigDecimal("30.00"))
                        .build()
        );

        testOrder.setItems(orderItems);
    }

    @Test
    @DisplayName("Should create order successfully")
    void shouldCreateOrderSuccessfully() {
        // Given
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        doNothing().when(orderEventPublisher).publishOrderCreated(any(Order.class));

        // When
        Order result = orderService.createOrder(userId, orderRequest);

        // Then
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(OrderStatus.PENDING, result.getStatus());
        assertEquals(new BigDecimal("130.00"), result.getTotalAmount());
        assertEquals(2, result.getItems().size());

        verify(orderRepository).save(any(Order.class));
        verify(orderEventPublisher).publishOrderCreated(any(Order.class));
    }

    @Test
    @DisplayName("Should create guest order successfully")
    void shouldCreateGuestOrderSuccessfully() {
        // Given
        Order guestOrder = Order.builder()
                .id(orderId)
                .userId(null) // Guest order
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("130.00"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(orderRepository.save(any(Order.class))).thenReturn(guestOrder);
        doNothing().when(orderEventPublisher).publishOrderCreated(any(Order.class));

        // When
        Order result = orderService.createOrder(null, orderRequest);

        // Then
        assertNotNull(result);
        assertNull(result.getUserId());
        assertEquals(OrderStatus.PENDING, result.getStatus());
        assertEquals(new BigDecimal("130.00"), result.getTotalAmount());

        verify(orderRepository).save(any(Order.class));
        verify(orderEventPublisher).publishOrderCreated(any(Order.class));
    }

    @Test
    @DisplayName("Should calculate total amount correctly")
    void shouldCalculateTotalAmountCorrectly() {
        // Given
        List<OrderLineItem> items = List.of(
                new OrderLineItem("product-1", 3, new BigDecimal("25.50")),
                new OrderLineItem("product-2", 2, new BigDecimal("15.75")),
                new OrderLineItem("product-3", 1, new BigDecimal("100.00"))
        );
        OrderRequest request = new OrderRequest(items);

        Order savedOrder = Order.builder()
                .id(orderId)
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("208.00")) // 3*25.50 + 2*15.75 + 1*100.00 = 76.50 + 31.50 + 100.00
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);
        doNothing().when(orderEventPublisher).publishOrderCreated(any(Order.class));

        // When
        Order result = orderService.createOrder(userId, request);

        // Then
        assertEquals(new BigDecimal("208.00"), result.getTotalAmount());

        verify(orderRepository).save(argThat(order -> 
                order.getTotalAmount().equals(new BigDecimal("208.00"))
        ));
    }

    @Test
    @DisplayName("Should create order with single item")
    void shouldCreateOrderWithSingleItem() {
        // Given
        List<OrderLineItem> singleItem = List.of(
                new OrderLineItem("product-single", 1, new BigDecimal("99.99"))
        );
        OrderRequest singleItemRequest = new OrderRequest(singleItem);

        Order singleItemOrder = Order.builder()
                .id(orderId)
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("99.99"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(orderRepository.save(any(Order.class))).thenReturn(singleItemOrder);
        doNothing().when(orderEventPublisher).publishOrderCreated(any(Order.class));

        // When
        Order result = orderService.createOrder(userId, singleItemRequest);

        // Then
        assertNotNull(result);
        assertEquals(new BigDecimal("99.99"), result.getTotalAmount());
        assertEquals(1, result.getItems().size());

        verify(orderRepository).save(any(Order.class));
        verify(orderEventPublisher).publishOrderCreated(any(Order.class));
    }

    @Test
    @DisplayName("Should cancel order successfully")
    void shouldCancelOrderSuccessfully() {
        // Given
        when(orderRepository.findByIdAndUserId(orderId, userId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        doNothing().when(orderEventPublisher).publishOrderCancelled(any(Order.class));

        // When
        orderService.cancel(orderId, userId);

        // Then
        assertEquals(OrderStatus.CANCELLED, testOrder.getStatus());
        assertNotNull(testOrder.getUpdatedAt());

        verify(orderRepository).findByIdAndUserId(orderId, userId);
        verify(orderRepository).save(testOrder);
        verify(orderEventPublisher).publishOrderCancelled(testOrder);
    }

    @Test
    @DisplayName("Should throw NotFoundException when order not found for cancellation")
    void shouldThrowNotFoundExceptionWhenOrderNotFoundForCancellation() {
        // Given
        UUID nonExistentOrderId = UUID.randomUUID();
        when(orderRepository.findByIdAndUserId(nonExistentOrderId, userId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, 
                () -> orderService.cancel(nonExistentOrderId, userId));

        verify(orderRepository).findByIdAndUserId(nonExistentOrderId, userId);
        verify(orderRepository, never()).save(any());
        verify(orderEventPublisher, never()).publishOrderCancelled(any());
    }

    @Test
    @DisplayName("Should throw ConflictException when trying to cancel non-pending order")
    void shouldThrowConflictExceptionWhenTryingToCancelNonPendingOrder() {
        // Given
        Order completedOrder = Order.builder()
                .id(orderId)
                .userId(userId)
                .status(OrderStatus.COMPLETED)
                .totalAmount(new BigDecimal("130.00"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(orderRepository.findByIdAndUserId(orderId, userId)).thenReturn(Optional.of(completedOrder));

        // When & Then
        assertThrows(ConflictException.class, 
                () -> orderService.cancel(orderId, userId));

        verify(orderRepository).findByIdAndUserId(orderId, userId);
        verify(orderRepository, never()).save(any());
        verify(orderEventPublisher, never()).publishOrderCancelled(any());
    }

    @Test
    @DisplayName("Should find order by id and user id successfully")
    void shouldFindOrderByIdAndUserIdSuccessfully() {
        // Given
        when(orderRepository.findByIdAndUserId(orderId, userId)).thenReturn(Optional.of(testOrder));

        // When
        Order result = orderService.findByIdAndUserId(orderId, userId);

        // Then
        assertNotNull(result);
        assertEquals(testOrder, result);
        assertEquals(orderId, result.getId());
        assertEquals(userId, result.getUserId());

        verify(orderRepository).findByIdAndUserId(orderId, userId);
    }

    @Test
    @DisplayName("Should throw NotFoundException when order not found by id and user id")
    void shouldThrowNotFoundExceptionWhenOrderNotFoundByIdAndUserId() {
        // Given
        UUID nonExistentOrderId = UUID.randomUUID();
        when(orderRepository.findByIdAndUserId(nonExistentOrderId, userId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, 
                () -> orderService.findByIdAndUserId(nonExistentOrderId, userId));

        verify(orderRepository).findByIdAndUserId(nonExistentOrderId, userId);
    }

    @Test
    @DisplayName("Should find all orders by user successfully")
    void shouldFindAllOrdersByUserSuccessfully() {
        // Given
        Order order2 = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.COMPLETED)
                .totalAmount(new BigDecimal("75.00"))
                .createdAt(Instant.now().minusSeconds(3600))
                .updatedAt(Instant.now().minusSeconds(3600))
                .build();

        List<Order> userOrders = List.of(testOrder, order2);
        when(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)).thenReturn(userOrders);

        // When
        List<Order> result = orderService.findAllByUser(userId);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testOrder, result.get(0));
        assertEquals(order2, result.get(1));

        verify(orderRepository).findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    @DisplayName("Should return empty list when user has no orders")
    void shouldReturnEmptyListWhenUserHasNoOrders() {
        // Given
        UUID userWithNoOrders = UUID.randomUUID();
        when(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userWithNoOrders)).thenReturn(List.of());

        // When
        List<Order> result = orderService.findAllByUser(userWithNoOrders);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(orderRepository).findAllByUserIdOrderByCreatedAtDesc(userWithNoOrders);
    }

    @Test
    @DisplayName("Should handle order with zero total amount")
    void shouldHandleOrderWithZeroTotalAmount() {
        // Given
        List<OrderLineItem> zeroItems = List.of(
                new OrderLineItem("free-product", 1, BigDecimal.ZERO)
        );
        OrderRequest zeroRequest = new OrderRequest(zeroItems);

        Order zeroOrder = Order.builder()
                .id(orderId)
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(orderRepository.save(any(Order.class))).thenReturn(zeroOrder);
        doNothing().when(orderEventPublisher).publishOrderCreated(any(Order.class));

        // When
        Order result = orderService.createOrder(userId, zeroRequest);

        // Then
        assertNotNull(result);
        assertEquals(BigDecimal.ZERO, result.getTotalAmount());

        verify(orderRepository).save(any(Order.class));
        verify(orderEventPublisher).publishOrderCreated(any(Order.class));
    }

    @Test
    @DisplayName("Should handle order with large quantities")
    void shouldHandleOrderWithLargeQuantities() {
        // Given
        List<OrderLineItem> largeQuantityItems = List.of(
                new OrderLineItem("bulk-product", 1000, new BigDecimal("1.50"))
        );
        OrderRequest largeQuantityRequest = new OrderRequest(largeQuantityItems);

        Order largeQuantityOrder = Order.builder()
                .id(orderId)
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("1500.00"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(orderRepository.save(any(Order.class))).thenReturn(largeQuantityOrder);
        doNothing().when(orderEventPublisher).publishOrderCreated(any(Order.class));

        // When
        Order result = orderService.createOrder(userId, largeQuantityRequest);

        // Then
        assertNotNull(result);
        assertEquals(new BigDecimal("1500.00"), result.getTotalAmount());

        verify(orderRepository).save(any(Order.class));
        verify(orderEventPublisher).publishOrderCreated(any(Order.class));
    }

    @Test
    @DisplayName("Should handle order with decimal prices")
    void shouldHandleOrderWithDecimalPrices() {
        // Given
        List<OrderLineItem> decimalItems = List.of(
                new OrderLineItem("decimal-product", 3, new BigDecimal("19.99")),
                new OrderLineItem("another-decimal", 2, new BigDecimal("5.49"))
        );
        OrderRequest decimalRequest = new OrderRequest(decimalItems);

        // 3 * 19.99 + 2 * 5.49 = 59.97 + 10.98 = 70.95
        Order decimalOrder = Order.builder()
                .id(orderId)
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("70.95"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(orderRepository.save(any(Order.class))).thenReturn(decimalOrder);
        doNothing().when(orderEventPublisher).publishOrderCreated(any(Order.class));

        // When
        Order result = orderService.createOrder(userId, decimalRequest);

        // Then
        assertNotNull(result);
        assertEquals(new BigDecimal("70.95"), result.getTotalAmount());

        verify(orderRepository).save(any(Order.class));
        verify(orderEventPublisher).publishOrderCreated(any(Order.class));
    }

    @Test
    @DisplayName("Should handle concurrent order operations")
    void shouldHandleConcurrentOrderOperations() {
        // Given
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(orderRepository.findByIdAndUserId(orderId, userId)).thenReturn(Optional.of(testOrder));
        doNothing().when(orderEventPublisher).publishOrderCreated(any(Order.class));

        // When - simulate concurrent operations
        Order createdOrder = orderService.createOrder(userId, orderRequest);
        Order foundOrder = orderService.findByIdAndUserId(orderId, userId);

        // Then
        assertNotNull(createdOrder);
        assertNotNull(foundOrder);
        assertEquals(testOrder, createdOrder);
        assertEquals(testOrder, foundOrder);

        verify(orderRepository).save(any(Order.class));
        verify(orderRepository).findByIdAndUserId(orderId, userId);
        verify(orderEventPublisher).publishOrderCreated(any(Order.class));
    }

    @Test
    @DisplayName("Should preserve order creation timestamp")
    void shouldPreserveOrderCreationTimestamp() {
        // Given
        Instant specificTime = Instant.parse("2024-01-20T10:30:00Z");
        Order timestampedOrder = Order.builder()
                .id(orderId)
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("130.00"))
                .createdAt(specificTime)
                .updatedAt(specificTime)
                .build();

        when(orderRepository.save(any(Order.class))).thenReturn(timestampedOrder);
        doNothing().when(orderEventPublisher).publishOrderCreated(any(Order.class));

        // When
        Order result = orderService.createOrder(userId, orderRequest);

        // Then
        assertNotNull(result);
        assertEquals(specificTime, result.getCreatedAt());
        assertEquals(specificTime, result.getUpdatedAt());

        verify(orderRepository).save(any(Order.class));
    }

    // ============== NEW ORDER ANONYMIZATION FUNCTIONALITY TESTS ==============

    @Test
    @DisplayName("Should get user order info successfully")
    void shouldGetUserOrderInfoSuccessfully() {
        // Given
        Order activeOrder = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("100.00"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Order completedOrder = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.COMPLETED)
                .totalAmount(new BigDecimal("75.00"))
                .createdAt(Instant.now().minusSeconds(3600))
                .updatedAt(Instant.now().minusSeconds(3600))
                .build();

        List<Order> userOrders = List.of(activeOrder, completedOrder);
        when(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)).thenReturn(userOrders);

        // When
        UserOrderInfoResponse result = orderService.getUserOrderInfo(userId);

        // Then
        assertNotNull(result);
        assertEquals(2, result.orderCount());
        assertTrue(result.hasActiveOrders()); // Has one pending order

        verify(orderRepository).findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    @DisplayName("Should get user order info with no active orders")
    void shouldGetUserOrderInfoWithNoActiveOrders() {
        // Given
        Order completedOrder1 = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.COMPLETED)
                .totalAmount(new BigDecimal("100.00"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Order completedOrder2 = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.CANCELLED)
                .totalAmount(new BigDecimal("75.00"))
                .createdAt(Instant.now().minusSeconds(3600))
                .updatedAt(Instant.now().minusSeconds(3600))
                .build();

        List<Order> userOrders = List.of(completedOrder1, completedOrder2);
        when(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)).thenReturn(userOrders);

        // When
        UserOrderInfoResponse result = orderService.getUserOrderInfo(userId);

        // Then
        assertNotNull(result);
        assertEquals(2, result.orderCount());
        assertFalse(result.hasActiveOrders()); // No pending/processing orders

        verify(orderRepository).findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    @DisplayName("Should get user order info for user with no orders")
    void shouldGetUserOrderInfoForUserWithNoOrders() {
        // Given
        when(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)).thenReturn(List.of());

        // When
        UserOrderInfoResponse result = orderService.getUserOrderInfo(userId);

        // Then
        assertNotNull(result);
        assertEquals(0, result.orderCount());
        assertFalse(result.hasActiveOrders());

        verify(orderRepository).findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    @DisplayName("Should anonymize user orders successfully")
    void shouldAnonymizeUserOrdersSuccessfully() {
        // Given
        String userEmail = "test@example.com";
        
        Order order1 = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.COMPLETED)
                .totalAmount(new BigDecimal("100.00"))
                .createdAt(Instant.now().minusSeconds(7200))
                .updatedAt(Instant.now().minusSeconds(7200))
                .build();

        Order order2 = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("75.00"))
                .createdAt(Instant.now().minusSeconds(3600))
                .updatedAt(Instant.now().minusSeconds(3600))
                .build();

        List<Order> userOrders = List.of(order1, order2);
        when(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)).thenReturn(userOrders);
        when(orderRepository.saveAll(anyList())).thenReturn(userOrders);

        // When
        orderService.anonymizeUserOrders(userId, userEmail);

        // Then
        // Verify orders are anonymized (userId set to null)
        assertNull(order1.getUserId());
        assertNull(order2.getUserId());
        
        // Verify timestamps are updated
        assertNotNull(order1.getUpdatedAt());
        assertNotNull(order2.getUpdatedAt());

        verify(orderRepository).findAllByUserIdOrderByCreatedAtDesc(userId);
        verify(orderRepository).saveAll(userOrders);
        verify(kafkaTemplate).send(eq("user-orders-anonymized"), eq(userId.toString()), any(UserOrdersAnonymizedEvent.class));
    }

    @Test
    @DisplayName("Should handle anonymization for user with no orders")
    void shouldHandleAnonymizationForUserWithNoOrders() {
        // Given
        String userEmail = "test@example.com";
        when(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)).thenReturn(List.of());

        // When
        orderService.anonymizeUserOrders(userId, userEmail);

        // Then
        verify(orderRepository).findAllByUserIdOrderByCreatedAtDesc(userId);
        verify(orderRepository, never()).saveAll(any());
        verify(kafkaTemplate).send(eq("user-orders-anonymized"), eq(userId.toString()), 
                argThat((UserOrdersAnonymizedEvent event) -> 
                        event.userId().equals(userId.toString()) &&
                        event.email().equals(userEmail) &&
                        event.anonymizedOrderCount() == 0
                ));
    }

    @Test
    @DisplayName("Should anonymize large number of orders efficiently")
    void shouldAnonymizeLargeNumberOfOrdersEfficiently() {
        // Given
        String userEmail = "test@example.com";
        int orderCount = 100;
        
        List<Order> manyOrders = new java.util.ArrayList<>();
        for (int i = 0; i < orderCount; i++) {
            Order order = Order.builder()
                    .id(UUID.randomUUID())
                    .userId(userId)
                    .status(i % 2 == 0 ? OrderStatus.COMPLETED : OrderStatus.PENDING)
                    .totalAmount(new BigDecimal("50.00"))
                    .createdAt(Instant.now().minusSeconds(i * 100))
                    .updatedAt(Instant.now().minusSeconds(i * 100))
                    .build();
            manyOrders.add(order);
        }

        when(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)).thenReturn(manyOrders);
        when(orderRepository.saveAll(anyList())).thenReturn(manyOrders);

        // When
        orderService.anonymizeUserOrders(userId, userEmail);

        // Then
        // Verify all orders are anonymized
        manyOrders.forEach(order -> assertNull(order.getUserId()));

        verify(orderRepository).findAllByUserIdOrderByCreatedAtDesc(userId);
        verify(orderRepository).saveAll(manyOrders);
        verify(kafkaTemplate).send(eq("user-orders-anonymized"), eq(userId.toString()), 
                argThat((UserOrdersAnonymizedEvent event) -> 
                        event.anonymizedOrderCount() == orderCount
                ));
    }

    @Test
    @DisplayName("Should preserve order business data during anonymization")
    void shouldPreserveOrderBusinessDataDuringAnonymization() {
        // Given
        String userEmail = "test@example.com";
        UUID originalOrderId = UUID.randomUUID();
        BigDecimal originalAmount = new BigDecimal("123.45");
        OrderStatus originalStatus = OrderStatus.COMPLETED;
        Instant originalCreatedAt = Instant.now().minusSeconds(3600);
        
        Order order = Order.builder()
                .id(originalOrderId)
                .userId(userId)
                .status(originalStatus)
                .totalAmount(originalAmount)
                .createdAt(originalCreatedAt)
                .updatedAt(originalCreatedAt)
                .build();

        when(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)).thenReturn(List.of(order));
        when(orderRepository.saveAll(anyList())).thenReturn(List.of(order));

        // When
        orderService.anonymizeUserOrders(userId, userEmail);

        // Then
        // Verify personal data is removed
        assertNull(order.getUserId());
        
        // Verify business data is preserved
        assertEquals(originalOrderId, order.getId());
        assertEquals(originalAmount, order.getTotalAmount());
        assertEquals(originalStatus, order.getStatus());
        assertEquals(originalCreatedAt, order.getCreatedAt());
        
        // Verify updatedAt is updated
        assertTrue(order.getUpdatedAt().isAfter(originalCreatedAt));

        verify(orderRepository).findAllByUserIdOrderByCreatedAtDesc(userId);
        verify(orderRepository).saveAll(List.of(order));
    }

    @Test
    @DisplayName("Should handle mixed order statuses during anonymization")
    void shouldHandleMixedOrderStatusesDuringAnonymization() {
        // Given
        String userEmail = "test@example.com";
        
        Order pendingOrder = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("50.00"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Order processingOrder = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.PROCESSING)
                .totalAmount(new BigDecimal("75.00"))
                .createdAt(Instant.now().minusSeconds(1800))
                .updatedAt(Instant.now().minusSeconds(1800))
                .build();

        Order completedOrder = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.COMPLETED)
                .totalAmount(new BigDecimal("100.00"))
                .createdAt(Instant.now().minusSeconds(3600))
                .updatedAt(Instant.now().minusSeconds(3600))
                .build();

        Order cancelledOrder = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.CANCELLED)
                .totalAmount(new BigDecimal("25.00"))
                .createdAt(Instant.now().minusSeconds(7200))
                .updatedAt(Instant.now().minusSeconds(7200))
                .build();

        List<Order> mixedOrders = List.of(pendingOrder, processingOrder, completedOrder, cancelledOrder);
        when(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)).thenReturn(mixedOrders);
        when(orderRepository.saveAll(anyList())).thenReturn(mixedOrders);

        // When
        orderService.anonymizeUserOrders(userId, userEmail);

        // Then
        // Verify all orders are anonymized regardless of status
        mixedOrders.forEach(order -> {
            assertNull(order.getUserId());
            assertNotNull(order.getUpdatedAt());
        });

        // Verify original statuses are preserved
        assertEquals(OrderStatus.PENDING, pendingOrder.getStatus());
        assertEquals(OrderStatus.PROCESSING, processingOrder.getStatus());
        assertEquals(OrderStatus.COMPLETED, completedOrder.getStatus());
        assertEquals(OrderStatus.CANCELLED, cancelledOrder.getStatus());

        verify(orderRepository).findAllByUserIdOrderByCreatedAtDesc(userId);
        verify(orderRepository).saveAll(mixedOrders);
        verify(kafkaTemplate).send(eq("user-orders-anonymized"), eq(userId.toString()), 
                argThat((UserOrdersAnonymizedEvent event) -> 
                        event.anonymizedOrderCount() == 4
                ));
    }
}
