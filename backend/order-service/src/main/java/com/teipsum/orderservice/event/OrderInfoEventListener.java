// OrderInfoEventListener.java в order-service
package com.teipsum.orderservice.event;

import com.teipsum.orderservice.service.OrderService;
import com.teipsum.shared.event.OrderInfoRequestEvent;
import com.teipsum.shared.event.OrderInfoResponseEvent;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OrderInfoEventListener {

    private static final Logger logger = LogManager.getLogger(OrderInfoEventListener.class);

    private final OrderService orderService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(
            topics = "order-info-request",
            groupId = "order-service-group"
    )
    @Transactional(readOnly = true)
    public void handleOrderInfoRequest(OrderInfoRequestEvent event) {
        try {
            UUID userId = UUID.fromString(event.userId());
            logger.debug("Processing order info request for user: {}", userId);

            // Получаем информацию о заказах
            var orderInfo = orderService.getUserOrderInfo(userId);

            // Отправляем ответ
            OrderInfoResponseEvent response = new OrderInfoResponseEvent(
                    event.userId(),
                    event.email(),
                    orderInfo.orderCount(),
                    orderInfo.hasActiveOrders(),
                    java.time.LocalDateTime.now()
            );

            kafkaTemplate.send("order-info-response", event.userId(), response)
                    .thenAccept(result ->
                            logger.debug("Order info response sent for user: {}", userId))
                    .exceptionally(ex -> {
                        logger.warn("Failed to send order info response for user {}: {}",
                                userId, ex.getMessage());
                        return null;
                    });

        } catch (Exception e) {
            logger.error("Error processing order info request for user {}: {}",
                    event.userId(), e.getMessage());
        }
    }
}