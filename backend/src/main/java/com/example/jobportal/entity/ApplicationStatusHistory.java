package com.example.jobportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "application_status_history")
public class ApplicationStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplication application;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private String remarks;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "updated_by_user_id")
    private User updatedBy;

    private LocalDateTime changedAt;

    public ApplicationStatusHistory() {}

    public ApplicationStatusHistory(JobApplication application, ApplicationStatus status, String remarks, User updatedBy) {
        this.application = application;
        this.status = status;
        this.remarks = remarks;
        this.updatedBy = updatedBy;
        this.changedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (changedAt == null) {
            changedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JobApplication getApplication() { return application; }
    public void setApplication(JobApplication application) { this.application = application; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public User getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(User updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
}
