package com.example.jobportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_jobs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"seeker_id", "job_id"})
})
public class SavedJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seeker_id", nullable = false)
    private JobSeekerProfile seekerProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    private LocalDateTime savedAt;

    public SavedJob() {}

    public SavedJob(JobSeekerProfile seekerProfile, Job job) {
        this.seekerProfile = seekerProfile;
        this.job = job;
    }

    @PrePersist
    protected void onCreate() {
        savedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JobSeekerProfile getSeekerProfile() { return seekerProfile; }
    public void setSeekerProfile(JobSeekerProfile seekerProfile) { this.seekerProfile = seekerProfile; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public LocalDateTime getSavedAt() { return savedAt; }
    public void setSavedAt(LocalDateTime savedAt) { this.savedAt = savedAt; }
}
