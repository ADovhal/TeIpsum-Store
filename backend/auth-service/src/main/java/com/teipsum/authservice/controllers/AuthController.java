package com.teipsum.authservice.controllers;

import com.teipsum.authservice.dto.AuthRequest;
import com.teipsum.authservice.dto.AuthResponse;
import com.teipsum.authservice.dto.RegisterRequest;
import com.teipsum.authservice.model.UserCredentials;
import com.teipsum.authservice.security.JwtUtil;
import com.teipsum.authservice.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    private static final int REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletResponse response) {
        try {
            AuthResponse authResponse = authService.register(request);
            ResponseCookie refreshTokenCookie = createRefreshTokenCookie(authResponse.getRefreshToken());
            response.addHeader("Set-Cookie", refreshTokenCookie.toString());

            return ResponseEntity.ok(Map.of(
                    "accessToken", authResponse.getAccessToken()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        try {
            AuthResponse authResponse = authService.login(request);
            ResponseCookie refreshTokenCookie = createRefreshTokenCookie(authResponse.getRefreshToken());
            response.addHeader("Set-Cookie", refreshTokenCookie.toString());

            return ResponseEntity.ok(Map.of(
                    "accessToken", authResponse.getAccessToken()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        if (refreshToken == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh token is missing"));
        }

        try {
            if (jwtUtil.isRefreshTokenExpired(refreshToken)) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Refresh token expired"));
            }

            String email = jwtUtil.extractEmailFromRefreshToken(refreshToken);
            UserCredentials user = authService.loadUserByEmail(email);
            List<String> roleNames = user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .toList();

            String newAccessToken = jwtUtil.createAccessToken(email, roleNames);
            String newRefreshToken = jwtUtil.createRefreshToken(email);

            ResponseCookie newRefreshTokenCookie = createRefreshTokenCookie(newRefreshToken);
            response.addHeader("Set-Cookie", newRefreshTokenCookie.toString());

            return ResponseEntity.ok(Map.of(
                    "accessToken", newAccessToken
            ));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid refresh token"));
        }
    }

    private ResponseCookie createRefreshTokenCookie(String token) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(REFRESH_TOKEN_EXPIRATION)
                .build();
    }
}
