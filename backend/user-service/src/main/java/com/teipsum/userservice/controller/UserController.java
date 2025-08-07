package com.teipsum.userservice.controller;

import com.teipsum.userservice.model.UserProfile;
import com.teipsum.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    @Operation(
        summary = "Get current user profile information",
        description = "Retrieves the profile information of the authenticated user",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "User profile found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            ),
            @ApiResponse(
                responseCode = "401",
                description = "Unauthorized",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
    public ResponseEntity<Map<String, Object>> getUserProfile() {
        UserProfile user = userService.getCurrentUser();
 
        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("joinDate", user.getJoinDate());
            response.put("name", user.getName());
            response.put("fullName", user.getName() + " " + user.getSurname());
 
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


    @GetMapping("/{userId}")
    @Operation(
        summary = "Get user profile by ID",
        description = "Retrieves the profile of a user by their unique ID",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "User profile found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            ),
            @ApiResponse(
                responseCode = "404",
                description = "User not found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
    public ResponseEntity<Map<String, Object>> getUserProfile(
            @PathVariable String userId
    ) {
        UserProfile user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "phone", user.getPhone()
        ));
    }

    @DeleteMapping("/{userId}")
    @Operation(
        summary = "Delete user by ID",
        description = "Deletes a user by their unique ID",
        responses = {
            @ApiResponse(
                responseCode = "204",
                description = "User deleted successfully"
            ),
            @ApiResponse(
                responseCode = "404",
                description = "User not found",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Map.class)
                )
            )
        }
    )
    public ResponseEntity<Void> deleteUser(
            @PathVariable String userId
    ) {
        userService.deleteUserById(userId);
        return ResponseEntity.noContent().build();
    }
}