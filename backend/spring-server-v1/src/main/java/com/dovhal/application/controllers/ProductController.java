package com.dovhal.application.controllers;

import com.dovhal.application.model.Product;
import com.dovhal.application.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getFilteredProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double rating) {

        List<Product> products;

        if (name == null && category == null && minPrice == null && maxPrice == null && rating == null) {
            products = productService.getAllProducts();
        } else {
            products = productService.getFilteredProducts(name, category, minPrice, maxPrice, rating);
        }

        return ResponseEntity.ok(products);
    }
}
//    @GetMapping("/{id}")
//    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
//        Product product = productService.getProductById(id);
//        if (product != null) {
//            return ResponseEntity.ok(product);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

//    @GetMapping("/category/{category}")
//    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
//        List<Product> products = productService.getProductsByCategory(category);
//        return ResponseEntity.ok(products);
//    }

//    @GetMapping("/search")
//    public ResponseEntity<List<Product>> getProductsByName(@RequestParam String name) {
//        List<Product> products = productService.getProductsByName(name);
//        return ResponseEntity.ok(products);
//    }

//    @GetMapping("/price")
//    public ResponseEntity<List<Product>> getProductsByPriceRange(@RequestParam BigDecimal minPrice,
//                                                                 @RequestParam BigDecimal maxPrice) {
//        List<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice);
//        return ResponseEntity.ok(products);
//    }

//    @GetMapping("/rating")
//    public ResponseEntity<List<Product>> getProductsByRating(@RequestParam Double rating) {
//        List<Product> products = productService.getProductsByRating(rating);
//        return ResponseEntity.ok(products);
//    }

//    @PostMapping("/create")
//    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
//        Product createdProduct = productService.saveProduct(product);
//        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
//    }
//
//    @DeleteMapping("/delete/{id}")
//    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
//        productService.deleteProduct(id);
//        return ResponseEntity.noContent().build();
//    }
//}
