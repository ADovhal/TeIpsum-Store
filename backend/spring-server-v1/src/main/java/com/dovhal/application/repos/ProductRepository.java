package com.dovhal.application.repos;

import com.dovhal.application.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Collections;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {


    default Page<Product> findAll(Pageable pageable) {
        return new PageImpl<>(Collections.emptyList(), pageable, 0);
    }

    // Метод с фильтрацией
    @Query("SELECT p FROM Product p WHERE " +
            "(?1 IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', ?1, '%'))) AND " +
            "(?2 IS NULL OR LOWER(p.category) LIKE LOWER(CONCAT('%', ?2, '%'))) AND " +
            "(?3 IS NULL OR p.price >= ?3) AND " +
            "(?4 IS NULL OR p.price <= ?4) AND " +
            "(?5 IS NULL OR p.rating >= ?5)")
    Page<Product> findByFilters(String name, String category, BigDecimal minPrice, BigDecimal maxPrice, Double rating, Pageable pageable);
}
