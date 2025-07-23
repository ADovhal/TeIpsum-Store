package com.teipsum.shared.product.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String message,
        String path,
        List<ValidationError> errors
) {
    public ErrorResponse(LocalDateTime timestamp, int status, String message, String path) {
        this(timestamp, status, message, path, null);
    }
}