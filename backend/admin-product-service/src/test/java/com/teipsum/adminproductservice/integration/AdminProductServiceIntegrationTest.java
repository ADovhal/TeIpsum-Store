package com.teipsum.adminproductservice.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teipsum.adminproductservice.event.ProductEventPublisher;
import com.teipsum.adminproductservice.model.Product;
import com.teipsum.adminproductservice.repository.AdminProductRepository;
import com.teipsum.shared.exceptions.handler.GlobalExceptionHandler;
import com.teipsum.shared.product.dto.ProductRequest;
import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@Import(GlobalExceptionHandler.class)
@EmbeddedKafka(partitions = 1, brokerProperties = { "listeners=PLAINTEXT://localhost:9092", "port=9092" })
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
@DisplayName("Admin Product Service Integration Tests")
class AdminProductServiceIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AdminProductRepository productRepository;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @MockitoBean
    private ProductEventPublisher productEventPublisher;

    @BeforeEach
    void setUp() {
        when(jwtDecoder.decode(anyString())).thenReturn(
                Jwt.withTokenValue("token")
                        .header("alg", "none")
                        .claim("sub", "admin")
                        .claim("roles", List.of("ROLE_ADMIN"))
                        .build()
        );

        doNothing().when(productEventPublisher).publishProductCreated(any());
        doNothing().when(productEventPublisher).publishProductUpdated(any());
        doNothing().when(productEventPublisher).publishProductDeleted(any());
    }

    @Test
    @DisplayName("Should create product successfully with full integration")
    @WithMockUser(roles = "ADMIN")
    void shouldCreateProductSuccessfullyWithFullIntegration() throws Exception {
        ProductRequest productRequest = new ProductRequest(
                "Integration Test Product",
                "Integration Test Description",
                new BigDecimal("199.99"),
                new BigDecimal("20.00"),
                ProductCategory.TOPS,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of(),
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

        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .file(imageFile)
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Integration Test Product"))
                .andExpect(jsonPath("$.price").value(199.99))
                .andExpect(jsonPath("$.discount").value(20.00))
                .andExpect(jsonPath("$.category").value("TOPS"))
                .andExpect(jsonPath("$.subcategory").value("T_SHIRTS"))
                .andExpect(jsonPath("$.gender").value("UNISEX"))
                .andExpect(jsonPath("$.available").value(true))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.sku").exists());

        List<Product> products = productRepository.findAll();
        assertEquals(1, products.size());
        Product savedProduct = products.get(0);
        assertEquals("Integration Test Product", savedProduct.getTitle());
        assertEquals(new BigDecimal("199.99"), savedProduct.getPrice());
    }

    @Test
    @DisplayName("Should prevent duplicate product creation")
    @WithMockUser(roles = "ADMIN")
    void shouldPreventDuplicateProductCreation() throws Exception {
        Product existingProduct = Product.builder()
                .title("Existing Product")
                .description("Existing Description")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.TOPS)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("M"))
                .available(true)
                .sku("EXISTING-001")
                .build();
        productRepository.save(existingProduct);

        ProductRequest duplicateRequest = new ProductRequest(
                "Existing Product",
                "Different Description",
                new BigDecimal("149.99"),
                new BigDecimal("10.00"),
                ProductCategory.TOPS,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of(),
                List.of("L"),
                true
        );

        MockMultipartFile productRequestFile = new MockMultipartFile(
                "product",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(duplicateRequest)
        );

        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .with(csrf()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").exists());

        assertEquals(1, productRepository.count());
    }

    @Test
    @DisplayName("Should update product successfully")
    @WithMockUser(roles = "ADMIN")
    void shouldUpdateProductSuccessfully() throws Exception {
        Product existingProduct = Product.builder()
                .title("Original Product")
                .description("Original Description")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.TOPS)
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
                ProductCategory.TOPS,
                ProductSubcategory.HOODIES,
                Gender.MEN,
                List.of(),
                List.of("L", "XL"),
                false
        );

        MockMultipartFile productRequestFile = new MockMultipartFile(
                "product",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(updateRequest)
        );

        mockMvc.perform(multipart("/api/admin/products/{id}", savedProduct.getId())
                        .file(productRequestFile)
                        .with(csrf())
                        .with(req -> { req.setMethod("PUT"); return req; }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Product"))
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.price").value(149.99))
                .andExpect(jsonPath("$.discount").value(15.00))
                .andExpect(jsonPath("$.subcategory").value("HOODIES"))
                .andExpect(jsonPath("$.gender").value("MEN"))
                .andExpect(jsonPath("$.available").value(false));

        Product updatedProduct = productRepository.findById(savedProduct.getId()).orElseThrow();
        assertEquals("Updated Product", updatedProduct.getTitle());
        assertEquals(ProductSubcategory.HOODIES, updatedProduct.getSubcategory());
        assertEquals(Gender.MEN, updatedProduct.getGender());
        assertFalse(updatedProduct.isAvailable());
    }

    @Test
    @DisplayName("Should get product by id successfully")
    @WithMockUser(roles = "ADMIN")
    void shouldGetProductByIdSuccessfully() throws Exception {
        Product existingProduct = Product.builder()
                .title("Test Product")
                .description("Test Description")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("10.00"))
                .category(ProductCategory.TOPS)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("S", "M", "L"))
                .available(true)
                .sku("TEST-001")
                .build();
        Product savedProduct = productRepository.save(existingProduct);

        mockMvc.perform(get("/api/admin/products/{id}", savedProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedProduct.getId().toString()))
                .andExpect(jsonPath("$.title").value("Test Product"))
                .andExpect(jsonPath("$.price").value(99.99))
                .andExpect(jsonPath("$.sku").value("TEST-001"));
    }

    @Test
    @DisplayName("Should return not found for non-existent product")
    @WithMockUser(roles = "ADMIN")
    void shouldReturnNotFoundForNonExistentProduct() throws Exception {
        java.util.UUID nonExistentId = java.util.UUID.randomUUID();

        mockMvc.perform(get("/api/admin/products/{id}", nonExistentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @DisplayName("Should get all products with pagination")
    @WithMockUser(roles = "ADMIN")
    void shouldGetAllProductsWithPagination() throws Exception {
        for (int i = 1; i <= 15; i++) {
            Product product = Product.builder()
                    .title("Product " + i)
                    .description("Description " + i)
                    .price(new BigDecimal("99.99"))
                    .discount(new BigDecimal("0.00"))
                    .category(ProductCategory.TOPS)
                    .subcategory(ProductSubcategory.T_SHIRTS)
                    .gender(Gender.UNISEX)
                    .sizes(List.of("M"))
                    .available(true)
                    .sku("PRODUCT-" + String.format("%03d", i))
                    .build();
            productRepository.save(product);
        }

        mockMvc.perform(get("/api/admin/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(10))
                .andExpect(jsonPath("$.totalElements").value(15))
                .andExpect(jsonPath("$.totalPages").value(2))
                .andExpect(jsonPath("$.first").value(true))
                .andExpect(jsonPath("$.last").value(false));

        mockMvc.perform(get("/api/admin/products")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(5))
                .andExpect(jsonPath("$.totalElements").value(15))
                .andExpect(jsonPath("$.first").value(false))
                .andExpect(jsonPath("$.last").value(true));
    }

    @Test
    @DisplayName("Should filter products by category")
    @WithMockUser(roles = "ADMIN")
    void shouldFilterProductsByCategory() throws Exception {
        Product tshirt = Product.builder()
                .title("T-Shirt")
                .description("Cotton T-Shirt")
                .price(new BigDecimal("29.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.TOPS)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("M"))
                .available(true)
                .sku("TSHIRT-001")
                .build();

        Product hat = Product.builder()
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

        productRepository.save(tshirt);
        productRepository.save(hat);

        mockMvc.perform(get("/api/admin/products")
                        .param("category", "TOPS"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].title").value("T-Shirt"))
                .andExpect(jsonPath("$.content[0].category").value("TOPS"));
    }

    @Test
    @DisplayName("Should delete product successfully")
    @WithMockUser(roles = "ADMIN")
    void shouldDeleteProductSuccessfully() throws Exception {
        Product existingProduct = Product.builder()
                .title("Product to Delete")
                .description("This product will be deleted")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.TOPS)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("M"))
                .available(true)
                .sku("DELETE-001")
                .build();
        Product savedProduct = productRepository.save(existingProduct);

        assertTrue(productRepository.existsById(savedProduct.getId()));

        mockMvc.perform(delete("/api/admin/products/{id}", savedProduct.getId())
                        .with(csrf()))
                .andExpect(status().isNoContent());

        assertFalse(productRepository.existsById(savedProduct.getId()));
    }

    @Test
    @DisplayName("Should require admin role for create operations")
    @WithMockUser(roles = "ADMIN")
    void shouldRequireAdminRoleForCreateOperations() throws Exception {
        ProductRequest productRequest = new ProductRequest(
                "Test Product",
                "Test Description",
                new BigDecimal("99.99"),
                new BigDecimal("0.00"),
                ProductCategory.TOPS,
                ProductSubcategory.T_SHIRTS,
                Gender.UNISEX,
                List.of(),
                List.of("M"),
                true
        );

        MockMultipartFile productRequestFile = new MockMultipartFile(
                "product",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(productRequest)
        );

        mockMvc.perform(multipart("/api/admin/products")
                        .file(productRequestFile)
                        .with(csrf()))
                .andExpect(status().isForbidden());

        assertEquals(0, productRepository.count());
    }

    @Test
    @DisplayName("Should require admin role for delete operations")
    @WithMockUser(roles = "USER")
    void shouldRequireAdminRoleForDeleteOperations() throws Exception {
        Product existingProduct = Product.builder()
                .title("Protected Product")
                .description("This product should not be deletable by regular user")
                .price(new BigDecimal("99.99"))
                .discount(new BigDecimal("0.00"))
                .category(ProductCategory.TOPS)
                .subcategory(ProductSubcategory.T_SHIRTS)
                .gender(Gender.UNISEX)
                .sizes(List.of("M"))
                .available(true)
                .sku("PROTECTED-001")
                .build();
        Product savedProduct = productRepository.save(existingProduct);

        mockMvc.perform(delete("/api/admin/products/{id}", savedProduct.getId())
                        .with(csrf()))
                .andExpect(status().isForbidden());

        assertTrue(productRepository.existsById(savedProduct.getId()));
    }
}

