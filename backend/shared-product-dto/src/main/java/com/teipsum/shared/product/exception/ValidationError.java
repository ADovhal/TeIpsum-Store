package com.teipsum.shared.product.exception;

public record ValidationError(
        String field,
        Object rejectedValue,
        String message
) {}