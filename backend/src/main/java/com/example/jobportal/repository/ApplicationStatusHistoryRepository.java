package com.example.jobportal.repository;

import com.example.jobportal.entity.ApplicationStatusHistory;
import com.example.jobportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, Long> {
    List<ApplicationStatusHistory> findByApplicationOrderByChangedAtAsc(JobApplication application);
}
