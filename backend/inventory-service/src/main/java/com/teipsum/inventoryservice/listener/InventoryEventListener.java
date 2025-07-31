package com.teipsum.inventoryservice.listener;

import com.teipsum.shared.product.event.*;
import com.teipsum.inventoryservice.repository.InventoryRepository;
import com.teipsum.inventoryservice.model.Inventory;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class InventoryEventListener {

    private final InventoryRepository repo;
    private final KafkaTemplate<String, Object> kafka;

    @KafkaListener(topics = "product-created")
    @Transactional
    public void onProductCreated(ProductCreatedEvent e) {
        if (!repo.existsById(e.id())) {
            repo.save(
                    Inventory.builder()
                            .productId(UUID.fromString(e.id()))
                            .quantity(0)
                            .build()
            );
        }
    }

    @KafkaListener(topics = "order-created")
    @Transactional
    public void onOrderCreated(OrderCreatedEvent e) {
        e.items().forEach(item -> {
            repo.findById(item.productId()).ifPresent(inv -> {
                inv.setQuantity(inv.getQuantity() - item.quantity());
                var newQty = inv.getQuantity();
                repo.save(inv);
                publishStockEvents(item.productId(), newQty);
            });
        });
    }

    @KafkaListener(topics = "order-cancelled")
    @Transactional
    public void onOrderCancelled(OrderCancelledEvent e) {
        e.items().forEach(item -> {
            repo.findById(item.productId()).ifPresent(inv -> {
                inv.setQuantity(inv.getQuantity() + item.quantity());
                var newQty = inv.getQuantity();
                repo.save(inv);
                publishStockEvents(item.productId(), newQty);
            });
        });
    }

    private void publishStockEvents(String productId, int newQty) {
        kafka.send("stock-adjusted", productId,
                new StockAdjustedEvent(productId, newQty));

        if (newQty == 0) {
            kafka.send("stock-depleted", productId,
                    new StockDepletedEvent(productId));
        }
    }
}