package com.teipsum.catalogservice.service;

import com.teipsum.catalogservice.exception.EventProcessingException;
import com.teipsum.catalogservice.exception.InvalidProductDataException;
import com.teipsum.catalogservice.model.CatalogProduct;
import com.teipsum.catalogservice.repository.CatalogProductRepository;
import com.teipsum.shared.product.dto.ProductFilterRequest;
import com.teipsum.shared.product.event.ProductCreatedEvent;
import com.teipsum.shared.product.event.ProductDeletedEvent;
import com.teipsum.shared.product.event.ProductUpdatedEvent;
import com.teipsum.catalogservice.event.ProductEventValidator;
import com.teipsum.shared.exceptions.ProductNotFoundException;
import com.teipsum.shared.product.filter.ProductSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final CatalogProductRepository catalogProductRepository;
    private final ProductEventValidator productEventValidator;
    private static final Logger logger = LogManager.getLogger(CatalogService.class);

    @Transactional
    public void addProduct(ProductCreatedEvent event) {
        CatalogProduct product = CatalogProduct.builder()
                .id(UUID.fromString(event.id()))
                .title(event.title())
                .description(event.description())
                .price(event.price())
                .discount(event.discount())
                .category(event.category())
                .subcategory(event.subcategory())
                .gender(event.gender())
                .imageUrls(event.imageUrls())
                .available(event.available())
                .build();

        catalogProductRepository.save(product);
    }

    @Transactional
    @CacheEvict(value = "products", key = "#event.id()")
    public void updateProduct(ProductUpdatedEvent event) {
        try {

            productEventValidator.validate(event);

            CatalogProduct product = catalogProductRepository.findById(event.id())
                    .orElseThrow(() -> new ProductNotFoundException(event.id()));

            product.setTitle(event.title());
            product.setDescription(event.description());
            product.setPrice(event.price());
            product.setDiscount(event.discount());
            product.setCategory(event.category());
            product.setSubcategory(event.subcategory());
            product.setGender(event.gender());
            product.setImageUrls(event.imageUrls());
            product.setAvailable(event.available());

        } catch (ProductNotFoundException | InvalidProductDataException e) {
            logger.error("Product update validation failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during product update", e);
            throw new EventProcessingException("Failed to process product update", e);
        }
    }

    @Transactional
    public void deleteProduct(ProductDeletedEvent event) {
        catalogProductRepository.deleteById(event.id());
    }

    public List<CatalogProduct> getAllProducts() {
        return catalogProductRepository.findAll();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#id")
    public CatalogProduct getProductById(String id) {
        return catalogProductRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public Page<CatalogProduct> getFilteredProducts(ProductFilterRequest filter, Pageable pageable) {
        Specification<CatalogProduct> spec = ProductSpecifications.withFilters(filter);
        return catalogProductRepository.findAll(spec, pageable);
    }
}
