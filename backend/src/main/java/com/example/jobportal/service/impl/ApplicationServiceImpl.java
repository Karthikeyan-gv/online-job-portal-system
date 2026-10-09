package com.example.jobportal.service.impl;

import com.example.jobportal.dto.request.ApplicationRequest;
import com.example.jobportal.entity.*;
import com.example.jobportal.exception.DuplicateResourceException;
import com.example.jobportal.exception.ResourceNotFoundException;
import com.example.jobportal.exception.UnauthorizedException;
import com.example.jobportal.repository.*;
import com.example.jobportal.service.EmailService;
import com.example.jobportal.service.ApplicationService;
import com.example.jobportal.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private ApplicationStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobSeekerProfileRepository seekerProfileRepository;

    @Autowired
    private EmployerProfileRepository employerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public JobApplication applyForJob(ApplicationRequest request) {
        User user = authService.getCurrentUser();
        JobSeekerProfile seeker = seekerProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    JobSeekerProfile newProf = new JobSeekerProfile();
                    newProf.setUser(user);
                    newProf.setFirstName(user.getEmail().split("@")[0]);
                    newProf.setLastName("");
                    return seekerProfileRepository.save(newProf);
                });

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        Resume resume = null;
        if (request.getResumeId() != null) {
            resume = resumeRepository.findById(request.getResumeId()).orElse(null);
        }
        if (resume == null) {
            resume = resumeRepository.findBySeekerProfileAndIsPrimaryTrue(seeker).orElse(null);
        }

        // Check if an application already exists for this candidate & job
        Optional<JobApplication> existingAppOpt = applicationRepository.findByJobAndSeekerProfile(job, seeker);
        if (existingAppOpt.isPresent()) {
            JobApplication existingApp = existingAppOpt.get();
            if (resume != null) {
                existingApp.setResume(resume);
            }
            if (request.getCoverLetter() != null && !request.getCoverLetter().trim().isEmpty()) {
                existingApp.setCoverLetter(request.getCoverLetter());
            }
            existingApp.setCurrentStatus(ApplicationStatus.APPLIED);
            JobApplication updated = applicationRepository.save(existingApp);

            statusHistoryRepository.save(new ApplicationStatusHistory(
                    updated, ApplicationStatus.APPLIED, "Application updated/re-submitted", user
            ));

            sendNotifications(user, seeker, job, updated);
            return updated;
        }

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setSeekerProfile(seeker);
        application.setResume(resume);
        application.setCoverLetter(request.getCoverLetter());
        application.setCurrentStatus(ApplicationStatus.APPLIED);

        JobApplication savedApp = applicationRepository.save(application);

        // Record initial status history
        ApplicationStatusHistory history = new ApplicationStatusHistory(
                savedApp, ApplicationStatus.APPLIED, "Application submitted", user
        );
        statusHistoryRepository.save(history);

        sendNotifications(user, seeker, job, savedApp);

        return savedApp;
    }

    private void sendNotifications(User user, JobSeekerProfile seeker, Job job, JobApplication application) {
        // 1. Notify candidate of successful application
        Notification candidateNotif = new Notification(
                user,
                "Application Submitted Successfully",
                "Your application for " + job.getTitle() + " at " + (job.getCompany() != null ? job.getCompany().getName() : "Company") + " has been submitted.",
                "APPLICATION_CONFIRMATION"
        );
        notificationRepository.save(candidateNotif);

        // Send Email to candidate
        emailService.sendApplicationSubmittedEmailToSeeker(application);

        // 2. Notify ONLY employer(s) associated with the specific job's company & admins
        Long jobCompanyId = (job.getCompany() != null) ? job.getCompany().getId() : null;

        List<User> targetRecipients = userRepository.findAll().stream()
                .filter(u -> {
                    if (u.getRole().getName() == RoleName.ROLE_ADMIN) {
                        return true;
                    }
                    if (u.getRole().getName() == RoleName.ROLE_EMPLOYER) {
                        if (jobCompanyId == null) return true;
                        Optional<EmployerProfile> empProf = employerProfileRepository.findByUser(u);
                        return empProf.isPresent() && empProf.get().getCompany() != null && empProf.get().getCompany().getId().equals(jobCompanyId);
                    }
                    return false;
                })
                .toList();

        for (User empUser : targetRecipients) {
            Notification empNotif = new Notification(
                    empUser,
                    "New Job Candidate Application",
                    (seeker.getFirstName() != null ? seeker.getFirstName() : "Candidate") + " applied for " + job.getTitle(),
                    "NEW_APPLICATION"
            );
            notificationRepository.save(empNotif);

            // Send Email to employer
            emailService.sendNewApplicationEmailToEmployer(application, empUser);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplication> getSeekerApplications(Pageable pageable) {
        User user = authService.getCurrentUser();
        JobSeekerProfile seeker = seekerProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    JobSeekerProfile p = new JobSeekerProfile();
                    p.setUser(user);
                    return seekerProfileRepository.save(p);
                });
        return applicationRepository.findBySeekerProfile(seeker, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplication> getEmployerApplications(Long jobId, Pageable pageable) {
        User user = authService.getCurrentUser();
        if (jobId != null) {
            return applicationRepository.findByJobId(jobId, pageable);
        }

        // If admin, return all applications across platform
        if (user.getRole() != null && user.getRole().getName() == RoleName.ROLE_ADMIN) {
            return applicationRepository.findAllByOrderByAppliedAtDesc(pageable);
        }

        Optional<EmployerProfile> employerProfileOpt = employerProfileRepository.findByUser(user);
        if (employerProfileOpt.isPresent() && employerProfileOpt.get().getCompany() != null) {
            Long companyId = employerProfileOpt.get().getCompany().getId();
            Page<JobApplication> companyApps = applicationRepository.findByJobCompanyId(companyId, pageable);
            if (companyApps.hasContent()) {
                return companyApps;
            }
        }

        return applicationRepository.findAllByOrderByAppliedAtDesc(pageable);
    }

    @Override
    @Transactional
    public JobApplication updateApplicationStatus(Long applicationId, ApplicationStatus status, String remarks) {
        User currentUser = authService.getCurrentUser();
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        application.setCurrentStatus(status);
        JobApplication updated = applicationRepository.save(application);

        ApplicationStatusHistory history = new ApplicationStatusHistory(
                updated, status, remarks != null ? remarks : "Status updated to " + status, currentUser
        );
        statusHistoryRepository.save(history);

        // Send notification to Candidate
        if (application.getSeekerProfile() != null && application.getSeekerProfile().getUser() != null) {
            Notification notification = new Notification(
                    application.getSeekerProfile().getUser(),
                    "Application Stage Updated",
                    "Your application for " + application.getJob().getTitle() + " has been updated to stage: " + status.name(),
                    "APPLICATION_STATUS"
            );
            notificationRepository.save(notification);

            // Send Email to candidate for status update
            emailService.sendApplicationStatusUpdateEmail(updated);
        }

        return updated;
    }

    @Override
    @Transactional
    public void withdrawApplication(Long applicationId) {
        User user = authService.getCurrentUser();
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        application.setCurrentStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);

        statusHistoryRepository.save(new ApplicationStatusHistory(
                application, ApplicationStatus.WITHDRAWN, "Withdrawn by candidate", user
        ));
    }

    @Override
    public List<ApplicationStatusHistory> getStatusHistory(Long applicationId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        return statusHistoryRepository.findByApplicationOrderByChangedAtAsc(application);
    }
}
