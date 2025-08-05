package com.teipsum.adminproductservice.event;

import com.teipsum.adminproductservice.exception.EventDeliveryFailedException;
import com.teipsum.adminproductservice.model.Product;
import com.teipsum.adminproductservice.exception.EventPublishingException;
import com.teipsum.shared.product.event.*;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.concurrent.ExecutionException;
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
public class ProductEventPublisher {
    private static final Logger logger = Logger.getLogger(ProductEventPublisher.class.getName());

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RetryTemplate retryTemplate;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publishProductCreated(Product product) {
        sendWithRetry(
                "product-created",
                product.getId().toString(),
                new ProductCreatedEvent(
                        product.getId().toString(),
                        product.getTitle(),
                        product.getDescription(),
                        product.getPrice(),
                        product.getDiscount(),
                        product.getCategory(),
                        product.getSubcategory(),
                        product.getGender(),
                        product.getImageUrls(),
                        product.getSizes(),
                        product.isAvailable()
                )
        );
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publishProductUpdated(Product product) {
        sendWithRetry(
                "product-updated",
                product.getId().toString(),
                new ProductUpdatedEvent(
                        product.getId().toString(),
                        product.getTitle(),
                        product.getDescription(),
                        product.getPrice(),
                        product.getDiscount(),
                        product.getCategory(),
                        product.getSubcategory(),
                        product.getGender(),
                        product.getImageUrls(),
                        product.getSizes(),
                        product.isAvailable()
                )
        );
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publishProductDeleted(Product product) {
        sendWithRetry(
                "product-deleted",
                product.getId().toString(),
                new ProductDeletedEvent(product.getId().toString())
        );
    }

    private void sendWithRetry(String topic, String key, Object event) {
        try {
            retryTemplate.execute(context -> {
                try {
                    var future = kafkaTemplate.send(topic, key, event);
                    future.get();
                    logger.info("Event sent to topic: " + topic + ", key: " + key);
                    return null;
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new EventPublishingException("Event sending interrupted", e);
                } catch (ExecutionException e) {
                    throw new EventPublishingException("Failed to send event to Kafka", e);
                }
            });
        } catch (EventPublishingException e) {
            logger.log(Level.SEVERE, "Critical failure after retries: " + e.getMessage());
            saveToDlq(topic, key, event, e);
            throw new EventDeliveryFailedException("Final attempt failed after retries");
        }
    }

    private void saveToDlq(String topic, String key, Object event, Exception e) {
        logger.log(Level.WARNING, "Saved to DLQ: " + topic + "/" + key);
    }
}