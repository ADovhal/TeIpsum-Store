package com.dovhal.authservice.repository;

import com.dovhal.authservice.model.Role;
import com.dovhal.authservice.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
