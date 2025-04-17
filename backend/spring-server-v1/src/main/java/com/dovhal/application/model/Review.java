package com.dovhal.application.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
// import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
//@Data
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "author", nullable = false, length = 50)
    private String author;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "rating", precision = 2, nullable = false)
    private Double rating;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
