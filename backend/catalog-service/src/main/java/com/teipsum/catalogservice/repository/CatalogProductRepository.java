package com.teipsum.catalogservice.repository;

import com.teipsum.catalogservice.model.CatalogProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface CatalogProductRepository extends
        JpaRepository<CatalogProduct, UUID>,
        JpaSpecificationExecutor<CatalogProduct> {
}