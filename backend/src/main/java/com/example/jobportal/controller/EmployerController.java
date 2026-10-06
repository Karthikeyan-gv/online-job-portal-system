package com.example.jobportal.controller;

import com.example.jobportal.dto.request.CompanyRequest;
import com.example.jobportal.dto.request.JobRequest;
import com.example.jobportal.dto.response.ApiResponse;
import com.example.jobportal.entity.*;
import com.example.jobportal.service.ApplicationService;
import com.example.jobportal.service.CompanyService;
import com.example.jobportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/employer")
@PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
public class EmployerController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private JobService jobService;

    @Autowired
    private ApplicationService applicationService;

    // --- COMPANY ---
    @PostMapping("/company")
    public ResponseEntity<ApiResponse<Company>> saveCompany(@Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Company saved successfully", companyService.createOrUpdateEmployerCompany(request)));
    }

    @PostMapping("/company/{id}/logo")
    public ResponseEntity<ApiResponse<Company>> uploadLogo(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Company logo uploaded", companyService.uploadCompanyLogo(id, file)));
    }

    // --- JOBS ---
    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<Job>> postJob(@Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Job posted successfully", jobService.createJob(request)));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Job>> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Job updated successfully", jobService.updateJob(id, request)));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Job deleted successfully"));
    }

    @PutMapping("/jobs/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Job>> toggleJobStatus(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Job status toggled", jobService.toggleJobStatus(id)));
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<Page<Job>>> getEmployerJobs(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Employer jobs retrieved", jobService.getEmployerJobs(PageRequest.of(page, size))));
    }

    // --- APPLICANTS & RECRUITMENT PIPELINE ---
    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<Page<JobApplication>>> getApplications(
            @RequestParam(required = false) Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Applications retrieved", applicationService.getEmployerApplications(jobId, PageRequest.of(page, size))));
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<ApiResponse<JobApplication>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.get("status");
        String remarks = body.get("remarks");
        ApplicationStatus status = ApplicationStatus.valueOf(statusStr);
        JobApplication updated = applicationService.updateApplicationStatus(id, status, remarks);
        return ResponseEntity.ok(new ApiResponse<>(true, "Candidate status updated to " + status.name(), updated));
    }
}
