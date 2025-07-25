package com.teipsum.shared.exceptions;

public class RoleNotFoundException extends RuntimeException {
    public RoleNotFoundException(String roleName) {
        super("Role '" + roleName + "' not found in database");
    }
}