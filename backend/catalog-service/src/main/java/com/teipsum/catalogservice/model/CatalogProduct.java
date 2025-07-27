package com.teipsum.catalogservice.model;

import com.teipsum.shared.product.model.ProductBase;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "catalog_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CatalogProduct extends ProductBase {

    @Id
    private String id;
}
