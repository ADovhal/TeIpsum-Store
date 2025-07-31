package com.teipsum.userservice.config;

import org.springframework.security.oauth2.jwt.*;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.List;

public final class CompositeJwtDecoder implements JwtDecoder {

    private final List<JwtDecoder> delegates;

    private CompositeJwtDecoder(List<JwtDecoder> delegates) {
        this.delegates = delegates;
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        for (JwtDecoder decoder : delegates) {
            try {
                return decoder.decode(token);
            } catch (JwtException ignored) {}
        }
        throw new JwtException("Invalid token signature");
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final java.util.ArrayList<JwtDecoder> decoders = new java.util.ArrayList<>();

        public Builder withSecret(String secret) {
            SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            decoders.add(NimbusJwtDecoder.withSecretKey(key).build());
            return this;
        }

        public CompositeJwtDecoder build() {
            return new CompositeJwtDecoder(List.copyOf(decoders));
        }
    }
}