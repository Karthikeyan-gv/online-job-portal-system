package com.example.jobportal.repository;

import com.example.jobportal.entity.Company;
import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    Page<Job> findByStatus(JobStatus status, Pageable pageable);
    List<Job> findByCompany(Company company);
    Page<Job> findByCompanyId(Long companyId, Pageable pageable);
    long countByStatus(JobStatus status);
}
