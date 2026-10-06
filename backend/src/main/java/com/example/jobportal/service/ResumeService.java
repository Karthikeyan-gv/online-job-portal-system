package com.example.jobportal.service;

import com.example.jobportal.entity.Resume;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeService {
    Resume uploadResume(MultipartFile file, boolean setPrimary);
    List<Resume> getSeekerResumes();
    Resume getResumeById(Long id);
    void deleteResume(Long id);
    Resume setPrimaryResume(Long id);
}
