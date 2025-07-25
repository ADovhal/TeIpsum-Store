package com.teipsum.shared.exceptions;

public class InvalidSortPropertyException extends RuntimeException {
    public InvalidSortPropertyException(String property) {
        super("Invalid sort property: " + property);
    }
}