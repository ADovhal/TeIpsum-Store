package com.teipsum.adminproductservice.exception;

public class EventDeliveryFailedException extends RuntimeException {
    public EventDeliveryFailedException(String message) {
        super(message);
    }
}