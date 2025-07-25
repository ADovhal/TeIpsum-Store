package com.teipsum.authservice.repository;

import com.teipsum.authservice.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByUser_Id(String userId);
    Admin findByUser_Id(String userId);
}