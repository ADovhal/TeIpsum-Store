package com.teipsum.authservice.service;

import com.teipsum.authservice.dto.AuthRequest;
import com.teipsum.authservice.dto.AuthResponse;
import com.teipsum.authservice.dto.RegisterRequest;
import com.teipsum.shared.event.UserRegisteredEvent;
import com.teipsum.shared.event.UserLoggedInEvent;
import com.teipsum.authservice.model.Role;
import com.teipsum.authservice.model.RoleName;
import com.teipsum.authservice.repository.RoleRepository;
import com.teipsum.authservice.model.UserCredentials;
import com.teipsum.authservice.repository.UserCredentialsRepository;
import com.teipsum.authservice.security.JwtUtil;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserCredentialsRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RoleRepository roleRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already in use");
        }

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("Default role not found"));

        UserCredentials user = UserCredentials.builder()
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .roles(Set.of(userRole))
            .build();


        try {
                user = userRepository.save(user);

                kafkaTemplate.send("user-registered",
                        new UserRegisteredEvent(
                                user.getId(),
                                user.getEmail(),
                                request.name(),
                                request.surname(),
                                request.phone(),
                                request.dob()
                        )
                );

                List<String> roleNames = user.getRoles().stream()
                                             .map(role -> role.getName().name())
                                             .toList();

                return new AuthResponse(
                        jwtUtil.createAccessToken(user.getEmail(), roleNames),
                        jwtUtil.createRefreshToken(user.getEmail())
                );
        } catch (Exception e) {
            throw new RuntimeException("Registration failed", e);
        }
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        kafkaTemplate.send("user-login", new UserLoggedInEvent(
                request.email(),
                LocalDateTime.now()
        ));

        UserCredentials user = userRepository.findByEmail(request.email())
        .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> roleNames = user.getRoles().stream()
                                .map(role -> role.getName().name())
                                .toList();

        return new AuthResponse(
                jwtUtil.createAccessToken(request.email(), roleNames),
                jwtUtil.createRefreshToken(request.email())
        );
    }

    public UserCredentials loadUserByEmail(String email) {
    return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
}

}