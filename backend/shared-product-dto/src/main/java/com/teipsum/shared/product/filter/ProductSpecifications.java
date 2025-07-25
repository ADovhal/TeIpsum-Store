package com.teipsum.shared.product.filter;

import com.teipsum.shared.product.dto.ProductFilterRequest;
import com.teipsum.shared.exceptions.InvalidSortPropertyException;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;


public class ProductSpecifications {

    public static <T> Specification<T> withFilters(ProductFilterRequest filter) {
        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            if (filter.searchQuery() != null && !filter.searchQuery().isBlank()) {
                String pattern = "%" + filter.searchQuery().toLowerCase() + "%";
                predicate = cb.and(predicate, cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (filter.category() != null)
                predicate = cb.and(predicate, cb.equal(root.get("category"), filter.category()));

            if (filter.subcategory() != null)
                predicate = cb.and(predicate, cb.equal(root.get("subcategory"), filter.subcategory()));

            if (filter.gender() != null)
                predicate = cb.and(predicate, cb.equal(root.get("gender"), filter.gender()));

            if (filter.minPrice() != null)
                predicate = cb.and(predicate, cb.ge(root.get("price"), filter.minPrice()));

            if (filter.maxPrice() != null)
                predicate = cb.and(predicate, cb.le(root.get("price"), filter.maxPrice()));

            if (filter.minDiscount() != null)
                predicate = cb.and(predicate, cb.ge(root.get("discount"), filter.minDiscount()));

            if (filter.maxDiscount() != null)
                predicate = cb.and(predicate, cb.le(root.get("discount"), filter.maxDiscount()));

            if (filter.available() != null)
                predicate = cb.and(predicate, cb.equal(root.get("available"), filter.available()));

            if (filter.sortDirection() != null && filter.sortBy() != null) {
                try {
                    Path<Object> fieldPath = root.get(filter.sortBy());
                    Order order = filter.sortDirection() == Sort.Direction.ASC
                            ? cb.asc(fieldPath)
                            : cb.desc(fieldPath);
                    assert query != null;
                    query.orderBy(order);
                } catch (IllegalArgumentException e) {
                    throw new InvalidSortPropertyException("Invalid sort property: " + filter.sortBy());
                }
            }

            return predicate;
        };
    }
}
