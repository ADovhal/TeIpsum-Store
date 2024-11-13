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

        Page<Product> products = productService.getFilteredProducts(name, category, minPrice, maxPrice, rating, page, size);

        PagedModel<EntityModel<Product>> pagedModel = pagedResourcesAssembler.toModel(products, product -> {
            EntityModel<Product> productEntityModel = EntityModel.of(product);
            productEntityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductController.class).getFilteredProducts(name, category, minPrice, maxPrice, rating, page, size)).withSelfRel());
            return productEntityModel;
        });
        return ResponseEntity.ok(pagedModel);
    }
}
