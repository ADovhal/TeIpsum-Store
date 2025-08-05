package com.teipsum.catalogservice.model;

import com.teipsum.shared.product.model.ProductBase;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "catalog_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CatalogProduct extends ProductBase {

    @Id
    private UUID id;

    @ElementCollection
    @CollectionTable(name = "catalog_product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size")
    private List<String> sizes;
}
