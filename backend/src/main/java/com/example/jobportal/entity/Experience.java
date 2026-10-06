package com.example.jobportal.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "experiences")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seeker_id", nullable = false)
    private JobSeekerProfile seekerProfile;

    private String companyName;
    private String jobTitle;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean currentlyWorking;

    @Column(length = 2000)
    private String description;

    public Experience() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JobSeekerProfile getSeekerProfile() { return seekerProfile; }
    public void setSeekerProfile(JobSeekerProfile seekerProfile) { this.seekerProfile = seekerProfile; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public boolean isCurrentlyWorking() { return currentlyWorking; }
    public void setCurrentlyWorking(boolean currentlyWorking) { this.currentlyWorking = currentlyWorking; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
