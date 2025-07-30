package com.teipsum.shared.product.event;

import java.util.List;

public record OrderCreatedEvent(
        String orderId,
        String userId,
        List<OrderLineItem> items
) {}
