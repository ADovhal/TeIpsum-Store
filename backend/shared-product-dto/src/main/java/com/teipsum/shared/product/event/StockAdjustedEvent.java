package com.teipsum.shared.product.event;

public record StockAdjustedEvent(
        String productId,
        int newQuantity
) {}
