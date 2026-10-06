package com.example.jobportal.service;

import com.example.jobportal.entity.Job;
import java.util.List;

public interface RecommendationService {
    List<Job> getRecommendedJobsForCurrentSeeker();
}
