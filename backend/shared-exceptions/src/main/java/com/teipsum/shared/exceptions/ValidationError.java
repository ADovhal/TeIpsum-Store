package com.teipsum.shared.exceptions;

public record ValidationError(
        String field,
        Object rejectedValue,
        String message
) {}