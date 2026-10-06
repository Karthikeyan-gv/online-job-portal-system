package com.example.jobportal.controller;

import com.example.jobportal.dto.response.ApiResponse;
import com.example.jobportal.entity.ContactMessage;
import com.example.jobportal.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessage>> submitMessage(@RequestBody ContactMessage message) {
        ContactMessage saved = contactMessageRepository.save(message);
        return ResponseEntity.ok(new ApiResponse<>(true, "Message submitted successfully", saved));
    }
}
