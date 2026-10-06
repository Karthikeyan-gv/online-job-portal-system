package com.example.jobportal.controller;

import com.example.jobportal.dto.response.ApiResponse;
import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobStatus;
import com.example.jobportal.entity.JobType;
import com.example.jobportal.entity.WorkMode;
import com.example.jobportal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Job>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) WorkMode workMode,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Job> jobs = jobService.searchJobs(keyword, location, jobType, workMode, categoryId, minSalary, status, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Jobs retrieved successfully", jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> getJobById(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Job details retrieved", job));
    }
}
