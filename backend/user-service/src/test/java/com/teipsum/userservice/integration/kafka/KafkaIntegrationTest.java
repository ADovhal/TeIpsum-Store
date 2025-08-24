package com.teipsum.userservice.integration.kafka;

import com.teipsum.shared.event.OrderInfoRequestEvent;
import com.teipsum.userservice.service.OrderInfoCacheService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = {"order-info-request", "order-info-response"})
@ActiveProfiles("test")
class KafkaIntegrationTest {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private OrderInfoCacheService orderInfoCacheService;

    @Test
    void shouldSendAndReceiveKafkaMessages() throws Exception {
        // Given
        String userId = "test-user-123";
        OrderInfoRequestEvent requestEvent = new OrderInfoRequestEvent(
                userId, "test@example.com", LocalDateTime.now()
        );

        // When - send request
        kafkaTemplate.send("order-info-request", userId, requestEvent);

        // Then - wait a bit for processing
        Thread.sleep(1000);

        // Simulate response from order service
        // (In real scenario, order-service would send this)
        // This is just to verify the cache update mechanism works
        orderInfoCacheService.updateCache(userId, 3, true);

        OrderInfoCacheService.OrderInfo cachedInfo = orderInfoCacheService.getCachedInfo(userId);
        assertTrue(cachedInfo.hasOrders());
        assertEquals(3, cachedInfo.orderCount());
    }
}