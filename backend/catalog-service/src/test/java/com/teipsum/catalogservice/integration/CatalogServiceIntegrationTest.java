package com.teipsum.catalogservice.integration;

import com.teipsum.catalogservice.model.CatalogProduct;
import com.teipsum.catalogservice.repository.CatalogProductRepository;
import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("Catalog Service Integration Tests")
class CatalogServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private CatalogProductRepository catalogProductRepository;

    @MockBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .build();
    }

    @Test
    @DisplayName("Should get all products with full integration")
    void shouldGetAllProductsWithFullIntegration() throws Exception {
        // Given - create test products
        CatalogProduct product1 = createTestProduct("Product 1", ProductCategory.CLOTHING, new BigDecimal("99.99"));
        CatalogProduct product2 = createTestProduct("Product 2", ProductCategory.ACCESSORIES, new BigDecimal("49.99"));
        
        catalogProductRepository.save(product1);
        catalogProductRepository.save(product2);

        // When & Then
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList").isArray())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList.length()").value(2))
                .andExpect(jsonPath("$.page.totalElements").value(2))
                .andExpect(jsonPath("$.page.totalPages").value(1))
                .andExpect(jsonPath("$.page.size").value(10))
                .andExpect(jsonPath("$.page.number").value(0));

        // Verify products exist in database
        List<CatalogProduct> products = catalogProductRepository.findAll();
        assertEquals(2, products.size());
    }

    @Test
    @DisplayName("Should get product by id with full integration")
    void shouldGetProductByIdWithFullIntegration() throws Exception {
        // Given - create and save test product
        CatalogProduct testProduct = createTestProduct("Integration Test Product", 
                ProductCategory.CLOTHING, new BigDecimal("199.99"));
        CatalogProduct savedProduct = catalogProductRepository.save(testProduct);

        // When & Then
        mockMvc.perform(get("/api/products/{id}", savedProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedProduct.getId().toString()))
                .andExpect(jsonPath("$.title").value("Integration Test Product"))
                .andExpect(jsonPath("$.price").value(199.99))
                .andExpect(jsonPath("$.category").value("CLOTHING"))
                .andExpect(jsonPath("$.subcategory").value("T_SHIRTS"))
                .andExpect(jsonPath("$.gender").value("UNISEX"))
                .andExpect(jsonPath("$.available").value(true))
                .andExpect(jsonPath("$.imageUrls").isArray())
                .andExpect(jsonPath("$.sizes").isArray());

        // Verify product exists in database
        assertTrue(catalogProductRepository.existsById(savedProduct.getId()));
    }

    @Test
    @DisplayName("Should return not found for non-existent product")
    void shouldReturnNotFoundForNonExistentProduct() throws Exception {
        // Given
        UUID nonExistentId = UUID.randomUUID();

        // When & Then
        mockMvc.perform(get("/api/products/{id}", nonExistentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());

        // Verify product doesn't exist in database
        assertFalse(catalogProductRepository.existsById(nonExistentId));
    }

    @Test
    @DisplayName("Should filter products by category")
    void shouldFilterProductsByCategory() throws Exception {
        // Given - create products with different categories
        CatalogProduct clothingProduct = createTestProduct("T-Shirt", 
                ProductCategory.CLOTHING, new BigDecimal("29.99"));
        CatalogProduct accessoryProduct = createTestProduct("Hat", 
                ProductCategory.ACCESSORIES, new BigDecimal("19.99"));

        catalogProductRepository.save(clothingProduct);
        catalogProductRepository.save(accessoryProduct);

        // When & Then - filter by CLOTHING category
        mockMvc.perform(get("/api/products")
                        .param("category", "CLOTHING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList").isArray())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList.length()").value(1))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].title").value("T-Shirt"))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].category").value("CLOTHING"));

        // When & Then - filter by ACCESSORIES category
        mockMvc.perform(get("/api/products")
                        .param("category", "ACCESSORIES"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList").isArray())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList.length()").value(1))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].title").value("Hat"))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].category").value("ACCESSORIES"));
    }

    @Test
    @DisplayName("Should filter products by price range")
    void shouldFilterProductsByPriceRange() throws Exception {
        // Given - create products with different prices
        CatalogProduct cheapProduct = createTestProduct("Cheap Product", 
                ProductCategory.CLOTHING, new BigDecimal("25.00"));
        CatalogProduct expensiveProduct = createTestProduct("Expensive Product", 
                ProductCategory.CLOTHING, new BigDecimal("150.00"));
        CatalogProduct midRangeProduct = createTestProduct("Mid Range Product", 
                ProductCategory.CLOTHING, new BigDecimal("75.00"));

        catalogProductRepository.save(cheapProduct);
        catalogProductRepository.save(expensiveProduct);
        catalogProductRepository.save(midRangeProduct);

        // When & Then - filter by price range 50-100
        mockMvc.perform(get("/api/products")
                        .param("minPrice", "50")
                        .param("maxPrice", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList").isArray())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList.length()").value(1))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].title").value("Mid Range Product"));
    }

    @Test
    @DisplayName("Should filter products by availability")
    void shouldFilterProductsByAvailability() throws Exception {
        // Given - create products with different availability
        CatalogProduct availableProduct = CatalogProduct.builder()
                .id(UUID.randomUUID())
                .title("Available Product")
                .description("This product is available")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.CLOTHING)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .imageUrls(List.of())
                .sizes(List.of("M"))
                .available(true)
                .build();

        CatalogProduct unavailableProduct = CatalogProduct.builder()
                .id(UUID.randomUUID())
                .title("Unavailable Product")
                .description("This product is not available")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.CLOTHING)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .imageUrls(List.of())
                .sizes(List.of("M"))
                .available(false)
                .build();

        catalogProductRepository.save(availableProduct);
        catalogProductRepository.save(unavailableProduct);

        // When & Then - filter by available products only
        mockMvc.perform(get("/api/products")
                        .param("available", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList").isArray())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList.length()").value(1))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].title").value("Available Product"))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].available").value(true));
    }

    @Test
    @DisplayName("Should handle pagination correctly")
    void shouldHandlePaginationCorrectly() throws Exception {
        // Given - create multiple products
        for (int i = 1; i <= 25; i++) {
            CatalogProduct product = createTestProduct("Product " + i, 
                    ProductCategory.CLOTHING, new BigDecimal("99.99"));
            catalogProductRepository.save(product);
        }

        // When & Then - first page
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList").isArray())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList.length()").value(10))
                .andExpect(jsonPath("$.page.totalElements").value(25))
                .andExpect(jsonPath("$.page.totalPages").value(3))
                .andExpect(jsonPath("$.page.number").value(0))
                .andExpect(jsonPath("$.page.first").value(true))
                .andExpect(jsonPath("$.page.last").value(false));

        // When & Then - second page
        mockMvc.perform(get("/api/products")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList.length()").value(10))
                .andExpect(jsonPath("$.page.number").value(1))
                .andExpect(jsonPath("$.page.first").value(false))
                .andExpect(jsonPath("$.page.last").value(false));

        // When & Then - last page
        mockMvc.perform(get("/api/products")
                        .param("page", "2")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList.length()").value(5))
                .andExpect(jsonPath("$.page.number").value(2))
                .andExpect(jsonPath("$.page.first").value(false))
                .andExpect(jsonPath("$.page.last").value(true));
    }

    @Test
    @DisplayName("Should handle sorting correctly")
    void shouldHandleSortingCorrectly() throws Exception {
        // Given - create products with different prices and titles
        CatalogProduct productA = createTestProduct("A Product", 
                ProductCategory.CLOTHING, new BigDecimal("150.00"));
        CatalogProduct productB = createTestProduct("B Product", 
                ProductCategory.CLOTHING, new BigDecimal("100.00"));
        CatalogProduct productC = createTestProduct("C Product", 
                ProductCategory.CLOTHING, new BigDecimal("200.00"));

        catalogProductRepository.save(productA);
        catalogProductRepository.save(productB);
        catalogProductRepository.save(productC);

        // When & Then - sort by price ascending
        mockMvc.perform(get("/api/products")
                        .param("sort", "price,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList").isArray())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].price").value(100.00))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[1].price").value(150.00))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[2].price").value(200.00));

        // When & Then - sort by title descending
        mockMvc.perform(get("/api/products")
                        .param("sort", "title,desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].title").value("C Product"))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[1].title").value("B Product"))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[2].title").value("A Product"));
    }

    @Test
    @DisplayName("Should handle complex filtering with multiple criteria")
    void shouldHandleComplexFilteringWithMultipleCriteria() throws Exception {
        // Given - create products with various attributes
        CatalogProduct matchingProduct = CatalogProduct.builder()
                .id(UUID.randomUUID())
                .title("Perfect Match")
                .description("This matches all criteria")
                .price(new BigDecimal("75.00"))
                .discount(new BigDecimal("5.00"))
                .category(ProductCategory.CLOTHING)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .imageUrls(List.of("url1"))
                .sizes(List.of("M", "L"))
                .available(true)
                .build();

        CatalogProduct nonMatchingProduct = CatalogProduct.builder()
                .id(UUID.randomUUID())
                .title("No Match")
                .description("This doesn't match")
                .price(new BigDecimal("150.00"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.ACCESSORIES)
                .subcategory(ProductSubcategory.HATS)
                .gender(Gender.FEMALE)
                .imageUrls(List.of())
                .sizes(List.of("ONE_SIZE"))
                .available(false)
                .build();

        catalogProductRepository.save(matchingProduct);
        catalogProductRepository.save(nonMatchingProduct);

        // When & Then - apply multiple filters
        mockMvc.perform(get("/api/products")
                        .param("category", "CLOTHING")
                        .param("subcategory", "T_SHIRTS")
                        .param("gender", "UNISEX")
                        .param("minPrice", "50")
                        .param("maxPrice", "100")
                        .param("available", "true")
                        .param("sizes", "M"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList").isArray())
                .andExpect(jsonPath("$._embedded.catalogProductDTOList.length()").value(1))
                .andExpect(jsonPath("$._embedded.catalogProductDTOList[0].title").value("Perfect Match"));
    }

    @Test
    @DisplayName("Should return empty result when no products match filters")
    void shouldReturnEmptyResultWhenNoProductsMatchFilters() throws Exception {
        // Given - create a product that won't match the filter
        CatalogProduct product = createTestProduct("Test Product", 
                ProductCategory.CLOTHING, new BigDecimal("99.99"));
        catalogProductRepository.save(product);

        // When & Then - apply filter that won't match
        mockMvc.perform(get("/api/products")
                        .param("category", "ACCESSORIES")
                        .param("minPrice", "200"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements").value(0))
                .andExpect(jsonPath("$._embedded").doesNotExist());
    }

    private CatalogProduct createTestProduct(String title, ProductCategory category, BigDecimal price) {
        return CatalogProduct.builder()
                .id(UUID.randomUUID())
                .title(title)
                .description("Test description for " + title)
                .price(price)
                .discount(new BigDecimal("0.00"))
                .category(category)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .imageUrls(List.of("test-url1", "test-url2"))
                .sizes(List.of("S", "M", "L"))
                .available(true)
                .build();
    }
}
