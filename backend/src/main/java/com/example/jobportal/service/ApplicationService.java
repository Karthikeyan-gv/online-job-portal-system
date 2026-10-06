package com.example.jobportal.service;

import com.example.jobportal.dto.request.ApplicationRequest;
import com.example.jobportal.entity.ApplicationStatus;
import com.example.jobportal.entity.ApplicationStatusHistory;
import com.example.jobportal.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ApplicationService {
    JobApplication applyForJob(ApplicationRequest request);
    Page<JobApplication> getSeekerApplications(Pageable pageable);
    Page<JobApplication> getEmployerApplications(Long jobId, Pageable pageable);
    JobApplication updateApplicationStatus(Long applicationId, ApplicationStatus status, String remarks);
    void withdrawApplication(Long applicationId);
    List<ApplicationStatusHistory> getStatusHistory(Long applicationId);
}
