package com.example.jobportal.service;

import com.example.jobportal.dto.request.CompanyRequest;
import com.example.jobportal.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface CompanyService {
    Company getCompanyById(Long id);
    Page<Company> getAllCompanies(Pageable pageable);
    Company createOrUpdateEmployerCompany(CompanyRequest request);
    Company uploadCompanyLogo(Long companyId, MultipartFile file);
}
