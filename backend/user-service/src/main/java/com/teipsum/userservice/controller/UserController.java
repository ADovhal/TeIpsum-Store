package com.teipsum.userservice.controller;

import com.teipsum.userservice.dto.UserDeletionInfoResponse;
import com.teipsum.userservice.model.UserProfile;
import com.teipsum.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @GetMapping("/deletion-info")
    @Operation(
        summary = "Get account deletion information",
        description = "Gets information about what will be deleted when user deletes their account",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Deletion info retrieved successfully",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = UserDeletionInfoResponse.class)
                )
            ),
            @ApiResponse(
                responseCode = "401",
                description = "User not authenticated"
            )
        }
    )
    public ResponseEntity<UserDeletionInfoResponse> getDeletionInfo() {
        UserProfile currentUser = userService.getCurrentUser();
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        UserDeletionInfoResponse info = userService.getDeletionInfo(currentUser.getId());
        return ResponseEntity.ok(info);
    }

    @PostMapping("/initiate-deletion")
    @Operation(
        summary = "Initiate account deletion",
        description = "Initiates the account deletion process with proper coordination across services",
        responses = {
            @ApiResponse(
                responseCode = "202",
                description = "Account deletion initiated successfully"
            ),
            @ApiResponse(
                responseCode = "401",
                description = "User not authenticated"
            )
        }
    )
    public ResponseEntity<Map<String, String>> initiateAccountDeletion() {
        UserProfile currentUser = userService.getCurrentUser();
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        userService.initiateUserDeletion(currentUser.getId());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Account deletion initiated. Your account will be deleted shortly.");
        response.put("userId", currentUser.getId());
        
        return ResponseEntity.accepted().body(response);
    }

    @DeleteMapping("/delete")
    @Operation(
        summary = "Delete user by ID (Legacy)",
        description = "Legacy endpoint for direct user deletion - use /initiate-deletion instead",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "User deleted successfully"
            ),
            @ApiResponse(
                responseCode = "401",
                description = "User not authenticated"
            )
        }
    )
    @Deprecated
    public ResponseEntity<String> deleteCurrentUser() {
        UserProfile currentUser = userService.getCurrentUser();

        if (currentUser != null) {
            // Use the new deletion service instead of direct deletion
            userService.initiateUserDeletion(currentUser.getId());
            return ResponseEntity.ok("Account deletion initiated");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
    }

    @GetMapping("/body-parameters")
    @Operation(
        summary = "Get user body parameters",
        description = "Retrieves body parameters for fit service (height, chest, waist, hips, shoulder width)",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Body parameters retrieved successfully"
            ),
            @ApiResponse(
                responseCode = "401",
                description = "User not authenticated"
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Body parameters not set"
            )
        }
    )
    public ResponseEntity<Map<String, Double>> getBodyParameters() {
        try {
            Map<String, Double> bodyParams = userService.getBodyParameters();
            if (bodyParams.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(bodyParams);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/body-parameters")
    @Operation(
        summary = "Save user body parameters",
        description = "Saves or updates body parameters for fit service",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Body parameters saved successfully"
            ),
            @ApiResponse(
                responseCode = "400",
                description = "Invalid body parameters"
            ),
            @ApiResponse(
                responseCode = "401",
                description = "User not authenticated"
            )
        }
    )
    public ResponseEntity<Map<String, String>> saveBodyParameters(
            @RequestBody Map<String, Double> bodyParams) {
        try {
            // Validate required parameters
            if (bodyParams == null || 
                bodyParams.get("height") == null ||
                bodyParams.get("chest") == null ||
                bodyParams.get("waist") == null ||
                bodyParams.get("hips") == null ||
                bodyParams.get("shoulderWidth") == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "All body parameters are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Validate parameter ranges
            Double height = bodyParams.get("height");
            Double chest = bodyParams.get("chest");
            Double waist = bodyParams.get("waist");
            Double hips = bodyParams.get("hips");
            Double shoulderWidth = bodyParams.get("shoulderWidth");

            if (height < 100 || height > 250 ||
                chest < 50 || chest > 200 ||
                waist < 40 || waist > 200 ||
                hips < 50 || hips > 200 ||
                shoulderWidth < 20 || shoulderWidth > 100) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Body parameters are out of valid range");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            userService.saveBodyParameters(height, chest, waist, hips, shoulderWidth);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Body parameters saved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to save body parameters: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}