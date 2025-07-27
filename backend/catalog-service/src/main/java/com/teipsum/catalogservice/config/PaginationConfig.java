package com.teipsum.catalogservice.config;

import com.teipsum.catalogservice.model.CatalogProduct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@Configuration
@EnableSpringDataWebSupport
public class PaginationConfig {
    @Bean
    public PagedResourcesAssembler<CatalogProduct> pagedResourcesAssembler() {
        return new PagedResourcesAssembler<>(null, null);
    }
}