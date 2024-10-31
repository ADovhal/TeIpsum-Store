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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private HttpServletRequest httpServletRequest;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegistryUserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User createdUser = userService.registerUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginUserRequest request) {

        String clientIP = httpServletRequest.getRemoteAddr();
        String requestURI = httpServletRequest.getRequestURI();
        System.out.println("Received login request from IP: " + clientIP + " for URI: " + requestURI);

        User foundUser = userService.findUserByUsername(request.getUsername());

        if (foundUser != null) {
            System.out.println("User found: " + foundUser.getUsername());
            System.out.println("Stored password: " + foundUser.getPassword());
            System.out.println("Received password: " + request.getPassword());
            //passwordEncoder.encode()
            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), foundUser.getPassword());
            System.out.println("Password matches: " + passwordMatches);

            if (passwordMatches) {
                String token = jwtUtil.createToken(foundUser.getUsername());
                Map<String, Object> response = new HashMap<>();
                response.put("id", foundUser.getId());
                response.put("username", foundUser.getUsername());
                response.put("token", token);
                System.out.println(response);
                return ResponseEntity.ok(response);
            }
        } else {
            System.out.println("User not found");
        }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }


    @GetMapping("/protected")
    public ResponseEntity<Map<String, String>> getProtectedData(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String token = jwtUtil.createToken(authentication.getName());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile() {
        User user = userService.getCurrentUser();

        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());

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