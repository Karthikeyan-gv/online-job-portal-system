package com.example.jobportal.service;

import com.example.jobportal.dto.response.DashboardStatsResponse;
import com.example.jobportal.entity.JobCategory;
import com.example.jobportal.entity.Skill;
import com.example.jobportal.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    DashboardStatsResponse getDashboardStats();
    Page<User> getAllUsers(Pageable pageable);
    User toggleUserBlockStatus(Long userId);
    JobCategory createCategory(JobCategory category);
    void deleteCategory(Long categoryId);
    Skill createSkill(Skill skill);
    void deleteSkill(Long skillId);
}
