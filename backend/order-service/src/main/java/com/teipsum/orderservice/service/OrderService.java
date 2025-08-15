package com.teipsum.orderservice.service;

import com.teipsum.orderservice.dto.OrderRequest;
import com.teipsum.orderservice.model.Order;
import com.teipsum.orderservice.model.OrderItem;
import com.teipsum.orderservice.model.OrderStatus;
import com.teipsum.orderservice.event.OrderEventPublisher;
import com.teipsum.orderservice.repository.OrderRepository;
import com.teipsum.shared.exceptions.NotFoundException;
import com.teipsum.shared.exceptions.ConflictException;
import com.teipsum.shared.product.event.OrderCreatedEvent;
import com.teipsum.shared.product.event.OrderLineItem;
import com.teipsum.orderservice.dto.UserOrderInfoResponse;
import com.teipsum.shared.event.UserOrdersAnonymizedEvent;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    
        private static final Logger logger = LogManager.getLogger(OrderService.class);

        private final OrderRepository repo;
        private final OrderEventPublisher publisher;
        private final KafkaTemplate<String, Object> kafkaTemplate;

        @Transactional
        public Order createOrder(UUID userId, OrderRequest req) {
                BigDecimal total = req.items().stream()
                        .map(i -> i.priceSnapshot().multiply(BigDecimal.valueOf(i.quantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                Order order = Order.builder()
                        .id(UUID.randomUUID())
                        .userId(userId)
                        .status(OrderStatus.PENDING)
                        .totalAmount(total)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build();

                order.setItems(req.items().stream()
                        .map(i -> OrderItem.builder()
                                .id(UUID.randomUUID())
                                .order(order)
                                .productId(i.productId())
                                .quantity(i.quantity())
                                .priceSnapshot(i.priceSnapshot())
                                .build())
                        .toList());

                repo.save(order);

                publisher.publishOrderCreated(order);
                return order;
        }

        @Transactional
        public void cancel(UUID orderId, UUID userId) {
                Order order = repo.findByIdAndUserId(orderId, userId)
                        .orElseThrow(() -> new NotFoundException("Order not found"));
                if (order.getStatus() != OrderStatus.PENDING) {
                    throw new ConflictException("Order cannot be cancelled");
                }
                order.setStatus(OrderStatus.CANCELLED);
                order.setUpdatedAt(Instant.now());
                repo.save(order);
        
                publisher.publishOrderCancelled(order);
        }

        public Order findByIdAndUserId(UUID id, UUID userId) {
                return repo.findByIdAndUserId(id, userId)
                        .orElseThrow(() -> new NotFoundException("Order not found"));
        }

        public List<Order> findAllByUser(UUID userId) {
                return repo.findAllByUserIdOrderByCreatedAtDesc(userId);
        }

        /**
         * Gets order information for a user (for deletion purposes)
         */
        @Transactional(readOnly = true)
        public UserOrderInfoResponse getUserOrderInfo(UUID userId) {
            List<Order> userOrders = repo.findAllByUserIdOrderByCreatedAtDesc(userId);
            
            boolean hasActiveOrders = userOrders.stream()
                    .anyMatch(order -> order.getStatus() == OrderStatus.PENDING || 
                                     order.getStatus() == OrderStatus.PROCESSING);
            
            return new UserOrderInfoResponse(userOrders.size(), hasActiveOrders);
        }

        /**
         * Anonymizes all orders for a user instead of deleting them
         * This preserves business data while removing personal information
         */
        @Transactional
        public void anonymizeUserOrders(UUID userId, String userEmail) {
            List<Order> userOrders = repo.findAllByUserIdOrderByCreatedAtDesc(userId);
            
            if (userOrders.isEmpty()) {
                logger.info("No orders found for user: {}", userId);
                // Still publish event to complete the deletion process
                publishAnonymizationEvent(userId, userEmail, 0);
                return;
            }

            logger.info("Anonymizing {} orders for user: {}", userOrders.size(), userId);

            // Set userId to null to anonymize orders
            // Orders remain in the system for business analytics but are no longer linked to the user
            userOrders.forEach(order -> {
                order.setUserId(null);
                // Update timestamp to track when anonymization occurred
                order.setUpdatedAt(Instant.now());
            });

            // Save all anonymized orders
            repo.saveAll(userOrders);
            
            logger.info("Successfully anonymized {} orders for user: {}", userOrders.size(), userId);

            // Publish event to notify that orders are anonymized
            publishAnonymizationEvent(userId, userEmail, userOrders.size());
        }

        private void publishAnonymizationEvent(UUID userId, String userEmail, int orderCount) {
            UserOrdersAnonymizedEvent event = new UserOrdersAnonymizedEvent(
                    userId.toString(),
                    userEmail,
                    orderCount,
                    LocalDateTime.now()
            );

            kafkaTemplate.send("user-orders-anonymized", userId.toString(), event);
            logger.info("Published user orders anonymized event for user: {} with {} orders", userId, orderCount);
        }
}