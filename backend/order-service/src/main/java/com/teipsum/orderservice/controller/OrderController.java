package com.teipsum.orderservice.controller;

import com.teipsum.orderservice.dto.OrderRequest;
import com.teipsum.orderservice.dto.OrderResponse;
import com.teipsum.orderservice.model.Order;
import com.teipsum.orderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@RequestBody OrderRequest req,
                                @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        Order order = service.createOrder(userId, req);
        return OrderResponse.from(order);
    }

    @PostMapping("/guest")
    public OrderResponse createGuest(@RequestBody OrderRequest req) {
        return service.createOrder(null, req);
    }

    @GetMapping("/{id}")
    public OrderResponse get(@PathVariable UUID id,
                             @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        return OrderResponse.from(service.findByIdAndUserId(id, userId));
    }

    @GetMapping("/my")
    public List<OrderResponse> myOrders(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        return service.findAllByUser(userId)
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable UUID id,
                       @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        service.cancel(id, userId);
    }
}