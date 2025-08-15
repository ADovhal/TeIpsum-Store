package com.teipsum.adminproductservice.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teipsum.adminproductservice.model.Product;
import com.teipsum.adminproductservice.repository.AdminProductRepository;
import com.teipsum.shared.product.dto.ProductRequest;
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
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("Admin Product Service Integration Tests")
class AdminProductServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AdminProductRepository productRepository;

    @MockBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
    }

    @Test
    @DisplayName("Should create product successfully with full integration")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldCreateProductSuccessfullyWithFullIntegration() throws Exception {
        // Given
        ProductRequest productRequest = new ProductRequest(
                "Integration Test Product",
                "Integration Test Description",
                new BigDecimal("199.99"),
                new BigDecimal("20.00"),
                ProductCategory.CLOTHING,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of("S", "M", "L", "XL"),
                true
        );

        MockMultipartFile productRequestFile = new MockMultipartFile(
                "product",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(productRequest)
        );

        MockMultipartFile imageFile = new MockMultipartFile(
                "images",
                "test-image.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .file(imageFile)
                        .with(csrf())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Integration Test Product"))
                .andExpect(jsonPath("$.price").value(199.99))
                .andExpect(jsonPath("$.discount").value(20.00))
                .andExpect(jsonPath("$.category").value("CLOTHING"))
                .andExpect(jsonPath("$.subcategory").value("T_SHIRTS"))
                .andExpect(jsonPath("$.gender").value("UNISEX"))
                .andExpect(jsonPath("$.available").value(true))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.sku").exists())
                .andExpect(jsonPath("$.createdAt").exists());

        // Verify product was saved in database
        List<Product> products = productRepository.findAll();
        assertEquals(1, products.size());
        Product savedProduct = products.get(0);
        assertEquals("Integration Test Product", savedProduct.getTitle());
        assertEquals(new BigDecimal("199.99"), savedProduct.getPrice());
        assertNotNull(savedProduct.getSku());
        assertNotNull(savedProduct.getId());
    }

    @Test
    @DisplayName("Should prevent duplicate product creation")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldPreventDuplicateProductCreation() throws Exception {
        // Given - create first product
        Product existingProduct = Product.builder()
                .title("Existing Product")
                .description("Existing Description")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.CLOTHING)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("M"))
                .available(true)
                .sku("EXISTING-001")
                .build();
        productRepository.save(existingProduct);

        ProductRequest duplicateRequest = new ProductRequest(
                "Existing Product", // Same title
                "Different Description",
                new BigDecimal("149.99"),
                new BigDecimal("10.00"),
                ProductCategory.CLOTHING,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of("L"),
                true
        );

        MockMultipartFile productRequestFile = new MockMultipartFile(
                "product",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(duplicateRequest)
        );

        // When & Then
        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .with(csrf())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").exists());

        // Verify only one product exists
        List<Product> products = productRepository.findAll();
        assertEquals(1, products.size());
    }

    @Test
    @DisplayName("Should update product successfully")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldUpdateProductSuccessfully() throws Exception {
        // Given - create existing product
        Product existingProduct = Product.builder()
                .title("Original Product")
                .description("Original Description")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.CLOTHING)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("M"))
                .available(true)
                .sku("ORIGINAL-001")
                .build();
        Product savedProduct = productRepository.save(existingProduct);

        ProductRequest updateRequest = new ProductRequest(
                "Updated Product",
                "Updated Description",
                new BigDecimal("149.99"),
                new BigDecimal("15.00"),
                ProductCategory.CLOTHING,
                ProductSubcategory.HOODIES,
                Gender.MALE,
                List.of("L", "XL"),
                false
        );

        MockMultipartFile productRequestFile = new MockMultipartFile(
                "product",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(updateRequest)
        );

        // When & Then
        mockMvc.perform(multipart("/api/admin/products/{id}", savedProduct.getId())
                        .file(productRequestFile)
                        .with(csrf())
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        })
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Product"))
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.price").value(149.99))
                .andExpect(jsonPath("$.discount").value(15.00))
                .andExpect(jsonPath("$.subcategory").value("HOODIES"))
                .andExpect(jsonPath("$.gender").value("MALE"))
                .andExpect(jsonPath("$.available").value(false));

        // Verify product was updated in database
        Optional<Product> updatedProductOpt = productRepository.findById(savedProduct.getId());
        assertTrue(updatedProductOpt.isPresent());
        Product updatedProduct = updatedProductOpt.get();
        assertEquals("Updated Product", updatedProduct.getTitle());
        assertEquals(new BigDecimal("149.99"), updatedProduct.getPrice());
        assertEquals(ProductSubcategory.HOODIES, updatedProduct.getSubcategory());
        assertEquals(Gender.MALE, updatedProduct.getGender());
        assertFalse(updatedProduct.isAvailable());
    }

    @Test
    @DisplayName("Should get product by id successfully")
    void shouldGetProductByIdSuccessfully() throws Exception {
        // Given - create existing product
        Product existingProduct = Product.builder()
                .title("Test Product")
                .description("Test Description")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("10.00"))
                .category(ProductCategory.CLOTHING)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("S", "M", "L"))
                .available(true)
                .sku("TEST-001")
                .build();
        Product savedProduct = productRepository.save(existingProduct);

        // When & Then
        mockMvc.perform(get("/api/admin/products/{id}", savedProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedProduct.getId().toString()))
                .andExpect(jsonPath("$.title").value("Test Product"))
                .andExpect(jsonPath("$.price").value(99.99))
                .andExpect(jsonPath("$.sku").value("TEST-001"));
    }

    @Test
    @DisplayName("Should return not found for non-existent product")
    void shouldReturnNotFoundForNonExistentProduct() throws Exception {
        // Given
        java.util.UUID nonExistentId = java.util.UUID.randomUUID();

        // When & Then
        mockMvc.perform(get("/api/admin/products/{id}", nonExistentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @DisplayName("Should get all products with pagination")
    void shouldGetAllProductsWithPagination() throws Exception {
        // Given - create multiple products
        for (int i = 1; i <= 15; i++) {
            Product product = Product.builder()
                    .title("Product " + i)
                    .description("Description " + i)
                    .price(new BigDecimal("99.99"))
                    .discount(new BigDecimal("0.00"))
                    .category(ProductCategory.CLOTHING)
                    .subcategory(ProductSubcategory.T_SHIRTS)
                    .gender(Gender.UNISEX)
                    .sizes(List.of("M"))
                    .available(true)
                    .sku("PRODUCT-" + String.format("%03d", i))
                    .build();
            productRepository.save(product);
        }

        // When & Then - first page
        mockMvc.perform(get("/api/admin/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(10))
                .andExpect(jsonPath("$.totalElements").value(15))
                .andExpect(jsonPath("$.totalPages").value(2))
                .andExpect(jsonPath("$.first").value(true))
                .andExpect(jsonPath("$.last").value(false));

        // When & Then - second page
        mockMvc.perform(get("/api/admin/products")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(5))
                .andExpect(jsonPath("$.totalElements").value(15))
                .andExpect(jsonPath("$.first").value(false))
                .andExpect(jsonPath("$.last").value(true));
    }

    @Test
    @DisplayName("Should filter products by category")
    void shouldFilterProductsByCategory() throws Exception {
        // Given - create products with different categories
        Product clothingProduct = Product.builder()
                .title("T-Shirt")
                .description("Cotton T-Shirt")
                .price(new BigDecimal("29.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.CLOTHING)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("M"))
                .available(true)
                .sku("TSHIRT-001")
                .build();

        Product accessoryProduct = Product.builder()
                .title("Hat")
                .description("Baseball Cap")
                .price(new BigDecimal("19.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.ACCESSORIES)
                .subcategory(ProductSubcategory.HATS)
                .gender(Gender.UNISEX)
                .sizes(List.of("ONE_SIZE"))
                .available(true)
                .sku("HAT-001")
                .build();

        productRepository.save(clothingProduct);
        productRepository.save(accessoryProduct);

        // When & Then - filter by CLOTHING category
        mockMvc.perform(get("/api/admin/products")
                        .param("category", "CLOTHING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].title").value("T-Shirt"))
                .andExpect(jsonPath("$.content[0].category").value("CLOTHING"));
    }

    @Test
    @DisplayName("Should delete product successfully")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void shouldDeleteProductSuccessfully() throws Exception {
        // Given - create existing product
        Product existingProduct = Product.builder()
                .title("Product to Delete")
                .description("This product will be deleted")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.CLOTHING)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("M"))
                .available(true)
                .sku("DELETE-001")
                .build();
        Product savedProduct = productRepository.save(existingProduct);

        // Verify product exists before deletion
        assertTrue(productRepository.existsById(savedProduct.getId()));

        // When & Then
        mockMvc.perform(delete("/api/admin/products/{id}", savedProduct.getId())
                        .with(csrf()))
                .andExpect(status().isNoContent());

        // Verify product was deleted from database
        assertFalse(productRepository.existsById(savedProduct.getId()));
    }

    @Test
    @DisplayName("Should require admin role for create operations")
    @WithMockUser(authorities = {"ROLE_USER"})
    void shouldRequireAdminRoleForCreateOperations() throws Exception {
        // Given
        ProductRequest productRequest = new ProductRequest(
                "Test Product",
                "Test Description",
                new BigDecimal("99.99"),
                new BigDecimal("0.00"),
                ProductCategory.CLOTHING,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of("M"),
                true
        );

        MockMultipartFile productRequestFile = new MockMultipartFile(
                "product",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(productRequest)
        );

        // When & Then
        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .with(csrf())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isForbidden());

        // Verify no product was created
        assertEquals(0, productRepository.count());
    }

    @Test
    @DisplayName("Should require admin role for delete operations")
    @WithMockUser(authorities = {"ROLE_USER"})
    void shouldRequireAdminRoleForDeleteOperations() throws Exception {
        // Given - create existing product
        Product existingProduct = Product.builder()
                .title("Protected Product")
                .description("This product should not be deletable by regular user")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.CLOTHING)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("M"))
                .available(true)
                .sku("PROTECTED-001")
                .build();
        Product savedProduct = productRepository.save(existingProduct);

        // When & Then
        mockMvc.perform(delete("/api/admin/products/{id}", savedProduct.getId())
                        .with(csrf()))
                .andExpect(status().isForbidden());

        // Verify product still exists
        assertTrue(productRepository.existsById(savedProduct.getId()));
    }
}
