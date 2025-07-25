package com.teipsum.shared.exceptions;

import java.util.UUID;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String id) {
        super("Product not found with id: " + id);
    }

    public ProductNotFoundException(UUID id) {
        this(id.toString());
    }

    public ProductNotFoundException(String id, String serviceType) {
        super(String.format("Product not found with ID '%s' in %s service", id, serviceType));
    }
}