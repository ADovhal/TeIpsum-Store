package com.teipsum.authservice.repository;

import com.teipsum.authservice.model.UserCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCredentialsRepository extends JpaRepository<UserCredentials, String> {
    Optional<UserCredentials> findByEmail(String email);
    boolean existsByEmail(String email);
}