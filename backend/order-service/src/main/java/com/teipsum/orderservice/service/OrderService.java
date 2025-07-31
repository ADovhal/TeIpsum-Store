package com.teipsum.orderservice.service;

import com.teipsum.orderservice.dto.OrderRequest;
import com.teipsum.orderservice.model.Order;
import com.teipsum.orderservice.model.OrderItem;
import com.teipsum.orderservice.model.OrderStatus;
import com.teipsum.orderservice.event.OrderEventPublisher;
import com.teipsum.orderservice.repository.OrderRepository;
import com.teipsum.shared.exceptions.NotFoundException;
import com.teipsum.shared.product.event.OrderCreatedEvent;
import com.teipsum.shared.product.event.OrderLineItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository repo;
        private final OrderEventPublisher publisher;

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
}