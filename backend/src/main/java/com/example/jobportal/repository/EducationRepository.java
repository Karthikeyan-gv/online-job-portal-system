package com.example.jobportal.repository;

import com.example.jobportal.entity.Education;
import com.example.jobportal.entity.JobSeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findBySeekerProfile(JobSeekerProfile seekerProfile);
}
