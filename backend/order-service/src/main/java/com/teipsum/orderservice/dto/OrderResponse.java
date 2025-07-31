package com.teipsum.orderservice.dto;

import com.teipsum.orderservice.model.Order;
import com.teipsum.shared.product.event.OrderLineItem;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        UUID userId,
        String status,
        BigDecimal totalAmount,
        List<OrderLineItem> items,
        Instant createdAt
) {
    public static OrderResponse from(Order o) {
        List<OrderLineItem> list = o.getItems().stream()
                .map(i -> new OrderLineItem(i.getProductId(), i.getQuantity(), i.getPriceSnapshot()))
                .toList();
        return new OrderResponse(o.getId(), o.getUserId(), o.getStatus().name(),
                o.getTotalAmount(), list, o.getCreatedAt());
    }
}
