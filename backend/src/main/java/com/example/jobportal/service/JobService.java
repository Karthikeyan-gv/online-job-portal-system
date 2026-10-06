package com.example.jobportal.service;

import com.example.jobportal.dto.request.JobRequest;
import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobStatus;
import com.example.jobportal.entity.JobType;
import com.example.jobportal.entity.WorkMode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobService {
    Page<Job> searchJobs(String keyword, String location, JobType jobType, WorkMode workMode, Long categoryId, Double minSalary, JobStatus status, Pageable pageable);
    Job getJobById(Long id);
    Job createJob(JobRequest request);
    Job updateJob(Long id, JobRequest request);
    void deleteJob(Long id);
    Job toggleJobStatus(Long id);
    Job approveJob(Long id);
    Job rejectJob(Long id);
    Page<Job> getEmployerJobs(Pageable pageable);
}
