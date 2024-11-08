package com.dovhal.application.service;

import com.dovhal.application.model.Product;
import com.dovhal.application.repos.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getFilteredProducts(String name, String category, BigDecimal minPrice, BigDecimal maxPrice, Double rating) {

        List<Product> products = productRepository.findAll();

        if (name != null && !name.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getName().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (category != null && !category.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getCategory().toLowerCase().equals(category.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (minPrice != null) {
            products = products.stream()
                    .filter(product -> product.getPrice().compareTo(minPrice) >= 0)
                    .collect(Collectors.toList());
        }
        if (maxPrice != null) {
            products = products.stream()
                    .filter(product -> product.getPrice().compareTo(maxPrice) <= 0)
                    .collect(Collectors.toList());
        }
        // Фильтруем по рейтингу
        if (rating != null) {
            products = products.stream()
                    .filter(product -> product.getRating() >= rating)
                    .collect(Collectors.toList());
        }

        return products;
    }


    // Получить все продукты
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
//    // Получить продукт по ID
//    public Product getProductById(Long id) {
//        return productRepository.findProductById(id);
//    }
//
//    // Получить продукты по категории
//    public List<Product> getProductsByCategory(String category) {
//        return productRepository.findByCategory(category);
//    }
//
//    // Получить продукты по названию
//    public List<Product> getProductsByName(String name) {
//        return productRepository.findByNameContaining(name);
//    }
//
//    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
//        return productRepository.findByPriceBetween(minPrice, maxPrice);
//    }
//
//    public List<Product> getProductsByRating(Double rating) {
//        return productRepository.findByRatingGreaterThanEqual(rating);
//    }
//
//    // Сохранение нового продукта
//    public Product saveProduct(Product product) {
//        return productRepository.save(product);
//    }
//
//    // Удаление продукта
//    public void deleteProduct(Long id) {
//        productRepository.deleteById(id);
//    }
//}
