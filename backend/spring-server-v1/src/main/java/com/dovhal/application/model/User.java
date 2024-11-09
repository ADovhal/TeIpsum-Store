package com.dovhal.application.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(unique = true, nullable = false)
    private String email; // Используем как идентификатор

    @Column(nullable = false)
    private String password;


    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private LocalDate dob;  // Дата рождения

    @Column(nullable = false, updatable = false)
    private LocalDate joinDate = LocalDate.now();  // Дата регистрации
}
