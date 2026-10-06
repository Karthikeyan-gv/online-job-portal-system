package com.example.jobportal.controller;

import com.example.jobportal.dto.request.LoginRequest;
import com.example.jobportal.dto.request.RegisterRequest;
import com.example.jobportal.dto.response.ApiResponse;
import com.example.jobportal.dto.response.JwtResponse;
import com.example.jobportal.entity.User;
import com.example.jobportal.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "User registered successfully", user));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(new ApiResponse<>(true, "Current user retrieved", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully"));
    }
}
