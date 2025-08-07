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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Create a new order",
        description = "Creates a new order for the authenticated user",
        responses = {
            @ApiResponse(
                responseCode = "201",
                description = "Order created successfully",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = OrderResponse.class)
                )
            ),
            @ApiResponse(
                responseCode = "400",
                description = "Invalid input",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
    public OrderResponse create(@RequestBody OrderRequest req,
                                @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        Order order = service.createOrder(userId, req);
        return OrderResponse.from(order);
    }

    @PostMapping("/guest")
    @Operation(
        summary = "Create a new guest order",
        description = "Creates a new order without authentication",
        responses = {
            @ApiResponse(
                responseCode = "201",
                description = "Order created successfully",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = OrderResponse.class)
                )
            ),
            @ApiResponse(
                responseCode = "400",
                description = "Invalid input",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
    public OrderResponse createGuest(@RequestBody OrderRequest req) {
        return OrderResponse.from(service.createOrder(null, req));
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get order by ID",
        description = "Retrieves an order by its unique ID for the authenticated user",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Order found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = OrderResponse.class)
                )
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Order not found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
    public OrderResponse get(@PathVariable UUID id,
                             @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        return OrderResponse.from(service.findByIdAndUserId(id, userId));
    }

    @GetMapping("/my")
    @Operation(
        summary = "Get all orders for the authenticated user",
        description = "Retrieves a list of orders for the authenticated user",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Orders found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = List.class)
                )
            )
        }
    )
    public List<OrderResponse> myOrders(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        return service.findAllByUser(userId)
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Cancel an order by ID",
        description = "Cancels an order by its unique ID for the authenticated user",
        responses = {
            @ApiResponse(
                responseCode = "204",
                description = "Order canceled successfully"
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Order not found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
    public void cancel(@PathVariable UUID id,
                       @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        service.cancel(id, userId);
    }
}