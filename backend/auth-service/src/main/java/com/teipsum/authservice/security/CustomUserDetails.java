package com.teipsum.authservice.security;

import com.teipsum.authservice.model.UserCredentials;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {

    private final String userId;
    private final String username;
    private final String password;
    private final Set<GrantedAuthority> authorities;

    public CustomUserDetails(UserCredentials user) {
        this.userId = user.getId();
        this.username = user.getEmail();
        this.password = user.getPassword();
        this.authorities = user.getRoles() == null
                ? Set.of()
                : user.getRoles()
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toUnmodifiableSet());
    }

    public String getUserId() {
        return userId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // или ваша бизнес-логика
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // или ваша бизнес-логика
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // или ваша бизнес-логика
    }

    @Override
    public boolean isEnabled() {
        return true; // или ваша бизнес-логика
    }
}