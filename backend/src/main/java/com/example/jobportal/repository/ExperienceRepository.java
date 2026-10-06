package com.example.jobportal.repository;

import com.example.jobportal.entity.Experience;
import com.example.jobportal.entity.JobSeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findBySeekerProfile(JobSeekerProfile seekerProfile);
}
