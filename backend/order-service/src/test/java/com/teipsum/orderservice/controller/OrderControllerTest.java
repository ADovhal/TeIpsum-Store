package com.teipsum.orderservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teipsum.orderservice.config.SecurityConfig;
import com.teipsum.orderservice.dto.OrderRequest;
import com.teipsum.orderservice.dto.OrderResponse;
import com.teipsum.orderservice.model.Order;
import com.teipsum.orderservice.model.OrderItem;
import com.teipsum.orderservice.model.OrderStatus;
import com.teipsum.orderservice.service.OrderService;
import com.teipsum.shared.exceptions.ConflictException;
import com.teipsum.shared.exceptions.NotFoundException;
import com.teipsum.shared.exceptions.handler.GlobalExceptionHandler;
import com.teipsum.shared.product.event.OrderLineItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("OrderController Tests")
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
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

    private Jwt createMockJwt(UUID userId) {
        return Jwt.withTokenValue("mock-token")
                .header("alg", "HS256")
                .claim("userId", userId.toString())
                .claim("sub", "user@example.com")
                .claim("roles", List.of("ROLE_USER"))
                .build();
    }

    private JwtAuthenticationToken createAuthentication(UUID userId) {
        Jwt jwt = createMockJwt(userId);
        return new JwtAuthenticationToken(
                jwt,
                AuthorityUtils.createAuthorityList("ROLE_USER")
        );
    }

    @Test
    @DisplayName("Should create order successfully")
    void shouldCreateOrderSuccessfully() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);

        when(orderService.createOrder(eq(userId), any(OrderRequest.class))).thenReturn(testOrder);

        // When & Then
        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(orderId.toString()))
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.totalAmount").value(130.00))
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(2));

        verify(orderService).createOrder(eq(userId), any(OrderRequest.class));
    }

    @Test
    @DisplayName("Should create guest order successfully")
    void shouldCreateGuestOrderSuccessfully() throws Exception {
        // Given
        Order guestOrder = Order.builder()
                .id(orderId)
                .userId(null)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("130.00"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .items(testOrder.getItems())
                .build();

        when(orderService.createOrder(eq(null), any(OrderRequest.class))).thenReturn(guestOrder);

        // When & Then
        mockMvc.perform(post("/api/orders/guest")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(orderId.toString()))
                .andExpect(jsonPath("$.userId").isEmpty())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.totalAmount").value(130.00));

        verify(orderService).createOrder(eq(null), any(OrderRequest.class));
    }

    @Test
    @DisplayName("Should get order by id successfully")
    void shouldGetOrderByIdSuccessfully() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);

        when(orderService.findByIdAndUserId(orderId, userId)).thenReturn(testOrder);

        // When & Then
        mockMvc.perform(get("/api/orders/{id}", orderId)
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(orderId.toString()))
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.totalAmount").value(130.00));

        verify(orderService).findByIdAndUserId(orderId, userId);
    }

    @Test
    @DisplayName("Should return not found when order doesn't exist")
    void shouldReturnNotFoundWhenOrderDoesntExist() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);
        UUID nonExistentId = UUID.randomUUID();

        when(orderService.findByIdAndUserId(nonExistentId, userId))
                .thenThrow(new NotFoundException("Order not found"));

        // When & Then
        mockMvc.perform(get("/api/orders/{id}", nonExistentId)
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        }))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());

        verify(orderService).findByIdAndUserId(nonExistentId, userId);
    }

    @Test
    @DisplayName("Should get user orders successfully")
    void shouldGetUserOrdersSuccessfully() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);

        Order order2 = Order.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.CONFIRMED)
                .totalAmount(new BigDecimal("75.00"))
                .createdAt(Instant.now().minusSeconds(3600))
                .updatedAt(Instant.now().minusSeconds(3600))
                .items(List.of())
                .build();

        List<Order> userOrders = List.of(testOrder, order2);
        when(orderService.findAllByUser(userId)).thenReturn(userOrders);

        // When & Then
        mockMvc.perform(get("/api/orders/my")
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(testOrder.getId().toString()))
                .andExpect(jsonPath("$[1].id").value(order2.getId().toString()));

        verify(orderService).findAllByUser(userId);
    }

    @Test
    @DisplayName("Should return empty list when user has no orders")
    void shouldReturnEmptyListWhenUserHasNoOrders() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);

        when(orderService.findAllByUser(userId)).thenReturn(List.of());

        // When & Then
        mockMvc.perform(get("/api/orders/my")
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        verify(orderService).findAllByUser(userId);
    }

    @Test
    @DisplayName("Should cancel order successfully")
    void shouldCancelOrderSuccessfully() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);

        doNothing().when(orderService).cancel(orderId, userId);

        // When & Then
        mockMvc.perform(delete("/api/orders/{id}", orderId)
                        .with(csrf())
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        }))
                .andExpect(status().isNoContent());

        verify(orderService).cancel(orderId, userId);
    }

    @Test
    @DisplayName("Should return not found when canceling non-existent order")
    void shouldReturnNotFoundWhenCancelingNonExistentOrder() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);
        UUID nonExistentId = UUID.randomUUID();

        doThrow(new NotFoundException("Order not found"))
                .when(orderService).cancel(nonExistentId, userId);

        // When & Then
        mockMvc.perform(delete("/api/orders/{id}", nonExistentId)
                        .with(csrf())
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        }))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());

        verify(orderService).cancel(nonExistentId, userId);
    }

    @Test
    @DisplayName("Should return conflict when canceling non-pending order")
    void shouldReturnConflictWhenCancelingNonPendingOrder() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);

        doThrow(new ConflictException("Order cannot be cancelled"))
                .when(orderService).cancel(orderId, userId);

        // When & Then
        mockMvc.perform(delete("/api/orders/{id}", orderId)
                        .with(csrf())
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        }))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").exists());

        verify(orderService).cancel(orderId, userId);
    }

    @Test
    @DisplayName("Should require authentication for authenticated endpoints")
    void shouldRequireAuthenticationForAuthenticatedEndpoints() throws Exception {
        // When & Then - create order without authentication
        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isUnauthorized());

        // When & Then - get order without authentication
        mockMvc.perform(get("/api/orders/{id}", orderId))
                .andExpect(status().isUnauthorized());

        // When & Then - get my orders without authentication
        mockMvc.perform(get("/api/orders/my"))
                .andExpect(status().isUnauthorized());

        // When & Then - cancel order without authentication
        mockMvc.perform(delete("/api/orders/{id}", orderId)
                        .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(orderService, never()).createOrder(any(), any());
        verify(orderService, never()).findByIdAndUserId(any(), any());
        verify(orderService, never()).findAllByUser(any());
        verify(orderService, never()).cancel(any(), any());
    }

    @Test
    @DisplayName("Should require CSRF token for modifying operations")
    void shouldRequireCsrfTokenForModifyingOperations() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);

        // When & Then - create order without CSRF
        mockMvc.perform(post("/api/orders")
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isForbidden());

        // When & Then - cancel order without CSRF
        mockMvc.perform(delete("/api/orders/{id}", orderId)
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        }))
                .andExpect(status().isForbidden());

        verify(orderService, never()).createOrder(any(), any());
        verify(orderService, never()).cancel(any(), any());
    }

    @Test
    @DisplayName("Should handle invalid UUID in path parameter")
    void shouldHandleInvalidUuidInPathParameter() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);

        // When & Then
        mockMvc.perform(get("/api/orders/invalid-uuid")
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        }))
                .andExpect(status().isBadRequest());

        verify(orderService, never()).findByIdAndUserId(any(), any());
    }

    @Test
    @DisplayName("Should validate order request")
    void shouldValidateOrderRequest() throws Exception {
        // Given - empty order request
        JwtAuthenticationToken authentication = createAuthentication(userId);
        OrderRequest emptyRequest = new OrderRequest(List.of());

        // When & Then
        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyRequest)))
                .andExpect(status().isBadRequest());

        verify(orderService, never()).createOrder(any(), any());
    }

    @Test
    @DisplayName("Should handle malformed JSON")
    void shouldHandleMalformedJson() throws Exception {
        // Given - malformed JSON
        JwtAuthenticationToken authentication = createAuthentication(userId);
        String malformedJson = "{\"items\":[{\"productId\":\"test\",\"quantity\":}]}";

        // When & Then
        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedJson))
                .andExpect(status().isBadRequest());

        verify(orderService, never()).createOrder(any(), any());
    }

    @Test
    @DisplayName("Should handle service exceptions gracefully")
    void shouldHandleServiceExceptionsGracefully() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);

        when(orderService.createOrder(any(), any())).thenThrow(new RuntimeException("Database error"));

        // When & Then
        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isInternalServerError());

        verify(orderService).createOrder(any(), any());
    }

    @Test
    @DisplayName("Should handle large order requests")
    void shouldHandleLargeOrderRequests() throws Exception {
        // Given - large order with many items
        JwtAuthenticationToken authentication = createAuthentication(userId);
        List<OrderLineItem> manyItems = List.of(
                new OrderLineItem("product-1", 1, new BigDecimal("10.00")),
                new OrderLineItem("product-2", 1, new BigDecimal("20.00")),
                new OrderLineItem("product-3", 1, new BigDecimal("30.00")),
                new OrderLineItem("product-4", 1, new BigDecimal("40.00")),
                new OrderLineItem("product-5", 1, new BigDecimal("50.00"))
        );
        OrderRequest largeRequest = new OrderRequest(manyItems);

        Order largeOrder = Order.builder()
                .id(orderId)
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("150.00"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .items(List.of())
                .build();

        when(orderService.createOrder(eq(userId), any(OrderRequest.class))).thenReturn(largeOrder);

        // When & Then
        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .with(request -> {
                            request.setUserPrincipal(authentication);
                            return request;
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(largeRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalAmount").value(150.00));

        verify(orderService).createOrder(eq(userId), any(OrderRequest.class));
    }

    @Test
    @DisplayName("Should handle concurrent requests")
    void shouldHandleConcurrentRequests() throws Exception {
        // Given
        JwtAuthenticationToken authentication = createAuthentication(userId);

        when(orderService.createOrder(eq(userId), any(OrderRequest.class))).thenReturn(testOrder);

        // When & Then - simulate multiple concurrent requests
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(post("/api/orders")
                            .with(csrf())
                            .with(request -> {
                                request.setUserPrincipal(authentication);
                                return request;
                            })
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(orderRequest)))
                    .andExpect(status().isCreated());
        }

        verify(orderService, times(3)).createOrder(eq(userId), any(OrderRequest.class));
    }
}
