// CustomCatalogProductRepositoryImpl.java
package com.teipsum.catalogservice.repository;

import com.teipsum.catalogservice.model.CatalogProduct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CustomCatalogProductRepositoryImpl implements CustomCatalogProductRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Page<CatalogProduct> findAllWithDistinctCount(Specification<CatalogProduct> spec, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<CatalogProduct> countRoot = countQuery.from(CatalogProduct.class);
        countQuery.select(cb.countDistinct(countRoot));

        if (spec != null) {
            Predicate predicate = spec.toPredicate(countRoot, countQuery, cb);
            if (predicate != null) {
                countQuery.where(predicate);
            }
        }

        Long total = em.createQuery(countQuery).getSingleResult();

        CriteriaQuery<CatalogProduct> query = cb.createQuery(CatalogProduct.class);
        Root<CatalogProduct> root = query.from(CatalogProduct.class);
        query.distinct(true);

        if (spec != null) {
            Predicate predicate = spec.toPredicate(root, query, cb);
            if (predicate != null) {
                query.where(predicate);
            }
        }

        if (pageable.getSort().isSorted()) {
            List<Order> orders = new ArrayList<>();
            for (Sort.Order sortOrder : pageable.getSort()) {
                Path<?> path = root.get(sortOrder.getProperty());
                orders.add(sortOrder.isAscending() ? cb.asc(path) : cb.desc(path));
            }
            query.orderBy(orders);
        }

        TypedQuery<CatalogProduct> typedQuery = em.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<CatalogProduct> content = typedQuery.getResultList();

        return new PageImpl<>(content, pageable, total);
    }
}