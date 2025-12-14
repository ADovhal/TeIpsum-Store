package com.teipsum.userservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
public class UserProfile {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private LocalDate dob;

    @Column
    private Boolean isAdmin;

    @Column(nullable = false, updatable = false)
    private LocalDate joinDate = LocalDate.now();

    @Column(nullable = false)
    private LocalDateTime lastLoginDate;

    // Body parameters for fit service
    @Column
    private Double bodyHeight; // Height in cm

    @Column
    private Double bodyChest; // Chest circumference in cm

    @Column
    private Double bodyWaist; // Waist circumference in cm

    @Column
    private Double bodyHips; // Hips circumference in cm

    @Column
    private Double bodyShoulderWidth; // Shoulder width in cm
}