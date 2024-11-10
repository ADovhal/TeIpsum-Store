package com.dovhal.application.service;

import com.dovhal.application.model.Product;
import com.dovhal.application.repos.ProductRepository;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
// import java.util.List;
// import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> getFilteredProducts(String name, String category, BigDecimal minPrice, BigDecimal maxPrice, Double rating, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);

        // Применяем фильтры до пагинации, создаем запрос с фильтрами
        if (name != null || category != null || minPrice != null || maxPrice != null || rating != null) {
            // Метод с фильтрацией (реализуйте его в репозитории)
            return productRepository.findByFilters(name, category, minPrice, maxPrice, rating, pageable);
        } else {
            // Если фильтры пустые, возвращаем все продукты с пагинацией
            return productRepository.findAll(pageable);
        }
    }
}