package com.teipsum.authservice.controllers;

import com.teipsum.authservice.dto.AuthRequest;
import com.teipsum.authservice.dto.AuthResponse;
import com.teipsum.authservice.dto.RegisterRequest;
import com.teipsum.authservice.model.TokenType;
import com.teipsum.authservice.security.JwtUtil;
import com.teipsum.authservice.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
            AuthResponse authResponse = authService.registerUser(request);
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
    /**
     * Endpoint for admin registration.
     * This endpoint is used to register a new admin user.
     *
     * @param request  the registration request containing user details
     * @param response the HTTP response to set cookies
     * @return a ResponseEntity containing the access token or an error message
     */
    @PostMapping("/register_admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterRequest request, HttpServletResponse response) {
        try {

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("In controller - auth: " + auth.getAuthorities());
            AuthResponse authResponse = authService.registerAdmin(request);

//            ResponseCookie refreshTokenCookie = createRefreshTokenCookie(authResponse.getRefreshToken());
//            response.addHeader("Set-Cookie", refreshTokenCookie.toString());

            return ResponseEntity.ok(Map.of(
                    "accessToken", authResponse.getAccessToken()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/debug/auth")
    public ResponseEntity<?> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(Map.of(
                "name", auth.getName(),
                "roles", auth.getAuthorities(),
                "authenticated", auth.isAuthenticated()
        ));
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
            HttpServletResponse response) {

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh token is missing"));
        }

        try {
            TokenType refreshTokenType = jwtUtil.detectTokenType(refreshToken);

            if (!refreshTokenType.toString().contains("REFRESH")) {
                throw new RuntimeException("Not a refresh token");
            }

            if (jwtUtil.isTokenExpired(refreshToken, refreshTokenType)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Refresh token expired"));
            }

            String email = jwtUtil.extractEmail(refreshToken, refreshTokenType);
            List<String> roles = jwtUtil.extractRoles(refreshToken, refreshTokenType);

            TokenType newAccessTokenType = roles.contains("ROLE_ADMIN")
                    ? TokenType.ADMIN_ACCESS
                    : TokenType.USER_ACCESS;

            String newAccessToken = jwtUtil.createToken(email, roles, newAccessTokenType);
            String newRefreshToken = jwtUtil.createToken(email, roles, refreshTokenType);

            response.addHeader("Set-Cookie", createRefreshTokenCookie(newRefreshToken).toString());
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid refresh token: " + e.getMessage()));
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
