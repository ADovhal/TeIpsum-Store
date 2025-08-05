package com.teipsum.adminproductservice.service;

import com.teipsum.adminproductservice.exception.ProductAlreadyExistsException;
import com.teipsum.shared.product.dto.ProductRequest;
import com.teipsum.shared.product.dto.ProductFilterRequest;
import com.teipsum.shared.exceptions.ProductNotFoundException;
import com.teipsum.adminproductservice.dto.ProductResponse;
import com.teipsum.adminproductservice.event.ProductEventPublisher;
import com.teipsum.adminproductservice.model.Product;
import com.teipsum.adminproductservice.repository.AdminProductRepository;
import com.teipsum.adminproductservice.util.SkuGenerator;
import com.teipsum.shared.product.filter.ProductSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final AdminProductRepository repository;
    private final ProductEventPublisher eventPublisher;
    private final ImageService imageService;
    private final SkuGenerator skuGenerator;

    @Transactional
    public ProductResponse createProduct(ProductRequest dto, List<MultipartFile> images) {
        if (repository.existsByTitle(dto.title()))
            throw new ProductAlreadyExistsException(dto.title());

        Product product = mapToEntity(dto);
        repository.save(product);

        List<String> urls = null;
        try {
            urls = imageService.uploadImages(product.getId(), images);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        product.setImageUrls(urls);
        repository.save(product);

        eventPublisher.publishProductCreated(product);
        return ProductResponse.fromEntity(product);
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest dto, List<MultipartFile> images) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        if (repository.existsByTitleAndIdNot(dto.title(), id))
            throw new ProductAlreadyExistsException(dto.title());

        updateEntity(product, dto);

        if (images != null && !images.isEmpty()) {
            try { imageService.deleteImages(id); } catch (IOException ignored) {}
            try {
                product.setImageUrls(imageService.uploadImages(id, images));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

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
        String sku = skuGenerator.generateSku(request.category(), request.subcategory(), request.gender());
        
        return Product.builder()
                .sku(sku)
                .title(request.title())
                .description(request.description())
                .price(request.price())
                .discount(request.discount())
                .category(request.category())
                .subcategory(request.subcategory())
                .gender(request.gender())
                .imageUrls(request.imageUrls())
                .sizes(request.sizes())
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
        product.setSizes(request.sizes());
        product.setAvailable(request.available());
    }
}
