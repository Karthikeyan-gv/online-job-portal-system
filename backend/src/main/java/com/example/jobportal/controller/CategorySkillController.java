package com.example.jobportal.controller;

import com.example.jobportal.dto.response.ApiResponse;
import com.example.jobportal.entity.JobCategory;
import com.example.jobportal.entity.Skill;
import com.example.jobportal.repository.JobCategoryRepository;
import com.example.jobportal.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CategorySkillController {

    @Autowired
    private JobCategoryRepository categoryRepository;

    @Autowired
    private SkillRepository skillRepository;

    @GetMapping("/api/categories")
    public ResponseEntity<ApiResponse<List<JobCategory>>> getCategories() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Categories retrieved", categoryRepository.findAll()));
    }

    @GetMapping("/api/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkills() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Skills retrieved", skillRepository.findAll()));
    }
}
