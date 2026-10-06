package com.example.jobportal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "educations")
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seeker_id", nullable = false)
    private JobSeekerProfile seekerProfile;

    private String degree;
    private String institution;
    private String fieldOfStudy;
    private Integer startYear;
    private Integer endYear;
    private String grade;

    public Education() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JobSeekerProfile getSeekerProfile() { return seekerProfile; }
    public void setSeekerProfile(JobSeekerProfile seekerProfile) { this.seekerProfile = seekerProfile; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getFieldOfStudy() { return fieldOfStudy; }
    public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }

    public Integer getStartYear() { return startYear; }
    public void setStartYear(Integer startYear) { this.startYear = startYear; }

    public Integer getEndYear() { return endYear; }
    public void setEndYear(Integer endYear) { this.endYear = endYear; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}
