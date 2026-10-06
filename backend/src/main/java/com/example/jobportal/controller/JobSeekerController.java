package com.example.jobportal.controller;

import com.example.jobportal.dto.request.ApplicationRequest;
import com.example.jobportal.dto.response.ApiResponse;
import com.example.jobportal.entity.*;
import com.example.jobportal.repository.JobRepository;
import com.example.jobportal.repository.SavedJobRepository;
import com.example.jobportal.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/jobseeker")
@PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
public class JobSeekerController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private JobRepository jobRepository;

    // --- PROFILE ---
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<JobSeekerProfile>> getProfile() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile retrieved", profileService.getJobSeekerProfile()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<JobSeekerProfile>> updateProfile(@RequestBody JobSeekerProfile profile) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated", profileService.updateJobSeekerProfile(profile)));
    }

    @PostMapping("/photo")
    public ResponseEntity<ApiResponse<JobSeekerProfile>> uploadPhoto(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Photo uploaded", profileService.uploadProfilePhoto(file)));
    }

    // --- RESUMES ---
    @GetMapping("/resumes")
    public ResponseEntity<ApiResponse<List<Resume>>> getResumes() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Resumes retrieved", resumeService.getSeekerResumes()));
    }

    @PostMapping("/resumes")
    public ResponseEntity<ApiResponse<Resume>> uploadResume(@RequestParam("file") MultipartFile file, @RequestParam(defaultValue = "false") boolean isPrimary) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Resume uploaded", resumeService.uploadResume(file, isPrimary)));
    }

    @DeleteMapping("/resumes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Resume deleted"));
    }

    @PutMapping("/resumes/{id}/primary")
    public ResponseEntity<ApiResponse<Resume>> setPrimaryResume(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Primary resume set", resumeService.setPrimaryResume(id)));
    }

    // --- EDUCATION & EXPERIENCE ---
    @PostMapping("/education")
    public ResponseEntity<ApiResponse<Education>> addEducation(@RequestBody Education edu) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Education added", profileService.addEducation(edu)));
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(@PathVariable Long id) {
        profileService.deleteEducation(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Education deleted"));
    }

    @PostMapping("/experience")
    public ResponseEntity<ApiResponse<Experience>> addExperience(@RequestBody Experience exp) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Experience added", profileService.addExperience(exp)));
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable Long id) {
        profileService.deleteExperience(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Experience deleted"));
    }

    // --- APPLICATIONS ---
    @PostMapping("/applications")
    public ResponseEntity<ApiResponse<JobApplication>> applyForJob(@Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Application submitted successfully", applicationService.applyForJob(request)));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<Page<JobApplication>>> getApplications(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Applications retrieved", applicationService.getSeekerApplications(PageRequest.of(page, size))));
    }

    @DeleteMapping("/applications/{id}/withdraw")
    public ResponseEntity<ApiResponse<Void>> withdrawApplication(@PathVariable Long id) {
        applicationService.withdrawApplication(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Application withdrawn"));
    }

    @GetMapping("/applications/{id}/history")
    public ResponseEntity<ApiResponse<List<ApplicationStatusHistory>>> getApplicationHistory(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Status history retrieved", applicationService.getStatusHistory(id)));
    }

    // --- SAVED JOBS ---
    @PostMapping("/saved-jobs/{jobId}")
    public ResponseEntity<ApiResponse<Void>> saveJob(@PathVariable Long jobId) {
        JobSeekerProfile seeker = profileService.getJobSeekerProfile();
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        if (!savedJobRepository.existsBySeekerProfileAndJob(seeker, job)) {
            savedJobRepository.save(new SavedJob(seeker, job));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Job saved successfully"));
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    public ResponseEntity<ApiResponse<Void>> removeSavedJob(@PathVariable Long jobId) {
        JobSeekerProfile seeker = profileService.getJobSeekerProfile();
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        savedJobRepository.deleteBySeekerProfileAndJob(seeker, job);
        return ResponseEntity.ok(new ApiResponse<>(true, "Job removed from saved jobs"));
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<ApiResponse<Page<SavedJob>>> getSavedJobs(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        JobSeekerProfile seeker = profileService.getJobSeekerProfile();
        Page<SavedJob> saved = savedJobRepository.findBySeekerProfile(seeker, PageRequest.of(page, size));
        return ResponseEntity.ok(new ApiResponse<>(true, "Saved jobs retrieved", saved));
    }

    // --- RECOMMENDATIONS ---
    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<Job>>> getRecommendations() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Recommended jobs retrieved", recommendationService.getRecommendedJobsForCurrentSeeker()));
    }
}
