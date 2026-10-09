package com.example.jobportal.service.impl;

import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobApplication;
import com.example.jobportal.entity.JobSeekerProfile;
import com.example.jobportal.entity.User;
import com.example.jobportal.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:karthikeyan15786@gmail.com}")
    private String senderEmail;

    @Override
    @Async
    public void sendApplicationSubmittedEmailToSeeker(JobApplication application) {
        if (application == null || application.getSeekerProfile() == null) {
            return;
        }

        JobSeekerProfile seeker = application.getSeekerProfile();
        User candidateUser = seeker.getUser();
        if (candidateUser == null || candidateUser.getEmail() == null) {
            return;
        }

        Job job = application.getJob();
        String jobTitle = (job != null && job.getTitle() != null) ? job.getTitle() : "Position";
        String companyName = (job != null && job.getCompany() != null && job.getCompany().getName() != null)
                ? job.getCompany().getName() : "Company";
        String location = (job != null && job.getLocation() != null) ? job.getLocation() : "N/A";
        String candidateName = (seeker.getFirstName() != null && !seeker.getFirstName().isEmpty())
                ? seeker.getFirstName() : "Candidate";

        String subject = "Job Application Submitted: " + jobTitle + " - Status: " + application.getCurrentStatus();

        StringBuilder text = new StringBuilder();
        text.append("Dear ").append(candidateName).append(",\n\n");
        text.append("Your job application has been successfully submitted!\n\n");
        text.append("=== JOB APPLICATION DETAILS ===\n");
        text.append("Position: ").append(jobTitle).append("\n");
        text.append("Company: ").append(companyName).append("\n");
        text.append("Location: ").append(location).append("\n");
        text.append("Current Status: ").append(application.getCurrentStatus()).append("\n");
        if (application.getAppliedAt() != null) {
            text.append("Applied On: ").append(application.getAppliedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        }
        text.append("\nThank you for applying using our Online Job Portal.\n");
        text.append("We wish you the best of luck with your application process!\n\n");
        text.append("Best regards,\nOnline Job Portal Team");

        sendEmailSafely(candidateUser.getEmail(), subject, text.toString());
    }

    @Override
    @Async
    public void sendNewApplicationEmailToEmployer(JobApplication application, User employerUser) {
        if (application == null || employerUser == null || employerUser.getEmail() == null) {
            return;
        }

        Job job = application.getJob();
        JobSeekerProfile seeker = application.getSeekerProfile();
        String jobTitle = (job != null && job.getTitle() != null) ? job.getTitle() : "Position";
        String candidateName = (seeker != null && seeker.getFirstName() != null && !seeker.getFirstName().isEmpty())
                ? (seeker.getFirstName() + (seeker.getLastName() != null ? " " + seeker.getLastName() : ""))
                : "A candidate";
        String candidateEmail = (seeker != null && seeker.getUser() != null) ? seeker.getUser().getEmail() : "N/A";

        String subject = "New Job Application Received: " + jobTitle + " - Candidate: " + candidateName;

        StringBuilder text = new StringBuilder();
        text.append("Dear Employer,\n\n");
        text.append("A new application has been submitted for your posted position!\n\n");
        text.append("=== APPLICATION SUMMARY ===\n");
        text.append("Job Title: ").append(jobTitle).append("\n");
        text.append("Candidate Name: ").append(candidateName).append("\n");
        text.append("Candidate Email: ").append(candidateEmail).append("\n");
        text.append("Application Status: ").append(application.getCurrentStatus()).append("\n");
        if (application.getAppliedAt() != null) {
            text.append("Applied Date: ").append(application.getAppliedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        }
        text.append("\nPlease log in to your employer dashboard to view full candidate details and manage the application stage in your Recruitment Kanban Pipeline.\n\n");
        text.append("Best regards,\nOnline Job Portal Team");

        sendEmailSafely(employerUser.getEmail(), subject, text.toString());
    }

    @Override
    @Async
    public void sendApplicationStatusUpdateEmail(JobApplication application) {
        if (application == null || application.getSeekerProfile() == null) {
            return;
        }

        JobSeekerProfile seeker = application.getSeekerProfile();
        User candidateUser = seeker.getUser();
        if (candidateUser == null || candidateUser.getEmail() == null) {
            return;
        }

        Job job = application.getJob();
        String jobTitle = (job != null && job.getTitle() != null) ? job.getTitle() : "Position";
        String companyName = (job != null && job.getCompany() != null && job.getCompany().getName() != null)
                ? job.getCompany().getName() : "Company";
        String candidateName = (seeker.getFirstName() != null && !seeker.getFirstName().isEmpty())
                ? seeker.getFirstName() : "Candidate";

        String subject = "Job Application Status Update: " + jobTitle + " - New Status: " + application.getCurrentStatus();

        StringBuilder text = new StringBuilder();
        text.append("Dear ").append(candidateName).append(",\n\n");
        text.append("The status of your job application has been updated.\n\n");
        text.append("=== APPLICATION STATUS UPDATE ===\n");
        text.append("Position: ").append(jobTitle).append("\n");
        text.append("Company: ").append(companyName).append("\n");
        text.append("New Status Stage: ").append(application.getCurrentStatus()).append("\n\n");
        text.append("Log in to your Job Seeker account to view full timeline status updates.\n\n");
        text.append("Best regards,\nOnline Job Portal Team");

        sendEmailSafely(candidateUser.getEmail(), subject, text.toString());
    }

    private void sendEmailSafely(String recipient, String subject, String body) {
        if (mailSender == null) {
            logger.warn("JavaMailSender bean is not present. Skipping email dispatch to {}", recipient);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            logger.info("Successfully sent notification email to: {} with subject: {}", recipient, subject);
        } catch (Exception e) {
            logger.warn("Unable to send email to {}: {}. Note: Set MAIL_PASSWORD environment variable for active Gmail SMTP dispatch.", recipient, e.getMessage());
        }
    }
}
