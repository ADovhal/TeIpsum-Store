package com.dovhal.userservice.repository;

import com.dovhal.userservice.model.UserProfile;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserProfile, String> {
    // Только базовые методы (save, findById, deleteById)
    Optional<UserProfile> findByEmail(String email);
}