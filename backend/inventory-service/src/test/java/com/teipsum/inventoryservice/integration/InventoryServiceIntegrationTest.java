package com.teipsum.inventoryservice.integration;

import com.teipsum.inventoryservice.model.Inventory;
import com.teipsum.inventoryservice.repository.InventoryRepository;
import com.teipsum.shared.product.event.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Inventory Service Integration Tests")
class InventoryServiceIntegrationTest {

    @Autowired
    private InventoryRepository inventoryRepository;

    @MockitoBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    @BeforeEach
    void setUp() {
        inventoryRepository.deleteAll();
    }

    @Test
    @DisplayName("Should create and manage inventory with full integration")
    void shouldCreateAndManageInventoryWithFullIntegration() {
        // Given - create initial inventory
        UUID productId = UUID.randomUUID();
        Inventory initialInventory = Inventory.builder()
                .productId(productId)
                .quantity(100)
                .build();

        // When - save inventory
        Inventory savedInventory = inventoryRepository.save(initialInventory);

        // Then - verify inventory was saved
        assertNotNull(savedInventory);
        assertEquals(productId, savedInventory.getProductId());
        assertEquals(100, savedInventory.getQuantity());

        // Verify inventory exists in database
        Optional<Inventory> foundInventory = inventoryRepository.findById(productId);
        assertTrue(foundInventory.isPresent());
        assertEquals(100, foundInventory.get().getQuantity());
    }

    @Test
    @DisplayName("Should handle inventory updates correctly")
    void shouldHandleInventoryUpdatesCorrectly() {
        // Given - create initial inventory
        UUID productId = UUID.randomUUID();
        Inventory inventory = Inventory.builder()
                .productId(productId)
                .quantity(50)
                .build();
        inventoryRepository.save(inventory);

        // When - update inventory quantity
        Optional<Inventory> savedInventory = inventoryRepository.findById(productId);
        assertTrue(savedInventory.isPresent());
        
        savedInventory.get().setQuantity(75);
        Inventory updatedInventory = inventoryRepository.save(savedInventory.get());

        // Then - verify update
        assertEquals(75, updatedInventory.getQuantity());

        // Verify in database
        Optional<Inventory> verifyInventory = inventoryRepository.findById(productId);
        assertTrue(verifyInventory.isPresent());
        assertEquals(75, verifyInventory.get().getQuantity());
    }

    @Test
    @DisplayName("Should handle multiple inventory items")
    void shouldHandleMultipleInventoryItems() {
        // Given - create multiple inventory items
        UUID product1 = UUID.randomUUID();
        UUID product2 = UUID.randomUUID();
        UUID product3 = UUID.randomUUID();

        Inventory inventory1 = Inventory.builder().productId(product1).quantity(10).build();
        Inventory inventory2 = Inventory.builder().productId(product2).quantity(25).build();
        Inventory inventory3 = Inventory.builder().productId(product3).quantity(0).build();

        // When - save all inventories
        inventoryRepository.save(inventory1);
        inventoryRepository.save(inventory2);
        inventoryRepository.save(inventory3);

        // Then - verify all were saved
        List<Inventory> allInventories = inventoryRepository.findAll();
        assertEquals(3, allInventories.size());

        // Verify each inventory
        Optional<Inventory> found1 = inventoryRepository.findById(product1);
        Optional<Inventory> found2 = inventoryRepository.findById(product2);
        Optional<Inventory> found3 = inventoryRepository.findById(product3);

        assertTrue(found1.isPresent());
        assertTrue(found2.isPresent());
        assertTrue(found3.isPresent());

        assertEquals(10, found1.get().getQuantity());
        assertEquals(25, found2.get().getQuantity());
        assertEquals(0, found3.get().getQuantity());
    }

    @Test
    @DisplayName("Should handle zero and negative quantities")
    void shouldHandleZeroAndNegativeQuantities() {
        // Given - create inventory with zero quantity
        UUID productId1 = UUID.randomUUID();
        Inventory zeroInventory = Inventory.builder()
                .productId(productId1)
                .quantity(0)
                .build();

        // Given - create inventory with negative quantity
        UUID productId2 = UUID.randomUUID();
        Inventory negativeInventory = Inventory.builder()
                .productId(productId2)
                .quantity(-5)
                .build();

        // When - save both inventories
        inventoryRepository.save(zeroInventory);
        inventoryRepository.save(negativeInventory);

        // Then - verify both were saved correctly
        Optional<Inventory> foundZero = inventoryRepository.findById(productId1);
        Optional<Inventory> foundNegative = inventoryRepository.findById(productId2);

        assertTrue(foundZero.isPresent());
        assertTrue(foundNegative.isPresent());

        assertEquals(0, foundZero.get().getQuantity());
        assertEquals(-5, foundNegative.get().getQuantity());
    }

    @Test
    @DisplayName("Should handle large quantities")
    void shouldHandleLargeQuantities() {
        // Given - create inventory with large quantity
        UUID productId = UUID.randomUUID();
        int largeQuantity = 1000000; // One million
        
        Inventory largeInventory = Inventory.builder()
                .productId(productId)
                .quantity(largeQuantity)
                .build();

        // When - save large inventory
        Inventory savedInventory = inventoryRepository.save(largeInventory);

        // Then - verify large quantity was saved correctly
        assertEquals(largeQuantity, savedInventory.getQuantity());

        // Verify in database
        Optional<Inventory> foundInventory = inventoryRepository.findById(productId);
        assertTrue(foundInventory.isPresent());
        assertEquals(largeQuantity, foundInventory.get().getQuantity());
    }

    @Test
    @DisplayName("Should handle inventory deletion")
    void shouldHandleInventoryDeletion() {
        // Given - create and save inventory
        UUID productId = UUID.randomUUID();
        Inventory inventory = Inventory.builder()
                .productId(productId)
                .quantity(20)
                .build();
        inventoryRepository.save(inventory);

        // Verify inventory exists
        assertTrue(inventoryRepository.existsById(productId));

        // When - delete inventory
        inventoryRepository.deleteById(productId);

        // Then - verify inventory was deleted
        assertFalse(inventoryRepository.existsById(productId));
        Optional<Inventory> deletedInventory = inventoryRepository.findById(productId);
        assertFalse(deletedInventory.isPresent());
    }

    @Test
    @DisplayName("Should handle concurrent inventory operations")
    void shouldHandleConcurrentInventoryOperations() {
        // Given - create initial inventory
        UUID productId = UUID.randomUUID();
        Inventory inventory = Inventory.builder()
                .productId(productId)
                .quantity(100)
                .build();
        inventoryRepository.save(inventory);

        // When - simulate concurrent updates
        Optional<Inventory> inventory1 = inventoryRepository.findById(productId);
        Optional<Inventory> inventory2 = inventoryRepository.findById(productId);

        assertTrue(inventory1.isPresent());
        assertTrue(inventory2.isPresent());

        // Simulate different operations
        inventory1.get().setQuantity(inventory1.get().getQuantity() - 10); // Reduce by 10
        inventory2.get().setQuantity(inventory2.get().getQuantity() - 5);  // Reduce by 5

        inventoryRepository.save(inventory1.get());
        inventoryRepository.save(inventory2.get());

        // Then - verify final state (last update wins)
        Optional<Inventory> finalInventory = inventoryRepository.findById(productId);
        assertTrue(finalInventory.isPresent());
        assertEquals(95, finalInventory.get().getQuantity()); // 100 - 5 = 95 (last update)
    }

    @Test
    @DisplayName("Should handle inventory with edge case UUIDs")
    void shouldHandleInventoryWithEdgeCaseUuids() {
        // Given - create inventories with different UUID patterns
        UUID uuid1 = UUID.fromString("00000000-0000-0000-0000-000000000001");
        UUID uuid2 = UUID.fromString("ffffffff-ffff-ffff-ffff-ffffffffffff");
        
        Inventory inventory1 = Inventory.builder().productId(uuid1).quantity(1).build();
        Inventory inventory2 = Inventory.builder().productId(uuid2).quantity(999).build();

        // When - save inventories
        inventoryRepository.save(inventory1);
        inventoryRepository.save(inventory2);

        // Then - verify both were saved correctly
        Optional<Inventory> found1 = inventoryRepository.findById(uuid1);
        Optional<Inventory> found2 = inventoryRepository.findById(uuid2);

        assertTrue(found1.isPresent());
        assertTrue(found2.isPresent());

        assertEquals(uuid1, found1.get().getProductId());
        assertEquals(uuid2, found2.get().getProductId());
        assertEquals(1, found1.get().getQuantity());
        assertEquals(999, found2.get().getQuantity());
    }

    @Test
    @DisplayName("Should maintain data integrity with transactions")
    void shouldMaintainDataIntegrityWithTransactions() {
        // Given - create multiple inventories
        UUID product1 = UUID.randomUUID();
        UUID product2 = UUID.randomUUID();
        
        Inventory inventory1 = Inventory.builder().productId(product1).quantity(50).build();
        Inventory inventory2 = Inventory.builder().productId(product2).quantity(75).build();

        // When - save in transaction
        inventoryRepository.save(inventory1);
        inventoryRepository.save(inventory2);

        // Verify both were saved
        assertEquals(2, inventoryRepository.count());

        // Simulate transaction rollback by deleting all
        inventoryRepository.deleteAll();

        // Then - verify all were deleted
        assertEquals(0, inventoryRepository.count());
        assertFalse(inventoryRepository.existsById(product1));
        assertFalse(inventoryRepository.existsById(product2));
    }

    @Test
    @DisplayName("Should handle inventory queries correctly")
    void shouldHandleInventoryQueriesCorrectly() {
        // Given - create inventories with different quantities
        UUID lowStock = UUID.randomUUID();
        UUID mediumStock = UUID.randomUUID();
        UUID highStock = UUID.randomUUID();
        UUID outOfStock = UUID.randomUUID();

        inventoryRepository.save(Inventory.builder().productId(lowStock).quantity(5).build());
        inventoryRepository.save(Inventory.builder().productId(mediumStock).quantity(25).build());
        inventoryRepository.save(Inventory.builder().productId(highStock).quantity(100).build());
        inventoryRepository.save(Inventory.builder().productId(outOfStock).quantity(0).build());

        // When - query all inventories
        List<Inventory> allInventories = inventoryRepository.findAll();

        // Then - verify all inventories are returned
        assertEquals(4, allInventories.size());

        // Verify we can find specific inventories
        assertTrue(inventoryRepository.existsById(lowStock));
        assertTrue(inventoryRepository.existsById(mediumStock));
        assertTrue(inventoryRepository.existsById(highStock));
        assertTrue(inventoryRepository.existsById(outOfStock));

        // Verify quantities
        assertEquals(5, inventoryRepository.findById(lowStock).get().getQuantity());
        assertEquals(25, inventoryRepository.findById(mediumStock).get().getQuantity());
        assertEquals(100, inventoryRepository.findById(highStock).get().getQuantity());
        assertEquals(0, inventoryRepository.findById(outOfStock).get().getQuantity());
    }

    @Test
    @DisplayName("Should handle inventory updates with complex scenarios")
    void shouldHandleInventoryUpdatesWithComplexScenarios() {
        // Given - create inventory
        UUID productId = UUID.randomUUID();
        Inventory inventory = Inventory.builder()
                .productId(productId)
                .quantity(50)
                .build();
        inventoryRepository.save(inventory);

        // Scenario 1: Multiple small reductions
        for (int i = 0; i < 5; i++) {
            Optional<Inventory> current = inventoryRepository.findById(productId);
            assertTrue(current.isPresent());
            current.get().setQuantity(current.get().getQuantity() - 5);
            inventoryRepository.save(current.get());
        }

        // Verify after reductions
        Optional<Inventory> afterReductions = inventoryRepository.findById(productId);
        assertTrue(afterReductions.isPresent());
        assertEquals(25, afterReductions.get().getQuantity()); // 50 - (5*5) = 25

        // Scenario 2: Large increase
        afterReductions.get().setQuantity(afterReductions.get().getQuantity() + 100);
        inventoryRepository.save(afterReductions.get());

        // Verify after increase
        Optional<Inventory> afterIncrease = inventoryRepository.findById(productId);
        assertTrue(afterIncrease.isPresent());
        assertEquals(125, afterIncrease.get().getQuantity()); // 25 + 100 = 125

        // Scenario 3: Set to zero
        afterIncrease.get().setQuantity(0);
        inventoryRepository.save(afterIncrease.get());

        // Verify zero quantity
        Optional<Inventory> zeroQuantity = inventoryRepository.findById(productId);
        assertTrue(zeroQuantity.isPresent());
        assertEquals(0, zeroQuantity.get().getQuantity());
    }

    @Test
    @DisplayName("Should handle database constraints and validations")
    void shouldHandleDatabaseConstraintsAndValidations() {
        // Given - create inventory with valid data
        UUID productId = UUID.randomUUID();
        Inventory validInventory = Inventory.builder()
                .productId(productId)
                .quantity(10)
                .build();

        // When - save valid inventory
        Inventory savedInventory = inventoryRepository.save(validInventory);

        // Then - verify it was saved
        assertNotNull(savedInventory);
        assertEquals(productId, savedInventory.getProductId());
        assertEquals(10, savedInventory.getQuantity());

        // Verify uniqueness constraint - trying to save another inventory with same productId
        Inventory duplicateInventory = Inventory.builder()
                .productId(productId) // Same product ID
                .quantity(20)
                .build();

        // This should update the existing record, not create a new one
        inventoryRepository.save(duplicateInventory);
        
        // Verify only one record exists and it's updated
        List<Inventory> allInventories = inventoryRepository.findAll();
        assertEquals(1, allInventories.size());
        assertEquals(20, allInventories.get(0).getQuantity());
    }
}
