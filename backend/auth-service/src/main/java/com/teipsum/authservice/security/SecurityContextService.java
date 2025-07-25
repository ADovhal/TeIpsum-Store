package com.teipsum.authservice.security;

import com.teipsum.authservice.model.UserCredentials;
import com.teipsum.authservice.repository.UserCredentialsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SecurityContextService {
    private final UserCredentialsRepository userRepository;

    public Optional<String> getCurrentUserId() {
        return getCurrentUserEmail()
                .flatMap(email -> userRepository.findByEmail(email)
                        .map(UserCredentials::getId));
    }

    public Optional<String> getCurrentUserEmail() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(auth -> auth.getName());
    }

    public Optional<List<String>> getCurrentUserRoles() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(auth -> auth.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList());
    }
}