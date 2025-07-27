package com.teipsum.catalogservice.event;

import com.teipsum.catalogservice.service.CatalogService;
import com.teipsum.shared.product.event.*;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductEventListener {

    private final CatalogService catalogService;

    @KafkaListener(topics = "product-created",
            groupId = "catalog-service-group"
    )
    public void handleProductCreated(ProductCreatedEvent event) {
        catalogService.addProduct(event);
    }

    @KafkaListener(topics = "product-updated", groupId = "catalog-service-group")
    public void handleProductUpdated(ProductUpdatedEvent event) {
        catalogService.updateProduct(event);
    }

    @KafkaListener(topics = "product-deleted", groupId = "catalog-service-group")
    public void handleProductDeleted(ProductDeletedEvent event) {
        catalogService.deleteProduct(event);
    }
}