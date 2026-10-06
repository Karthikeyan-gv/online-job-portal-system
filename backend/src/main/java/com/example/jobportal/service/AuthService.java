package com.example.jobportal.service;

import com.example.jobportal.dto.request.LoginRequest;
import com.example.jobportal.dto.request.RegisterRequest;
import com.example.jobportal.dto.response.JwtResponse;
import com.example.jobportal.entity.User;

public interface AuthService {
    JwtResponse login(LoginRequest request);
    User register(RegisterRequest request);
    User getCurrentUser();
}
