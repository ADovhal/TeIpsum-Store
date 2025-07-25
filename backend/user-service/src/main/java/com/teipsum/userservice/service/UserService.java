package com.teipsum.userservice.service;

import com.teipsum.userservice.model.UserProfile;
import com.teipsum.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public void createUserProfile(
            String userId,
            String email,
            String name,
            String surname,
            String phone,
            LocalDate dob,
            Boolean isAdmin
    ) {
        if (userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User profile already exists");
        }

        UserProfile profile = new UserProfile();
        profile.setId(userId);
        profile.setEmail(email);
        profile.setName(name);
        profile.setSurname(surname);
        profile.setPhone(phone);
        profile.setDob(dob);
        profile.setIsAdmin(isAdmin);
        profile.setJoinDate(LocalDate.now());
        profile.setLastLoginDate(LocalDateTime.now());
        userRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public UserProfile getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }

    @Transactional(readOnly = true)
    public UserProfile getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        }
        return null;
    }

    @Transactional
    public void updateLastLogin(String email, LocalDateTime loginDate) {
        UserProfile user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        user.setLastLoginDate(loginDate);
    userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserProfile getByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }

    @Transactional
    public void deleteUserById(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }
    
    @Transactional(readOnly = true)
    public boolean existsById(String userId) {
        return userRepository.existsById(userId);
    }
}