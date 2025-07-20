//package com.dovhal.authservice.service;
//
//import com.dovhal.authservice.model.UserCredentials;
//import com.dovhal.authservice.repos.UserRepository;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserService {
//
//    private final UserRepository userRepository;
// 
//    @Autowired
//    public UserService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    public UserCredentials registerUser(UserCredentials user) {
//        if (userRepository.existsByEmail(user.getEmail())) {
//            throw new RuntimeException("This email is already in use");
//        }
//        return userRepository.save(user);
//    }
//
//    public UserCredentials findUserByEmail(String email) {
//        return userRepository.findByEmail(email);
//    }
//
//    public UserCredentials getCurrentUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.isAuthenticated()) {
//            String email = authentication.getName();
//            return userRepository.findByEmail(email);
//        }
//        return null;
//    }
//
//    public void deleteUserById(Long id) {
//        if (userRepository.existsById(id)) {
//            userRepository.deleteById(id);
//        } else {
//            throw new RuntimeException("User not found with id: " + id);
//        }
//    }
//}