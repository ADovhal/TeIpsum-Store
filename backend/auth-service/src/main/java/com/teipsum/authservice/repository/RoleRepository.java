package com.teipsum.authservice.repository;

import com.teipsum.authservice.model.Role;
import com.teipsum.authservice.model.RoleName;
import com.teipsum.shared.exceptions.RoleNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleValue(String value);

    default Role findByName(RoleName roleName) {
        return findByRoleValue(roleName.getValue())
                .orElseThrow(() -> new RoleNotFoundException(roleName.name()));
    }
}
