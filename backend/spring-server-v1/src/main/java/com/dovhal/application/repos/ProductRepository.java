package com.dovhal.application.repos;

import com.dovhal.application.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p " +
            "WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:category IS NULL OR LOWER(p.category) = LOWER(:category)) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "AND (:rating IS NULL OR p.rating >= :rating)")
    Page<Product> findByFilters(
            @Param("name") String name,
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("rating") Double rating,
            Pageable pageable);

    Product findProductById(Long id);

    // Поиск продукта по категории
    List<Product> findByCategory(String category);

    // Поиск продукта по названию
    List<Product> findByNameContaining(String name);

    // Поиск продуктов по диапазону цен
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Поиск продуктов по рейтингу
    List<Product> findByRatingGreaterThanEqual(Double rating);
}
