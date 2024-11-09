package com.dovhal.application.controllers;

import com.dovhal.application.requests.LoginUserRequest;
import com.dovhal.application.model.User;
import com.dovhal.application.requests.RegistryUserRequest;
import com.dovhal.application.security.JwtUtil;
import com.dovhal.application.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final HttpServletRequest httpServletRequest;

    @Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, HttpServletRequest httpServletRequest) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.httpServletRequest = httpServletRequest;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegistryUserRequest request) {
        User user = new User();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setDob(request.getDob());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setJoinDate(LocalDate.now());

        User createdUser = userService.registerUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginUserRequest request) {

        String clientIP = httpServletRequest.getRemoteAddr();
        String requestURI = httpServletRequest.getRequestURI();
        System.out.println("Received login request from IP: " + clientIP + " for URI: " + requestURI);

        User foundUser = userService.findUserByEmail(request.getEmail());

        if (foundUser != null) {
            System.out.println("User found: " + foundUser.getId());
            System.out.println("Stored password: " + foundUser.getPassword());
            System.out.println("Received password: " + request.getPassword());

            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), foundUser.getPassword());
            System.out.println("Password matches: " + passwordMatches);

            if (passwordMatches) {
                String token = jwtUtil.createToken(foundUser.getEmail());  // Используем email для токена
                Map<String, Object> response = new HashMap<>();
                response.put("id", foundUser.getId());
                response.put("email", foundUser.getEmail());  // Отдаем email вместо username
                response.put("token", token);
                System.out.println(response);
                return ResponseEntity.ok(response);
            }
        } else {
            System.out.println("User not found");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

//    @GetMapping("/protected")
//    public ResponseEntity<Map<String, String>> getProtectedData(Authentication authentication) {
//        if (authentication != null && authentication.isAuthenticated()) {
//            String token = jwtUtil.createToken(authentication.getName());
//            Map<String, String> response = new HashMap<>();
//            response.put("token", token);
//
//            return ResponseEntity.ok(response);
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
//    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile() {
        User user = userService.getCurrentUser();

        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("dob", user.getJoinDate());
            response.put("name", user.getName());
            response.put("fullName", user.getName() + " " + user.getSurname());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteCurrentUser() {
        User currentUser = userService.getCurrentUser();

        if (currentUser != null) {
            userService.deleteUserById(currentUser.getId());
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok("Account deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
    }
}