package com.example.jobportal.service.impl;

import com.example.jobportal.entity.*;
import com.example.jobportal.repository.JobRepository;
import com.example.jobportal.service.ProfileService;
import com.example.jobportal.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JobRepository jobRepository;

    @Override
    public List<Job> getRecommendedJobsForCurrentSeeker() {
        JobSeekerProfile seeker = profileService.getJobSeekerProfile();
        Set<String> seekerSkills = seeker.getSkills().stream()
                .map(s -> s.getName().toLowerCase())
                .collect(Collectors.toSet());

        String seekerLocation = seeker.getLocation() != null ? seeker.getLocation().toLowerCase() : "";

        List<Job> activeJobs = jobRepository.findByStatus(JobStatus.ACTIVE, PageRequest.of(0, 100)).getContent();

        // Calculate score for each job based on skill overlap & location
        Map<Job, Integer> scoredJobs = new HashMap<>();
        for (Job job : activeJobs) {
            int score = 0;
            for (Skill jobSkill : job.getSkills()) {
                if (seekerSkills.contains(jobSkill.getName().toLowerCase())) {
                    score += 10;
                }
            }
            if (!seekerLocation.isEmpty() && job.getLocation() != null && job.getLocation().toLowerCase().contains(seekerLocation)) {
                score += 5;
            }
            if (score > 0) {
                scoredJobs.put(job, score);
            }
        }

        List<Job> sortedList = scoredJobs.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        if (sortedList.isEmpty()) {
            return activeJobs.stream().limit(6).collect(Collectors.toList());
        }

        return sortedList.stream().limit(10).collect(Collectors.toList());
    }
}
