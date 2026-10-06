package com.example.jobportal.service.impl;

import com.example.jobportal.dto.response.DashboardStatsResponse;
import com.example.jobportal.entity.*;
import com.example.jobportal.exception.ResourceNotFoundException;
import com.example.jobportal.repository.*;
import com.example.jobportal.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobSeekerProfileRepository seekerProfileRepository;

    @Autowired
    private EmployerProfileRepository employerProfileRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private JobCategoryRepository categoryRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalSeekers(seekerProfileRepository.count());
        stats.setTotalEmployers(employerProfileRepository.count());
        stats.setTotalCompanies(companyRepository.count());
        stats.setTotalJobs(jobRepository.count());
        stats.setActiveJobs(jobRepository.countByStatus(JobStatus.ACTIVE));
        stats.setPendingJobs(jobRepository.countByStatus(JobStatus.PENDING));
        stats.setTotalApplications(applicationRepository.count());
        stats.setShortlistedApplications(applicationRepository.countByCurrentStatus(ApplicationStatus.SHORTLISTED));
        stats.setSelectedApplications(applicationRepository.countByCurrentStatus(ApplicationStatus.SELECTED));
        return stats;
    }

    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public User toggleUserBlockStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setBlocked(!user.isBlocked());
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public JobCategory createCategory(JobCategory category) {
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    @Override
    @Transactional
    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    @Override
    @Transactional
    public void deleteSkill(Long skillId) {
        skillRepository.deleteById(skillId);
    }
}
