package com.dovhal.application.controllers;

import com.dovhal.application.model.Product;
import com.dovhal.application.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import org.springframework.hateoas.PagedModel;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/products")
public class ProductController {


    private final ProductService productService;
    private final PagedResourcesAssembler<Product> pagedResourcesAssembler;

    @Autowired
    public ProductController(ProductService productService, PagedResourcesAssembler<Product> pagedResourcesAssembler) {
        this.productService = productService;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @GetMapping
    public ResponseEntity<?> getFilteredProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Получаем страницу продуктов
        Page<Product> products = productService.getFilteredProducts(name, category, minPrice, maxPrice, rating, page, size);

        PagedModel<EntityModel<Product>> pagedModel = pagedResourcesAssembler.toModel(products, product -> {
            // Преобразуем каждый продукт в EntityModel с добавлением ссылок
            EntityModel<Product> productEntityModel = EntityModel.of(product);
            // Можно добавить ссылки на продукт, например:
            productEntityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductController.class).getFilteredProducts(name, category, minPrice, maxPrice, rating, page, size)).withSelfRel());
            return productEntityModel;
        });
        return ResponseEntity.ok(pagedModel);
    }
}
