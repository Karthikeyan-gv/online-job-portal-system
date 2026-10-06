package com.example.jobportal.repository;

import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobSeekerProfile;
import com.example.jobportal.entity.SavedJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    Optional<SavedJob> findBySeekerProfileAndJob(JobSeekerProfile seekerProfile, Job job);
    boolean existsBySeekerProfileAndJob(JobSeekerProfile seekerProfile, Job job);
    Page<SavedJob> findBySeekerProfile(JobSeekerProfile seekerProfile, Pageable pageable);
    void deleteBySeekerProfileAndJob(JobSeekerProfile seekerProfile, Job job);
}
