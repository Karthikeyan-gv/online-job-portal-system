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

    @Autowired(required = false)
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    @GetMapping("/test-email")
    public ResponseEntity<ApiResponse<String>> testEmail() {
        if (mailSender == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, "JavaMailSender is null"));
        }
        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setFrom("karthikeyan15786@gmail.com");
            message.setTo("karthikeyan15786@gmail.com");
            message.setSubject("Test Email - Job Portal System");
            message.setText("Hello Karthikeyan!\n\nThis is a test notification email from your Online Job Portal system using Google Gmail SMTP.\n\nYour email notification system is working 100% perfectly!");

            mailSender.send(message);
            return ResponseEntity.ok(new ApiResponse<>(true, "Test email sent successfully to karthikeyan15786@gmail.com! Please check your Gmail Inbox and Spam folder."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Email dispatch failed [" + e.getClass().getName() + "]: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully"));
    }
}
