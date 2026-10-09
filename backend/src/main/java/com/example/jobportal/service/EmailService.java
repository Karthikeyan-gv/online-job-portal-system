package com.example.jobportal.service;

import com.example.jobportal.entity.JobApplication;
import com.example.jobportal.entity.User;

public interface EmailService {
    void sendApplicationSubmittedEmailToSeeker(JobApplication application);
    void sendNewApplicationEmailToEmployer(JobApplication application, User employerUser);
    void sendApplicationStatusUpdateEmail(JobApplication application);
}
