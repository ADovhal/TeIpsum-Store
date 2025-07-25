package com.teipsum.authservice.service;

import com.teipsum.authservice.dto.AuthRequest;
import com.teipsum.authservice.dto.AuthResponse;
import com.teipsum.authservice.dto.RegisterRequest;
import com.teipsum.authservice.model.*;
import com.teipsum.authservice.repository.AdminRepository;
import com.teipsum.authservice.security.SecurityContextService;
import com.teipsum.shared.event.UserRegisteredEvent;
import com.teipsum.shared.event.UserLoggedInEvent;
import com.teipsum.authservice.repository.RoleRepository;
import com.teipsum.authservice.repository.UserCredentialsRepository;
import com.teipsum.authservice.security.JwtUtil;
import com.teipsum.shared.exceptions.EmailExistsException;
import com.teipsum.shared.exceptions.RoleNotFoundException;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
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
        private final AdminRepository adminRepository;
        private final SecurityContextService securityContext;

        public AuthResponse registerUser(RegisterRequest request) {
            if (userRepository.existsByEmail(request.email())) {
                throw new EmailExistsException(request.email());
            }

            UserCredentials user = createUser(request, RoleName.ROLE_USER);
            sendUserEvent(user, request, false);

            return generateTokens(user);
        }

        @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        public AuthResponse registerAdmin(RegisterRequest request) {
            if (userRepository.existsByEmail(request.email())) {
                throw new EmailExistsException(request.email());
            }

            String creatorId = securityContext.getCurrentUserId()
                    .orElseThrow(() -> new AccessDeniedException("Admin not authenticated"));

            UserCredentials admin = createUser(request, RoleName.ROLE_ADMIN);
            createAdminRecord(admin, creatorId);
            sendUserEvent(admin, request, true);

            return generateTokens(admin);
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

            return generateTokens(user);
        }

        private UserCredentials createUser(RegisterRequest request, RoleName role) {
            Role userRole = roleRepository.findByName(role);

            UserCredentials user = UserCredentials.builder()
                    .email(request.email())
                    .password(passwordEncoder.encode(request.password()))
                    .build();

            user.addRole(userRole); // Используем новый метод addRole()
            return userRepository.save(user);
        }

        private AuthResponse generateTokens(UserCredentials user) {
            List<String> roleNames = user.getRoles().stream()
                    .map(r -> r.getName().name())
                    .toList();

            boolean isAdmin = adminRepository.existsByUser_Id(user.getId());
            return new AuthResponse(
                    jwtUtil.createToken(user.getEmail(), roleNames,
                            isAdmin ? TokenType.ADMIN_ACCESS : TokenType.USER_ACCESS),
                    jwtUtil.createToken(user.getEmail(), roleNames,
                            isAdmin ? TokenType.ADMIN_REFRESH : TokenType.USER_REFRESH)
            );
        }

        private void createAdminRecord(UserCredentials user, String createdBy) {
            adminRepository.save(Admin.builder()
                    .user(user)
                    .createdBy(createdBy)
                    .build());
        }

        private void sendUserEvent(UserCredentials user, RegisterRequest request, boolean isAdmin) {
            String topic = isAdmin ? "admin-registered" : "user-registered";
            kafkaTemplate.send(topic, new UserRegisteredEvent(
                    user.getId(),
                    user.getEmail(),
                    request.name(),
                    request.surname(),
                    request.phone(),
                    request.dob(),
                    isAdmin
            ));
        }

        public UserCredentials loadUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        }
}