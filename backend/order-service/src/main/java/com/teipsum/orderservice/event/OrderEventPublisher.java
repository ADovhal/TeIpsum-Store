package com.teipsum.orderservice.event;

import com.teipsum.orderservice.model.Order;
import com.teipsum.shared.product.event.OrderCreatedEvent;
import com.teipsum.shared.product.event.OrderLineItem;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderEventPublisher {

    private final KafkaTemplate<String, Object> kafka;

    public void publishOrderCreated(Order order) {
        var items = order.getItems().stream()
                .map(i -> new OrderLineItem(
                        i.getProductId(),
                        i.getQuantity(),
                        i.getPriceSnapshot()))
                .toList();

        kafka.send("order-created", order.getId().toString(),
                new OrderCreatedEvent(order.getId().toString(), order.getUserId().toString(), items));
    }
}