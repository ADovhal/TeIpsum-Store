//package com.dovhal.authservice.service;
//
//import com.dovhal.authservice.model.Product;
//import com.dovhal.authservice.repos.ProductRepository;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.stereotype.Service;
//
//import java.math.BigDecimal;
//
//@Service
//public class ProductService {
//
//    private final ProductRepository productRepository;
//
//    public ProductService(ProductRepository productRepository) {
//        this.productRepository = productRepository;
//    }
//    public Page<Product> getFilteredProducts(String name, String category, BigDecimal minPrice, BigDecimal maxPrice, Double rating, int page, int size) {
//        PageRequest pageable = PageRequest.of(page, size);
//
//        if (name != null || category != null || minPrice != null || maxPrice != null || rating != null) {
//            return productRepository.findByFilters(name, category, minPrice, maxPrice, rating, pageable);
//        } else {
//            return productRepository.findAll(pageable);
//        }
//    }
//}