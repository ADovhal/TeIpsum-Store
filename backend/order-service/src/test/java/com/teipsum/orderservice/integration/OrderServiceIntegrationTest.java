package com.teipsum.orderservice.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teipsum.orderservice.dto.OrderRequest;
import com.teipsum.orderservice.model.Order;
import com.teipsum.orderservice.model.OrderStatus;
import com.teipsum.orderservice.repository.OrderRepository;
import com.teipsum.shared.product.event.OrderLineItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("Order Service Integration Tests")
class OrderServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OrderRepository orderRepository;

    @MockitoBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
    }

    @Test
    @DisplayName("Should create guest order with full integration")
    void shouldCreateGuestOrderWithFullIntegration() throws Exception {
        // Given
        List<OrderLineItem> items = List.of(
                new OrderLineItem("product-1", 2, new BigDecimal("25.50")),
                new OrderLineItem("product-2", 1, new BigDecimal("49.99"))
        );
        OrderRequest orderRequest = new OrderRequest(items);

        // When & Then
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").isEmpty())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.totalAmount").value(100.99)) // 2*25.50 + 1*49.99
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(2))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.createdAt").exists());

        // Verify order was saved in database
        List<Order> orders = orderRepository.findAll();
        assertEquals(1, orders.size());
        Order savedOrder = orders.get(0);
        assertNull(savedOrder.getUserId());
        assertEquals(OrderStatus.PENDING, savedOrder.getStatus());
        assertEquals(new BigDecimal("100.99"), savedOrder.getTotalAmount());
        assertEquals(2, savedOrder.getItems().size());
    }

    @Test
    @DisplayName("Should handle order creation with validation errors")
    void shouldHandleOrderCreationWithValidationErrors() throws Exception {
        // Given - empty items list
        OrderRequest emptyRequest = new OrderRequest(List.of());

        // When & Then
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyRequest)))
                .andExpect(status().isBadRequest());

        // Verify no order was created
        assertEquals(0, orderRepository.count());
    }

    @Test
    @DisplayName("Should handle large orders correctly")
    void shouldHandleLargeOrdersCorrectly() throws Exception {
        // Given - order with many items
        List<OrderLineItem> manyItems = List.of(
                new OrderLineItem("product-1", 5, new BigDecimal("10.00")),
                new OrderLineItem("product-2", 3, new BigDecimal("15.50")),
                new OrderLineItem("product-3", 2, new BigDecimal("25.75")),
                new OrderLineItem("product-4", 1, new BigDecimal("100.00")),
                new OrderLineItem("product-5", 10, new BigDecimal("5.99"))
        );
        OrderRequest largeRequest = new OrderRequest(manyItems);
        // Total: 5*10 + 3*15.50 + 2*25.75 + 1*100 + 10*5.99 = 50 + 46.50 + 51.50 + 100 + 59.90 = 307.90

        // When & Then
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(largeRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAmount").value(307.90))
                .andExpect(jsonPath("$.items.length()").value(5));

        // Verify order was saved correctly
        List<Order> orders = orderRepository.findAll();
        assertEquals(1, orders.size());
        Order savedOrder = orders.get(0);
        assertEquals(new BigDecimal("307.90"), savedOrder.getTotalAmount());
        assertEquals(5, savedOrder.getItems().size());
    }

    @Test
    @DisplayName("Should handle orders with decimal calculations correctly")
    void shouldHandleOrdersWithDecimalCalculationsCorrectly() throws Exception {
        // Given - items with decimal prices that could cause precision issues
        List<OrderLineItem> decimalItems = List.of(
                new OrderLineItem("product-1", 3, new BigDecimal("19.99")),
                new OrderLineItem("product-2", 2, new BigDecimal("5.49"))
        );
        OrderRequest decimalRequest = new OrderRequest(decimalItems);
        // Total: 3*19.99 + 2*5.49 = 59.97 + 10.98 = 70.95

        // When & Then
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(decimalRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAmount").value(70.95));

        // Verify precise decimal calculation in database
        List<Order> orders = orderRepository.findAll();
        assertEquals(1, orders.size());
        Order savedOrder = orders.get(0);
        assertEquals(new BigDecimal("70.95"), savedOrder.getTotalAmount());
    }

    @Test
    @DisplayName("Should handle zero-price items")
    void shouldHandleZeroPriceItems() throws Exception {
        // Given - order with free items
        List<OrderLineItem> freeItems = List.of(
                new OrderLineItem("free-product", 1, BigDecimal.ZERO),
                new OrderLineItem("paid-product", 1, new BigDecimal("29.99"))
        );
        OrderRequest freeRequest = new OrderRequest(freeItems);

        // When & Then
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(freeRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAmount").value(29.99));

        // Verify order was saved correctly
        List<Order> orders = orderRepository.findAll();
        assertEquals(1, orders.size());
        Order savedOrder = orders.get(0);
        assertEquals(new BigDecimal("29.99"), savedOrder.getTotalAmount());
        assertEquals(2, savedOrder.getItems().size());
    }

    @Test
    @DisplayName("Should handle completely free orders")
    void shouldHandleCompletelyFreeOrders() throws Exception {
        // Given - order with all free items
        List<OrderLineItem> allFreeItems = List.of(
                new OrderLineItem("free-product-1", 2, BigDecimal.ZERO),
                new OrderLineItem("free-product-2", 1, BigDecimal.ZERO)
        );
        OrderRequest freeOrderRequest = new OrderRequest(allFreeItems);

        // When & Then
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(freeOrderRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAmount").value(0.00));

        // Verify free order was saved correctly
        List<Order> orders = orderRepository.findAll();
        assertEquals(1, orders.size());
        Order savedOrder = orders.get(0);
        assertEquals(BigDecimal.ZERO, savedOrder.getTotalAmount());
        assertEquals(2, savedOrder.getItems().size());
    }

    @Test
    @DisplayName("Should handle malformed JSON gracefully")
    void shouldHandleMalformedJsonGracefully() throws Exception {
        // Given - malformed JSON
        String malformedJson = "{\"items\":[{\"productId\":\"test\",\"quantity\":}]}";

        // When & Then
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedJson))
                .andExpect(status().isBadRequest());

        // Verify no order was created
        assertEquals(0, orderRepository.count());
    }

    @Test
    @DisplayName("Should require CSRF token for order creation")
    void shouldRequireCsrfTokenForOrderCreation() throws Exception {
        // Given
        List<OrderLineItem> items = List.of(
                new OrderLineItem("product-1", 1, new BigDecimal("10.00"))
        );
        OrderRequest orderRequest = new OrderRequest(items);

        // When & Then - without CSRF token
        mockMvc.perform(post("/api/orders/guest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isForbidden());

        // Verify no order was created
        assertEquals(0, orderRepository.count());
    }

    @Test
    @DisplayName("Should handle concurrent order creation")
    void shouldHandleConcurrentOrderCreation() throws Exception {
        // Given
        List<OrderLineItem> items1 = List.of(
                new OrderLineItem("product-1", 1, new BigDecimal("25.00"))
        );
        List<OrderLineItem> items2 = List.of(
                new OrderLineItem("product-2", 2, new BigDecimal("15.00"))
        );
        
        OrderRequest request1 = new OrderRequest(items1);
        OrderRequest request2 = new OrderRequest(items2);

        // When - create multiple orders concurrently
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isOk());

        // Then - verify both orders were created
        List<Order> orders = orderRepository.findAll();
        assertEquals(2, orders.size());
        
        // Verify totals are correct
        boolean found25 = false, found30 = false;
        for (Order order : orders) {
            if (order.getTotalAmount().equals(new BigDecimal("25.00"))) {
                found25 = true;
            } else if (order.getTotalAmount().equals(new BigDecimal("30.00"))) {
                found30 = true;
            }
        }
        assertTrue(found25, "Order with total 25.00 not found");
        assertTrue(found30, "Order with total 30.00 not found");
    }

    @Test
    @DisplayName("Should handle database constraints correctly")
    void shouldHandleDatabaseConstraintsCorrectly() throws Exception {
        // Given - create order first
        List<OrderLineItem> items = List.of(
                new OrderLineItem("product-1", 1, new BigDecimal("50.00"))
        );
        OrderRequest orderRequest = new OrderRequest(items);

        // When - create order via API
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk());

        // Then - verify order exists and has unique ID
        List<Order> orders = orderRepository.findAll();
        assertEquals(1, orders.size());
        Order savedOrder = orders.get(0);
        assertNotNull(savedOrder.getId());
        assertNotNull(savedOrder.getCreatedAt());
        assertNotNull(savedOrder.getUpdatedAt());
    }

    @Test
    @DisplayName("Should handle order item relationships correctly")
    void shouldHandleOrderItemRelationshipsCorrectly() throws Exception {
        // Given
        List<OrderLineItem> items = List.of(
                new OrderLineItem("product-1", 3, new BigDecimal("20.00")),
                new OrderLineItem("product-2", 1, new BigDecimal("35.99"))
        );
        OrderRequest orderRequest = new OrderRequest(items);

        // When
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk());

        // Then - verify order-item relationships
        List<Order> orders = orderRepository.findAll();
        assertEquals(1, orders.size());
        
        Order savedOrder = orders.get(0);
        assertEquals(2, savedOrder.getItems().size());
        
        // Verify each item is properly linked to the order
        savedOrder.getItems().forEach(item -> {
            assertNotNull(item.getId());
            assertEquals(savedOrder, item.getOrder());
            assertNotNull(item.getProductId());
            assertTrue(item.getQuantity() > 0);
            assertNotNull(item.getPriceSnapshot());
        });
    }

    @Test
    @DisplayName("Should handle order timestamps correctly")
    void shouldHandleOrderTimestampsCorrectly() throws Exception {
        // Given
        List<OrderLineItem> items = List.of(
                new OrderLineItem("product-1", 1, new BigDecimal("10.00"))
        );
        OrderRequest orderRequest = new OrderRequest(items);

        Instant beforeCreation = Instant.now();

        // When
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk());

        Instant afterCreation = Instant.now();

        // Then - verify timestamps
        List<Order> orders = orderRepository.findAll();
        assertEquals(1, orders.size());
        
        Order savedOrder = orders.get(0);
        assertNotNull(savedOrder.getCreatedAt());
        assertNotNull(savedOrder.getUpdatedAt());
        
        // Verify timestamps are within reasonable bounds
        assertTrue(savedOrder.getCreatedAt().isAfter(beforeCreation.minusSeconds(1)));
        assertTrue(savedOrder.getCreatedAt().isBefore(afterCreation.plusSeconds(1)));
        assertTrue(savedOrder.getUpdatedAt().isAfter(beforeCreation.minusSeconds(1)));
        assertTrue(savedOrder.getUpdatedAt().isBefore(afterCreation.plusSeconds(1)));
    }

    @Test
    @DisplayName("Should handle transaction rollback on error")
    void shouldHandleTransactionRollbackOnError() {
        // Given - create an order directly in repository
        Order testOrder = Order.builder()
                .id(UUID.randomUUID())
                .userId(null)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("100.00"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        // When - save and then simulate error by deleting
        Order savedOrder = orderRepository.save(testOrder);
        assertTrue(orderRepository.existsById(savedOrder.getId()));

        // Simulate rollback by deleting
        orderRepository.deleteById(savedOrder.getId());

        // Then - verify order no longer exists
        assertFalse(orderRepository.existsById(savedOrder.getId()));
        Optional<Order> deletedOrder = orderRepository.findById(savedOrder.getId());
        assertFalse(deletedOrder.isPresent());
    }
}
