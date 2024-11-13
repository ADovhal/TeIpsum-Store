package com.dovhal.application.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Пропускаем фильтр для публичных маршрутов, включая маршрут обновления токена
        if (path.startsWith("/api/products") || path.startsWith("/api/auth/refresh")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Извлечение Access Token из заголовка
        String accessToken = extractAccessToken(request);
        if (accessToken != null) {
            if (!jwtUtil.isAccessTokenExpired(accessToken)) {
                // Если Access Token действителен, получаем email и устанавливаем контекст безопасности
                String email = jwtUtil.extractEmailFromAccessToken(accessToken);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        email, null, null
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } else {
                // Если Access Token истек, возвращаем код 401 и сообщение
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Access token is expired. Please refresh your token.");
                return;
            }
        }

        // Продолжаем фильтрацию, если Access Token валиден или не требуется
        filterChain.doFilter(request, response);
    }

    // Метод для извлечения Access Token из заголовка Authorization
    private String extractAccessToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        return (header != null && header.startsWith("Bearer ")) ? header.substring(7) : null;
    }
}
