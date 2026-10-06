package com.example.jobportal.repository;

import com.example.jobportal.entity.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobCategoryRepository extends JpaRepository<JobCategory, Long> {
    Optional<JobCategory> findByName(String name);
}
