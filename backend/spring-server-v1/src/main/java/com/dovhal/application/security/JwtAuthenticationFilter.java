package com.dovhal.application.security;

import com.auth0.jwt.exceptions.TokenExpiredException;
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

        // Пропускаем проверку токена для публичных путей, например для /api/products
        if (path.startsWith("/api/products")) {
            filterChain.doFilter(request, response);  // Пропускаем фильтр для публичных маршрутов
            return;
        }

        String token = extractToken(request);  // Извлекаем токен из заголовка

        if (token != null) {
            try {
                jwtUtil.verifyToken(token);  // Проверка токена
                String email = jwtUtil.extractEmailFromAccessToken(token);  // Извлекаем email из токена

                // Если токен валиден, устанавливаем информацию о пользователе в контексте безопасности
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        email, null, null
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (TokenExpiredException e) {
                // Обработка истекшего токена
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token has expired.");
                return; // Прерываем фильтрацию, если токен истек
            } catch (Exception e) {
                // Обработка других ошибок токена
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid token.");
                return; // Прерываем фильтрацию, если токен невалиден
            }
        }

        filterChain.doFilter(request, response);  // Продолжаем фильтрацию
    }

    // Метод для извлечения токена из заголовка Authorization
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
