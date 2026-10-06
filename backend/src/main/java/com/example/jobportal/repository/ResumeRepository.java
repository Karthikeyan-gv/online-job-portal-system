package com.example.jobportal.repository;

import com.example.jobportal.entity.JobSeekerProfile;
import com.example.jobportal.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findBySeekerProfile(JobSeekerProfile seekerProfile);
    Optional<Resume> findBySeekerProfileAndIsPrimaryTrue(JobSeekerProfile seekerProfile);
}
