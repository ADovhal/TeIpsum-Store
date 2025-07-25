package com.teipsum.authservice.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.teipsum.authservice.model.TokenType;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws IOException, ServletException {

        final String requestUri = request.getRequestURI();
        System.out.println("\n=== JWT Filter Start ===");
        System.out.println("Processing request to: " + requestUri);

        final String authHeader = request.getHeader(AUTH_HEADER);
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            System.out.println("No Bearer token found, passing to next filter");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String token = authHeader.substring(BEARER_PREFIX.length());
            System.out.println("JWT token found: " + token.substring(0, 10) + "...");

            final TokenType tokenType = jwtUtil.detectTokenTypeX(token, requestUri);
            System.out.println("Detected token type: " + tokenType);

            if (requestUri.contains("/admin/") && !tokenType.name().startsWith("ADMIN_")) {
                System.out.println("Admin endpoint requires ADMIN token");
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Admin access required");
                return;
            }

            final String email = jwtUtil.extractEmail(token, tokenType);
            final List<String> roles = jwtUtil.extractRoles(token, tokenType);
            System.out.println("Authenticating user: " + email + " with roles: " + roles);

            if (jwtUtil.isTokenExpired(token, tokenType)) {
                System.out.println("Token expired for user: " + email);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                return;
            }

            final UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            roles.stream()
                                    .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                                    .map(SimpleGrantedAuthority::new)
                                    .collect(Collectors.toList())
                    );

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            System.out.println("SecurityContext updated for: " + email);

            filterChain.doFilter(request, response);

        } catch (JWTVerificationException e) {
            System.out.println("JWT verification failed: " + e.getMessage());
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Authentication error");
        } finally {
            System.out.println("=== JWT Filter End ===");
        }
    }
}