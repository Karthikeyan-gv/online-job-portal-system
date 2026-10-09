package com.example.jobportal.service.impl;

import com.example.jobportal.entity.Notification;
import com.example.jobportal.entity.User;
import com.example.jobportal.exception.ResourceNotFoundException;
import com.example.jobportal.repository.NotificationRepository;
import com.example.jobportal.service.AuthService;
import com.example.jobportal.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuthService authService;

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications() {
        User user = authService.getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Notification> getUserNotifications(Pageable pageable) {
        User user = authService.getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        User user = authService.getCurrentUser();
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        User user = authService.getCurrentUser();
        List<Notification> unreadList = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        for (Notification n : unreadList) {
            if (!n.isRead()) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        }
    }
}
