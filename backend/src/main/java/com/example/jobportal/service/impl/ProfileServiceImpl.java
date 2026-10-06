package com.example.jobportal.service.impl;

import com.example.jobportal.entity.*;
import com.example.jobportal.exception.ResourceNotFoundException;
import com.example.jobportal.repository.*;
import com.example.jobportal.service.AuthService;
import com.example.jobportal.service.ProfileService;
import com.example.jobportal.util.FileStorageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private JobSeekerProfileRepository seekerProfileRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private FileStorageUtil fileStorageUtil;

    @Override
    public JobSeekerProfile getJobSeekerProfile() {
        User user = authService.getCurrentUser();
        return seekerProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    JobSeekerProfile p = new JobSeekerProfile();
                    p.setUser(user);
                    return seekerProfileRepository.save(p);
                });
    }

    @Override
    @Transactional
    public JobSeekerProfile updateJobSeekerProfile(JobSeekerProfile updatedProfile) {
        JobSeekerProfile profile = getJobSeekerProfile();
        profile.setFirstName(updatedProfile.getFirstName());
        profile.setLastName(updatedProfile.getLastName());
        profile.setPhone(updatedProfile.getPhone());
        profile.setDateOfBirth(updatedProfile.getDateOfBirth());
        profile.setGender(updatedProfile.getGender());
        profile.setLocation(updatedProfile.getLocation());
        profile.setAddress(updatedProfile.getAddress());
        profile.setCity(updatedProfile.getCity());
        profile.setState(updatedProfile.getState());
        profile.setCountry(updatedProfile.getCountry());
        profile.setSummary(updatedProfile.getSummary());
        profile.setLinkedinUrl(updatedProfile.getLinkedinUrl());
        profile.setGithubUrl(updatedProfile.getGithubUrl());
        profile.setPortfolioUrl(updatedProfile.getPortfolioUrl());

        return seekerProfileRepository.save(profile);
    }

    @Override
    @Transactional
    public JobSeekerProfile uploadProfilePhoto(MultipartFile file) {
        JobSeekerProfile profile = getJobSeekerProfile();
        String photoPath = fileStorageUtil.storeFile(file, "photos");
        profile.setProfilePhoto(photoPath);
        return seekerProfileRepository.save(profile);
    }

    @Override
    @Transactional
    public Education addEducation(Education education) {
        JobSeekerProfile profile = getJobSeekerProfile();
        education.setSeekerProfile(profile);
        return educationRepository.save(education);
    }

    @Override
    @Transactional
    public void deleteEducation(Long id) {
        educationRepository.deleteById(id);
    }

    @Override
    public List<Education> getEducations() {
        JobSeekerProfile profile = getJobSeekerProfile();
        return educationRepository.findBySeekerProfile(profile);
    }

    @Override
    @Transactional
    public Experience addExperience(Experience experience) {
        JobSeekerProfile profile = getJobSeekerProfile();
        experience.setSeekerProfile(profile);
        return experienceRepository.save(experience);
    }

    @Override
    @Transactional
    public void deleteExperience(Long id) {
        experienceRepository.deleteById(id);
    }

    @Override
    public List<Experience> getExperiences() {
        JobSeekerProfile profile = getJobSeekerProfile();
        return experienceRepository.findBySeekerProfile(profile);
    }

    @Override
    @Transactional
    public Set<JobSeekerProfile> updateSkills(Set<Long> skillIds) {
        JobSeekerProfile profile = getJobSeekerProfile();
        if (skillIds != null) {
            Set<Skill> skills = new HashSet<>(skillRepository.findAllById(skillIds));
            profile.setSkills(skills);
            seekerProfileRepository.save(profile);
        }
        return null;
    }
}
