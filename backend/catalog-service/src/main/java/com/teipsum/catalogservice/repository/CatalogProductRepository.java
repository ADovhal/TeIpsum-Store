package com.teipsum.catalogservice.repository;

import com.teipsum.catalogservice.model.CatalogProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository
public interface CatalogProductRepository extends
        JpaRepository<CatalogProduct, String>,
        JpaSpecificationExecutor<CatalogProduct> {
}