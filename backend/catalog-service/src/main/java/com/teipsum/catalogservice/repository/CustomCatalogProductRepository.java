package com.teipsum.catalogservice.repository;

import com.teipsum.catalogservice.model.CatalogProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface CustomCatalogProductRepository {
    Page<CatalogProduct> findAllWithDistinctCount(Specification<CatalogProduct> spec, Pageable pageable);
}