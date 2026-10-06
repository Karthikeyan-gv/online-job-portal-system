package com.example.jobportal.controller;

import com.example.jobportal.dto.response.ApiResponse;
import com.example.jobportal.dto.response.DashboardStatsResponse;
import com.example.jobportal.entity.*;
import com.example.jobportal.service.AdminService;
import com.example.jobportal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JobService jobService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard stats retrieved", adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<User>>> getAllUsers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Users retrieved", adminService.getAllUsers(PageRequest.of(page, size))));
    }

    @PutMapping("/users/{id}/toggle-block")
    public ResponseEntity<ApiResponse<User>> toggleUserBlock(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "User status updated", adminService.toggleUserBlockStatus(id)));
    }

    @GetMapping("/jobs/pending")
    public ResponseEntity<ApiResponse<Page<Job>>> getPendingJobs(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending jobs retrieved", jobService.searchJobs(null, null, null, null, null, null, JobStatus.PENDING, PageRequest.of(page, size))));
    }

    @PutMapping("/jobs/{id}/approve")
    public ResponseEntity<ApiResponse<Job>> approveJob(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Job approved successfully", jobService.approveJob(id)));
    }

    @PutMapping("/jobs/{id}/reject")
    public ResponseEntity<ApiResponse<Job>> rejectJob(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Job rejected successfully", jobService.rejectJob(id)));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<JobCategory>> createCategory(@RequestBody JobCategory category) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Category created", adminService.createCategory(category)));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Category deleted"));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<Skill>> createSkill(@RequestBody Skill skill) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Skill created", adminService.createSkill(skill)));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        adminService.deleteSkill(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Skill deleted"));
    }
}
