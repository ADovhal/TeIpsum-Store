package com.teipsum.shared.product.event;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record OrderLineItem(
        @NotBlank String productId,
        @Min(1) int quantity,
        BigDecimal priceSnapshot
) {}
