package com.teipsum.orderservice.dto;

import com.teipsum.shared.product.event.OrderLineItem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderRequest(
        @NotEmpty List<@Valid OrderLineItem> items
) {}