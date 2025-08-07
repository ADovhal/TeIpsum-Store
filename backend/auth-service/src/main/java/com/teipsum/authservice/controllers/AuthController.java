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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

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
    @Operation(
        summary = "Register a new user",
        description = "Registers a new user with the provided credentials",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "User registered successfully",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = AuthResponse.class)
                )
            ),
            @ApiResponse(
                responseCode = "409",
                description = "User already exists",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
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
    @Operation(
        summary = "Register a new admin user",
        description = "Registers a new admin user with the provided credentials",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Admin user registered successfully",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = AuthResponse.class)
                )
            ),
            @ApiResponse(
                responseCode = "409",
                description = "Admin user already exists",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterRequest request, HttpServletResponse response) {
        try {

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("In controller - auth: " + auth.getAuthorities());
            AuthResponse authResponse = authService.registerAdmin(request);

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
    @Operation(
        summary = "Authenticate a user",
        description = "Authenticates a user with the provided credentials and returns an access token",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "User authenticated successfully",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = AuthResponse.class)
                )
            ),
            @ApiResponse(
                responseCode = "401",
                description = "Invalid credentials",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
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
    @Operation(
        summary = "Refresh access token",
        description = "Refreshes the access token using the provided refresh token",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Access token refreshed successfully",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = AuthResponse.class)
                )
            ),
            @ApiResponse(
                responseCode = "401",
                description = "Invalid or expired refresh token",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
    public ResponseEntity<?> refreshAccessToken(
            @CookieValue(name = "refreshToken", required = true) String refreshToken,
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

            String id = jwtUtil.extractUserId(refreshToken, refreshTokenType);
            String email = jwtUtil.extractEmail(refreshToken, refreshTokenType);
            List<String> roles = jwtUtil.extractRoles(refreshToken, refreshTokenType);

            TokenType newAccessTokenType = roles.contains("ROLE_ADMIN")
                    ? TokenType.ADMIN_ACCESS
                    : TokenType.USER_ACCESS;

            String newAccessToken = jwtUtil.createToken(id, email, roles, newAccessTokenType);
            String newRefreshToken = jwtUtil.createToken(id, email, roles, refreshTokenType);

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
