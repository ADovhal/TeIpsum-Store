package com.teipsum.authservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_value", unique = true, nullable = false)
    private String roleValue;

    public Role(RoleName name) {
        this.roleValue = name.getValue();
    }

    @Transient
    public RoleName getName() {
        return RoleName.fromValue(roleValue);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return Objects.equals(roleValue, role.roleValue);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roleValue);
    }
}