package com.teipsum.authservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_value", unique = true, nullable = false)
    private String roleValue;

    @Transient
    @Enumerated(EnumType.STRING)
    private RoleName name;

    @PrePersist
    @PreUpdate
    private void beforeSave() {
        if (name != null) {
            this.roleValue = name.getValue();
        }
    }

    @PostLoad
    private void afterLoad() {
        if (roleValue != null) {
            this.name = RoleName.fromValue(roleValue);
        }
    }

    public Role(RoleName name) {
        this.name = name;
        this.roleValue = name.getValue();
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