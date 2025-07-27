package com.teipsum.adminproductservice.exception;

public class ProductAlreadyExistsException extends RuntimeException {
    public ProductAlreadyExistsException(String title) {
        super("Product with title '" + title + "' already exists");
    }
}