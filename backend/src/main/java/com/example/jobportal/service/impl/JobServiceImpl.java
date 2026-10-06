package com.example.jobportal.service.impl;

import com.example.jobportal.dto.request.JobRequest;
import com.example.jobportal.entity.*;
import com.example.jobportal.exception.ResourceNotFoundException;
import com.example.jobportal.exception.UnauthorizedException;
import com.example.jobportal.repository.*;
import com.example.jobportal.service.AuthService;
import com.example.jobportal.service.JobService;
import com.example.jobportal.specification.JobSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobCategoryRepository categoryRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private EmployerProfileRepository employerProfileRepository;

    @Autowired
    private AuthService authService;

    @Override
    public Page<Job> searchJobs(String keyword, String location, JobType jobType, WorkMode workMode, Long categoryId, Double minSalary, JobStatus status, Pageable pageable) {
        JobStatus targetStatus = (status != null) ? status : JobStatus.ACTIVE;
        Specification<Job> spec = JobSpecification.filterJobs(keyword, location, jobType, workMode, categoryId, minSalary, targetStatus);
        return jobRepository.findAll(spec, pageable);
    }

    @Override
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    @Override
    @Transactional
    public Job createJob(JobRequest request) {
        User user = authService.getCurrentUser();
        EmployerProfile profile = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new UnauthorizedException("Only registered employers can post jobs"));

        if (profile.getCompany() == null) {
            throw new ResourceNotFoundException("Please create a Company Profile before posting a job");
        }

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setResponsibilities(request.getResponsibilities());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setWorkMode(request.getWorkMode());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setEducationRequired(request.getEducationRequired());
        job.setVacancies(request.getVacancies() != null ? request.getVacancies() : 1);
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setCompany(profile.getCompany());

        // Default: If created by Employer -> PENDING or ACTIVE (Let's auto-approve for smoother demo, but keep status field)
        job.setStatus(JobStatus.ACTIVE);

        if (request.getCategoryId() != null) {
            JobCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            job.setCategory(category);
        }

        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            Set<Skill> skills = new HashSet<>(skillRepository.findAllById(request.getSkillIds()));
            job.setSkills(skills);
        }

        return jobRepository.save(job);
    }

    @Override
    @Transactional
    public Job updateJob(Long id, JobRequest request) {
        Job job = getJobById(id);
        User user = authService.getCurrentUser();

        if (user.getRole().getName() != RoleName.ROLE_ADMIN) {
            EmployerProfile profile = employerProfileRepository.findByUser(user)
                    .orElseThrow(() -> new UnauthorizedException("Unauthorized action"));
            if (profile.getCompany() == null || !job.getCompany().getId().equals(profile.getCompany().getId())) {
                throw new UnauthorizedException("You can only edit jobs posted by your company");
            }
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setResponsibilities(request.getResponsibilities());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setWorkMode(request.getWorkMode());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setEducationRequired(request.getEducationRequired());
        job.setVacancies(request.getVacancies());
        job.setApplicationDeadline(request.getApplicationDeadline());

        if (request.getCategoryId() != null) {
            JobCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            job.setCategory(category);
        }

        if (request.getSkillIds() != null) {
            Set<Skill> skills = new HashSet<>(skillRepository.findAllById(request.getSkillIds()));
            job.setSkills(skills);
        }

        return jobRepository.save(job);
    }

    @Override
    @Transactional
    public void deleteJob(Long id) {
        Job job = getJobById(id);
        jobRepository.delete(job);
    }

    @Override
    @Transactional
    public Job toggleJobStatus(Long id) {
        Job job = getJobById(id);
        if (job.getStatus() == JobStatus.ACTIVE) {
            job.setStatus(JobStatus.CLOSED);
        } else {
            job.setStatus(JobStatus.ACTIVE);
        }
        return jobRepository.save(job);
    }

    @Override
    @Transactional
    public Job approveJob(Long id) {
        Job job = getJobById(id);
        job.setStatus(JobStatus.ACTIVE);
        return jobRepository.save(job);
    }

    @Override
    @Transactional
    public Job rejectJob(Long id) {
        Job job = getJobById(id);
        job.setStatus(JobStatus.REJECTED);
        return jobRepository.save(job);
    }

    @Override
    public Page<Job> getEmployerJobs(Pageable pageable) {
        User user = authService.getCurrentUser();
        if (user.getRole() != null && user.getRole().getName() == RoleName.ROLE_ADMIN) {
            return jobRepository.findAll(pageable);
        }
        EmployerProfile profile = employerProfileRepository.findByUser(user).orElse(null);
        if (profile == null || profile.getCompany() == null) {
            return jobRepository.findAll(pageable);
        }
        Page<Job> companyJobs = jobRepository.findByCompanyId(profile.getCompany().getId(), pageable);
        if (!companyJobs.hasContent()) {
            return jobRepository.findAll(pageable);
        }
        return companyJobs;
    }
}
