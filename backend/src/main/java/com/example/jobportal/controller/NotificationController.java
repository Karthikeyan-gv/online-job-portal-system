package com.example.jobportal.controller;

import com.example.jobportal.dto.response.ApiResponse;
import com.example.jobportal.entity.Notification;
import com.example.jobportal.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Notifications retrieved", notificationService.getUserNotifications()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Unread count retrieved", notificationService.getUnreadCount()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Notification marked as read"));
    }
}
