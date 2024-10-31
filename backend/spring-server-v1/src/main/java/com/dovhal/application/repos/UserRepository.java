package com.dovhal.application.repos;


import com.dovhal.application.model.User;

// import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    boolean existsByUsername(String username);

    // Optional<User> deleteById(String id);
}