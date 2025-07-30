package com.teipsum.shared.product.event;

import java.math.BigDecimal;

public record OrderLineItem(
        String productId,
        int quantity,
        BigDecimal price
) {}
