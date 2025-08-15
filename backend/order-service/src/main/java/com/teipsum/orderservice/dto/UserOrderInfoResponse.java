package com.teipsum.orderservice.dto;

/**
 * Response containing order information for a user (for deletion purposes)
 */
public record UserOrderInfoResponse(
        int orderCount,
        boolean hasActiveOrders
) {
}
