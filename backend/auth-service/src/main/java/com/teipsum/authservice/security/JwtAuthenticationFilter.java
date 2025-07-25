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

        System.out.println("=== JWT Filter Start ===");
        System.out.println("Request URI: " + request.getRequestURI());

        String authHeader = request.getHeader(AUTH_HEADER);
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            System.out.println("No Bearer token found");
            filterChain.doFilter(request, response);
            return;
        }
//
        try {
            String token = authHeader.substring(BEARER_PREFIX.length());
            System.out.println("Token received: " + token.substring(0, 10) + "...");
            TokenType tokenType = jwtUtil.detectTokenTypeX(token, request.getRequestURI());

            if (request.getRequestURI().contains("/admin/") && !tokenType.name().startsWith("ADMIN_")) {
                throw new JWTVerificationException("Admin endpoint requires admin token");
            }

            String email = jwtUtil.extractEmail(token, tokenType);
            List<String> roles = jwtUtil.extractRoles(token, tokenType);

            System.out.println("Extracted roles: " + roles);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (!jwtUtil.isTokenExpired(token, tokenType)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            roles.stream()
                                    .map(SimpleGrantedAuthority::new)
                                    .collect(Collectors.toList())
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                    return;
                }
            }
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return;
        }
//            String token = authHeader.substring(7);
//            System.out.println("Token: " + token.substring(0, 10) + "...");
//
//            // 3. Принудительная аутентификация без сложных проверок
//            DecodedJWT jwt = JWT.decode(token); // Только декодирование без верификации
//
//            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
//                    jwt.getSubject(),
//                    null,
//                    jwt.getClaim("roles").asList(String.class).stream()
//                            .map(SimpleGrantedAuthority::new)
//                            .collect(Collectors.toList())
//            );
//
//            SecurityContextHolder.getContext().setAuthentication(auth);
//            System.out.println("Auth set for: " + auth);

            filterChain.doFilter(request, response);


//        } catch (Exception e) {
//            System.out.println("JWT ERROR: " + e.getMessage());
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
//        }
    }
}