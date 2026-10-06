package com.example.jobportal.service.impl;

import com.example.jobportal.entity.JobSeekerProfile;
import com.example.jobportal.entity.Resume;
import com.example.jobportal.exception.InvalidFileException;
import com.example.jobportal.exception.ResourceNotFoundException;
import com.example.jobportal.repository.ResumeRepository;
import com.example.jobportal.service.ProfileService;
import com.example.jobportal.service.ResumeService;
import com.example.jobportal.util.FileStorageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private FileStorageUtil fileStorageUtil;

    @Override
    @Transactional
    public Resume uploadResume(MultipartFile file, boolean setPrimary) {
        JobSeekerProfile profile = profileService.getJobSeekerProfile();

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.contains("pdf") && !contentType.contains("msword") && !contentType.contains("officedocument"))) {
            throw new InvalidFileException("Invalid file format. Allowed formats: PDF, DOC, DOCX");
        }

        String filePath = fileStorageUtil.storeFile(file, "resumes");

        List<Resume> existingResumes = resumeRepository.findBySeekerProfile(profile);
        boolean isFirst = existingResumes.isEmpty();

        Resume resume = new Resume();
        resume.setSeekerProfile(profile);
        resume.setFileName(file.getOriginalFilename());
        resume.setFilePath(filePath);
        resume.setFileType(contentType);
        resume.setFileSize(file.getSize());
        resume.setPrimary(setPrimary || isFirst);

        if (setPrimary && !isFirst) {
            existingResumes.forEach(r -> {
                r.setPrimary(false);
                resumeRepository.save(r);
            });
        }

        return resumeRepository.save(resume);
    }

    @Override
    public List<Resume> getSeekerResumes() {
        JobSeekerProfile profile = profileService.getJobSeekerProfile();
        return resumeRepository.findBySeekerProfile(profile);
    }

    @Override
    public Resume getResumeById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + id));
    }

    @Override
    @Transactional
    public void deleteResume(Long id) {
        Resume resume = getResumeById(id);
        resumeRepository.delete(resume);
    }

    @Override
    @Transactional
    public Resume setPrimaryResume(Long id) {
        JobSeekerProfile profile = profileService.getJobSeekerProfile();
        List<Resume> resumes = resumeRepository.findBySeekerProfile(profile);
        Resume target = null;
        for (Resume r : resumes) {
            if (r.getId().equals(id)) {
                r.setPrimary(true);
                target = r;
            } else {
                r.setPrimary(false);
            }
            resumeRepository.save(r);
        }
        if (target == null) {
            throw new ResourceNotFoundException("Resume not found for candidate");
        }
        return target;
    }
}
