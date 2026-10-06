package com.example.jobportal.service.impl;

import com.example.jobportal.dto.request.LoginRequest;
import com.example.jobportal.dto.request.RegisterRequest;
import com.example.jobportal.dto.response.JwtResponse;
import com.example.jobportal.entity.*;
import com.example.jobportal.exception.DuplicateResourceException;
import com.example.jobportal.exception.ResourceNotFoundException;
import com.example.jobportal.repository.*;
import com.example.jobportal.security.JwtTokenProvider;
import com.example.jobportal.security.UserDetailsImpl;
import com.example.jobportal.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JobSeekerProfileRepository jobSeekerProfileRepository;

    @Autowired
    private EmployerProfileRepository employerProfileRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String roleStr = userDetails.getAuthorities().stream()
                .findFirst().map(item -> item.getAuthority()).orElse("ROLE_JOB_SEEKER");

        String name = userDetails.getEmail();

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getEmail(), roleStr, name);
    }

    @Override
    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Error: Email is already in use!");
        }

        RoleName roleName = RoleName.ROLE_JOB_SEEKER;
        if ("EMPLOYER".equalsIgnoreCase(request.getRole()) || "ROLE_EMPLOYER".equalsIgnoreCase(request.getRole())) {
            roleName = RoleName.ROLE_EMPLOYER;
        } else if ("ADMIN".equalsIgnoreCase(request.getRole()) || "ROLE_ADMIN".equalsIgnoreCase(request.getRole())) {
            roleName = RoleName.ROLE_ADMIN;
        }

        final RoleName targetRoleName = roleName;
        Role role = roleRepository.findByName(targetRoleName)
                .orElseGet(() -> roleRepository.save(new Role(targetRoleName)));

        User user = new User(request.getEmail(), passwordEncoder.encode(request.getPassword()), role);
        User savedUser = userRepository.save(user);

        if (roleName == RoleName.ROLE_JOB_SEEKER) {
            JobSeekerProfile profile = new JobSeekerProfile();
            profile.setUser(savedUser);
            profile.setFirstName(request.getFirstName() != null ? request.getFirstName() : "Seeker");
            profile.setLastName(request.getLastName() != null ? request.getLastName() : "");
            profile.setPhone(request.getPhone());
            jobSeekerProfileRepository.save(profile);
        } else if (roleName == RoleName.ROLE_EMPLOYER) {
            EmployerProfile profile = new EmployerProfile();
            profile.setUser(savedUser);
            profile.setFirstName(request.getFirstName() != null ? request.getFirstName() : "Employer");
            profile.setLastName(request.getLastName() != null ? request.getLastName() : "");
            profile.setPhone(request.getPhone());

            if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
                Company company = companyRepository.findByName(request.getCompanyName().trim())
                        .orElseGet(() -> {
                            Company newComp = new Company();
                            newComp.setName(request.getCompanyName().trim());
                            return companyRepository.save(newComp);
                        });
                profile.setCompany(company);
            }
            employerProfileRepository.save(profile);
        }

        return savedUser;
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
