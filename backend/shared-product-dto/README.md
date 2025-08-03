# Shared Product DTO - TeIpsum E-Commerce Platform

## 📦 Overview

The Shared Product DTO module contains product-specific Data Transfer Objects and event structures used across product-related microservices. This module ensures consistent product data representation and event handling between Admin Product Service and Catalog Service.

## 🎯 Core Features

### 📋 Product Data Structures
- **Product DTOs**: Comprehensive product data transfer objects
- **Filter DTOs**: Product filtering and search request structures
- **Event DTOs**: Product lifecycle event definitions
- **Specification Builders**: Dynamic query building utilities

### 📡 Product Events
- **Creation Events**: Product creation event structures
- **Update Events**: Product modification events
- **Deletion Events**: Product removal events
- **Availability Events**: Stock and availability changes

### 🔍 Advanced Filtering
- **Filter Specifications**: JPA Specification builders for complex queries
- **Search Utilities**: Full-text search helpers
- **Sorting Options**: Standardized product sorting options

## 🛠️ Technology Stack

- **Java**: 17 with records and modern features
- **Spring Data JPA**: Specification API for dynamic queries
- **Jakarta Validation**: Product data validation
- **Jackson**: JSON serialization for events

## 📁 Module Structure

```
shared-product-dto/
├── src/main/java/com/teipsum/shared/product/
│   ├── dto/
│   │   ├── ProductDto.java
│   │   ├── ProductDetailDto.java
│   │   ├── ProductFilterRequest.java
│   │   ├── ProductSortOption.java
│   │   └── CategoryDto.java
│   ├── event/
│   │   ├── ProductCreatedEvent.java
│   │   ├── ProductUpdatedEvent.java
│   │   ├── ProductDeletedEvent.java
│   │   └── ProductAvailabilityEvent.java
│   ├── filter/
│   │   ├── ProductSpecifications.java
│   │   ├── SearchSpecifications.java
│   │   └── FilterBuilder.java
│   ├── enums/
│   │   ├── ProductCategory.java
│   │   ├── ProductGender.java
│   │   ├── ProductStatus.java
│   │   └── SortDirection.java
│   └── validation/
│       ├── ProductValidation.java
│       └── CategoryValidation.java
└── pom.xml
```

## 🔧 Core DTOs

### Product Data Transfer Object
```java
public record ProductDto(
    @NotNull UUID id,
    @NotBlank @Size(max = 255) String title,
    @Size(max = 2000) String description,
    @NotNull @DecimalMin("0.01") BigDecimal price,
    @Min(0) @Max(100) Integer discount,
    @NotNull ProductCategory category,
    String subcategory,
    @NotNull ProductGender gender,
    @NotEmpty List<@URL String> imageUrls,
    @NotNull Boolean available,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
```

### Product Filter Request
```java
public record ProductFilterRequest(
    ProductCategory category,
    String subcategory,
    ProductGender gender,
    @DecimalMin("0") BigDecimal minPrice,
    @DecimalMin("0") BigDecimal maxPrice,
    @Size(max = 100) String searchTerm,
    Boolean available,
    ProductSortOption sortBy,
    SortDirection sortDirection
) {
    public static ProductFilterRequest empty() {
        return new ProductFilterRequest(null, null, null, null, null, null, null, null, null);
    }
}
```

### Product Detail DTO (Extended)
```java
public record ProductDetailDto(
    UUID id,
    String title,
    String description,
    BigDecimal price,
    Integer discount,
    BigDecimal discountedPrice,
    ProductCategory category,
    String subcategory,
    ProductGender gender,
    List<String> imageUrls,
    Boolean available,
    Integer stockLevel,
    List<String> tags,
    Map<String, String> attributes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public BigDecimal getDiscountedPrice() {
        if (discount != null && discount > 0) {
            BigDecimal discountAmount = price.multiply(BigDecimal.valueOf(discount))
                                           .divide(BigDecimal.valueOf(100));
            return price.subtract(discountAmount);
        }
        return price;
    }
}
```

## 📡 Product Events

### Product Creation Event
```java
public record ProductCreatedEvent(
    String id,
    String title,
    String description,
    BigDecimal price,
    Integer discount,
    String category,
    String subcategory,
    String gender,
    List<String> imageUrls,
    Boolean available,
    LocalDateTime timestamp
) implements ProductEvent {
    
    public ProductCreatedEvent {
        Objects.requireNonNull(id, "Product ID cannot be null");
        Objects.requireNonNull(title, "Product title cannot be null");
        Objects.requireNonNull(price, "Product price cannot be null");
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
```

### Product Update Event
```java
public record ProductUpdatedEvent(
    String id,
    String title,
    String description,
    BigDecimal price,
    Integer discount,
    String category,
    String subcategory,
    String gender,
    List<String> imageUrls,
    Boolean available,
    Map<String, Object> changedFields,
    LocalDateTime timestamp
) implements ProductEvent {}
```

### Product Availability Event
```java
public record ProductAvailabilityEvent(
    String productId,
    Boolean available,
    Integer stockLevel,
    String reason,
    LocalDateTime timestamp
) implements ProductEvent {}
```

## 🔍 Dynamic Filtering

### Product Specifications
```java
public class ProductSpecifications {
    
    public static Specification<Product> hasCategory(ProductCategory category) {
        return (root, query, criteriaBuilder) -> 
            category == null ? null : criteriaBuilder.equal(root.get("category"), category);
    }
    
    public static Specification<Product> hasGender(ProductGender gender) {
        return (root, query, criteriaBuilder) -> 
            gender == null ? null : criteriaBuilder.equal(root.get("gender"), gender);
    }
    
    public static Specification<Product> priceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null) return null;
            
            Path<BigDecimal> pricePath = root.get("price");
            
            if (minPrice == null) {
                return criteriaBuilder.lessThanOrEqualTo(pricePath, maxPrice);
            }
            if (maxPrice == null) {
                return criteriaBuilder.greaterThanOrEqualTo(pricePath, minPrice);
            }
            return criteriaBuilder.between(pricePath, minPrice, maxPrice);
        };
    }
    
    public static Specification<Product> searchInTitleAndDescription(String searchTerm) {
        return (root, query, criteriaBuilder) -> {
            if (searchTerm == null || searchTerm.trim().isEmpty()) {
                return null;
            }
            
            String pattern = "%" + searchTerm.toLowerCase() + "%";
            Predicate titleMatch = criteriaBuilder.like(
                criteriaBuilder.lower(root.get("title")), pattern);
            Predicate descMatch = criteriaBuilder.like(
                criteriaBuilder.lower(root.get("description")), pattern);
                
            return criteriaBuilder.or(titleMatch, descMatch);
        };
    }
    
    public static Specification<Product> isAvailable(Boolean available) {
        return (root, query, criteriaBuilder) -> 
            available == null ? null : criteriaBuilder.equal(root.get("available"), available);
    }
}
```

### Filter Builder Utility
```java
public class FilterBuilder {
    
    public static Specification<Product> buildSpecification(ProductFilterRequest filter) {
        return Specification.where(ProductSpecifications.hasCategory(filter.category()))
            .and(ProductSpecifications.hasGender(filter.gender()))
            .and(ProductSpecifications.priceBetween(filter.minPrice(), filter.maxPrice()))
            .and(ProductSpecifications.searchInTitleAndDescription(filter.searchTerm()))
            .and(ProductSpecifications.isAvailable(filter.available()));
    }
    
    public static Sort buildSort(ProductSortOption sortBy, SortDirection direction) {
        if (sortBy == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt"); // Default sort
        }
        
        Sort.Direction sortDirection = direction == SortDirection.DESC ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
            
        return switch (sortBy) {
            case PRICE -> Sort.by(sortDirection, "price");
            case NAME -> Sort.by(sortDirection, "title");
            case CREATED_DATE -> Sort.by(sortDirection, "createdAt");
            case POPULARITY -> Sort.by(sortDirection, "viewCount", "purchaseCount");
        };
    }
}
```

## 📊 Enumerations

### Product Categories
```java
public enum ProductCategory {
    CLOTHING("Clothing"),
    SHOES("Shoes"),
    ACCESSORIES("Accessories"),
    BAGS("Bags"),
    JEWELRY("Jewelry"),
    BEAUTY("Beauty"),
    HOME("Home & Living");

    private final String displayName;

    ProductCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
```

### Gender Targeting
```java
public enum ProductGender {
    MEN("Men"),
    WOMEN("Women"), 
    KIDS("Kids"),
    UNISEX("Unisex");

    private final String displayName;
    
    ProductGender(String displayName) {
        this.displayName = displayName;
    }
}
```

### Sort Options
```java
public enum ProductSortOption {
    PRICE("price"),
    NAME("name"),
    CREATED_DATE("created"),
    POPULARITY("popularity"),
    DISCOUNT("discount");

    private final String value;
    
    ProductSortOption(String value) {
        this.value = value;
    }
}
```

## ✅ Validation

### Product Validation Constraints
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ProductValidation.Validator.class)
public @interface ProductValidation {
    String message() default "Invalid product data";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    
    class Validator implements ConstraintValidator<ProductValidation, ProductDto> {
        @Override
        public boolean isValid(ProductDto product, ConstraintValidatorContext context) {
            if (product == null) return true;
            
            // Validate discount vs price
            if (product.discount() != null && product.discount() > 0) {
                BigDecimal discountAmount = product.price()
                    .multiply(BigDecimal.valueOf(product.discount()))
                    .divide(BigDecimal.valueOf(100));
                    
                if (discountAmount.compareTo(product.price()) >= 0) {
                    context.disableDefaultConstraintViolation();
                    context.buildConstraintViolationWithTemplate(
                        "Discount cannot be 100% or more of the price")
                        .addPropertyNode("discount")
                        .addConstraintViolation();
                    return false;
                }
            }
            
            // Validate image URLs
            if (product.imageUrls() != null && product.imageUrls().size() > 10) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                    "Maximum 10 images allowed per product")
                    .addPropertyNode("imageUrls")
                    .addConstraintViolation();
                return false;
            }
            
            return true;
        }
    }
}
```

## 🔧 Integration

### Maven Dependency
```xml
<dependency>
    <groupId>com.teipsum</groupId>
    <artifactId>teipsum-shared-product-dto</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Usage in Admin Product Service
```java
@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {
    
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(
            @Valid @RequestBody ProductDto productDto) {
        
        Product product = productService.createProduct(productDto);
        
        // Publish event
        ProductCreatedEvent event = new ProductCreatedEvent(
            product.getId().toString(),
            product.getTitle(),
            product.getDescription(),
            product.getPrice(),
            product.getDiscount(),
            product.getCategory().name(),
            product.getSubcategory(),
            product.getGender().name(),
            product.getImageUrls(),
            product.getAvailable(),
            LocalDateTime.now()
        );
        
        eventPublisher.publishEvent(event);
        return ResponseEntity.ok(ProductMapper.toDto(product));
    }
}
```

### Usage in Catalog Service
```java
@RestController
@RequestMapping("/api/products")
public class CatalogController {
    
    @GetMapping
    public ResponseEntity<Page<ProductDto>> getProducts(
            ProductFilterRequest filter,
            Pageable pageable) {
        
        Specification<Product> spec = FilterBuilder.buildSpecification(filter);
        Sort sort = FilterBuilder.buildSort(filter.sortBy(), filter.sortDirection());
        
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            sort
        );
        
        Page<Product> products = productRepository.findAll(spec, sortedPageable);
        Page<ProductDto> productDtos = products.map(ProductMapper::toDto);
        
        return ResponseEntity.ok(productDtos);
    }
}
```

## 🧪 Testing Support

### Test Data Builders
```java
public class ProductTestDataBuilder {
    
    public static ProductDto.Builder aProduct() {
        return ProductDto.builder()
            .id(UUID.randomUUID())
            .title("Test Product")
            .description("Test Description")
            .price(new BigDecimal("29.99"))
            .discount(10)
            .category(ProductCategory.CLOTHING)
            .subcategory("tops")
            .gender(ProductGender.WOMEN)
            .imageUrls(List.of("https://example.com/image.jpg"))
            .available(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now());
    }
    
    public static ProductFilterRequest.Builder aFilter() {
        return ProductFilterRequest.builder()
            .category(ProductCategory.CLOTHING)
            .gender(ProductGender.WOMEN)
            .available(true);
    }
}
```

---

**Shared Product Data Structures for TeIpsum Platform** 📦