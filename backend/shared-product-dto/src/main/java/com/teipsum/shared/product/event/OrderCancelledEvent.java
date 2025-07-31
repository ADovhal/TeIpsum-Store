package com.teipsum.shared.product.event;

import java.util.List;

public record OrderCancelledEvent(
        String orderId,
        String userId,
        List<OrderLineItem> items
) {}
