package com.example.jobportal.service;

import com.example.jobportal.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    List<Notification> getUserNotifications();
    Page<Notification> getUserNotifications(Pageable pageable);
    long getUnreadCount();
    void markAsRead(Long notificationId);
    void markAllAsRead();
}
