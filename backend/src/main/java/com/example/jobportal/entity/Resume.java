package com.example.jobportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seeker_id", nullable = false)
    private JobSeekerProfile seekerProfile;

    private String fileName;
    private String filePath;
    private String fileType;
    private Long fileSize;
    private boolean isPrimary;

    private LocalDateTime uploadedAt;

    public Resume() {}

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public JobSeekerProfile getSeekerProfile() { return seekerProfile; }
    public void setSeekerProfile(JobSeekerProfile seekerProfile) { this.seekerProfile = seekerProfile; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean isPrimary) { this.isPrimary = isPrimary; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
