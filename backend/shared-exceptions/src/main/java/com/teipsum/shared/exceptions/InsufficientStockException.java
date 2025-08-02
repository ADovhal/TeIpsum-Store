package com.teipsum.shared.exceptions;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String productId, int requested, int available) {
        super("Insufficient stock for product %s: requested=%d, available=%d"
                .formatted(productId, requested, available));
    }
}