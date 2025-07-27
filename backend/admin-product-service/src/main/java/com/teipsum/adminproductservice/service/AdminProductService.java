package com.teipsum.adminproductservice.service;

import com.teipsum.adminproductservice.exception.ProductAlreadyExistsException;
import com.teipsum.shared.product.dto.ProductRequest;
import com.teipsum.shared.product.dto.ProductFilterRequest;
import com.teipsum.shared.exceptions.ProductNotFoundException;
import com.teipsum.adminproductservice.dto.ProductResponse;
import com.teipsum.adminproductservice.event.ProductEventPublisher;
import com.teipsum.adminproductservice.model.Product;
import com.teipsum.adminproductservice.repository.AdminProductRepository;
import com.teipsum.shared.product.filter.ProductSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final AdminProductRepository repository;
    private final ProductEventPublisher eventPublisher;

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (repository.existsByTitle(request.title())) {
            throw new ProductAlreadyExistsException(request.title());
        }
        Product product = mapToEntity(request);
        repository.save(product);
        eventPublisher.publishProductCreated(product);
        return ProductResponse.fromEntity(product);
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest request) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        if (repository.existsByTitleAndIdNot(request.title(), id)) {
            throw new ProductAlreadyExistsException(request.title());
        }

        updateEntity(product, request);
        repository.save(product);
        eventPublisher.publishProductUpdated(product);
        return ProductResponse.fromEntity(product);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        repository.delete(product);
        eventPublisher.publishProductDeleted(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(UUID id) {
        return repository.findById(id)
                .map(ProductResponse::fromEntity)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(ProductFilterRequest filter, Pageable pageable) {
        Specification<Product> spec = ProductSpecifications.withFilters(filter);
        return repository.findAll(spec, pageable)
                .map(ProductResponse::fromEntity);
    }


    private Product mapToEntity(ProductRequest request) {
        return Product.builder()
                .title(request.title())
                .description(request.description())
                .price(request.price())
                .discount(request.discount())
                .category(request.category())
                .subcategory(request.subcategory())
                .gender(request.gender())
                .imageUrls(request.imageUrls())
                .available(request.available())
                .build();
    }

    private void updateEntity(Product product, ProductRequest request) {
        product.setTitle(request.title());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setDiscount(request.discount());
        product.setCategory(request.category());
        product.setSubcategory(request.subcategory());
        product.setGender(request.gender());
        product.setImageUrls(request.imageUrls());
        product.setAvailable(request.available());
    }
}
