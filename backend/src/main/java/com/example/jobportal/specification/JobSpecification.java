package com.example.jobportal.specification;

import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobStatus;
import com.example.jobportal.entity.JobType;
import com.example.jobportal.entity.WorkMode;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class JobSpecification {

    public static Specification<Job> filterJobs(
            String keyword,
            String location,
            JobType jobType,
            WorkMode workMode,
            Long categoryId,
            Double minSalary,
            JobStatus status
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate companyMatch = cb.like(cb.lower(root.get("company").get("name")), pattern);
                predicates.add(cb.or(titleMatch, descMatch, companyMatch));
            }

            if (location != null && !location.trim().isEmpty()) {
                String pattern = "%" + location.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("location")), pattern));
            }

            if (jobType != null) {
                predicates.add(cb.equal(root.get("jobType"), jobType));
            }

            if (workMode != null) {
                predicates.add(cb.equal(root.get("workMode"), workMode));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (minSalary != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("salaryMax"), minSalary));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
