package com.example.jobportal.repository;

import com.example.jobportal.entity.ApplicationStatus;
import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobApplication;
import com.example.jobportal.entity.JobSeekerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    Optional<JobApplication> findByJobAndSeekerProfile(Job job, JobSeekerProfile seekerProfile);
    boolean existsByJobAndSeekerProfile(Job job, JobSeekerProfile seekerProfile);
    List<JobApplication> findBySeekerProfile(JobSeekerProfile seekerProfile);
    Page<JobApplication> findBySeekerProfile(JobSeekerProfile seekerProfile, Pageable pageable);
    List<JobApplication> findByJob(Job job);
    Page<JobApplication> findByJobId(Long jobId, Pageable pageable);
    Page<JobApplication> findByJobCompanyId(Long companyId, Pageable pageable);
    Page<JobApplication> findAllByOrderByAppliedAtDesc(Pageable pageable);
    long countByCurrentStatus(ApplicationStatus status);
}
