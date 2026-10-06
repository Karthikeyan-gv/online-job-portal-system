package com.example.jobportal.service;

import com.example.jobportal.entity.Education;
import com.example.jobportal.entity.Experience;
import com.example.jobportal.entity.JobSeekerProfile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

public interface ProfileService {
    JobSeekerProfile getJobSeekerProfile();
    JobSeekerProfile updateJobSeekerProfile(JobSeekerProfile updatedProfile);
    JobSeekerProfile uploadProfilePhoto(MultipartFile file);
    
    Education addEducation(Education education);
    void deleteEducation(Long id);
    List<Education> getEducations();

    Experience addExperience(Experience experience);
    void deleteExperience(Long id);
    List<Experience> getExperiences();

    Set<JobSeekerProfile> updateSkills(Set<Long> skillIds);
}
