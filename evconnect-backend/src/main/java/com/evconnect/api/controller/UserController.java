package com.evconnect.api.controller;

import com.evconnect.api.model.User;
import com.evconnect.api.service.UserService;
import com.evconnect.api.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(userService.findUserById(userDetails.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, String> profileData) {
        return ResponseEntity.ok(userService.updateProfile(
                userDetails.getId(), 
                profileData.get("username"), 
                profileData.get("email")
        ));
    }

    @PostMapping("/me/password")
    public ResponseEntity<?> changeMyPassword(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, String> passwordData) {
        userService.changePassword(
                userDetails.getId(), 
                passwordData.get("oldPassword"), 
                passwordData.get("newPassword")
        );
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
