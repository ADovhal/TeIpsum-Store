package com.teipsum.adminproductservice.repository;

import com.teipsum.adminproductservice.model.Product;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AdminProductRepository extends
        JpaRepository<Product, UUID>,
        JpaSpecificationExecutor<Product> {
    boolean existsByTitle(String title);
    boolean existsByTitleAndIdNot(String title, UUID id);
}

