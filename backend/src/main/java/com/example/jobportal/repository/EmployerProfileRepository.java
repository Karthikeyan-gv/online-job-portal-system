package com.example.jobportal.repository;

import com.example.jobportal.entity.Company;
import com.example.jobportal.entity.EmployerProfile;
import com.example.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, Long> {
    Optional<EmployerProfile> findByUser(User user);
    Optional<EmployerProfile> findByUserId(Long userId);
    List<EmployerProfile> findByCompany(Company company);
}
