package com.example.jobportal.service.impl;

import com.example.jobportal.dto.request.CompanyRequest;
import com.example.jobportal.entity.Company;
import com.example.jobportal.entity.EmployerProfile;
import com.example.jobportal.entity.User;
import com.example.jobportal.exception.ResourceNotFoundException;
import com.example.jobportal.exception.UnauthorizedException;
import com.example.jobportal.repository.CompanyRepository;
import com.example.jobportal.repository.EmployerProfileRepository;
import com.example.jobportal.service.AuthService;
import com.example.jobportal.service.CompanyService;
import com.example.jobportal.util.FileStorageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private EmployerProfileRepository employerProfileRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private FileStorageUtil fileStorageUtil;

    @Override
    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    @Override
    public Page<Company> getAllCompanies(Pageable pageable) {
        return companyRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public Company createOrUpdateEmployerCompany(CompanyRequest request) {
        User user = authService.getCurrentUser();
        EmployerProfile profile = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new UnauthorizedException("Only registered employers can update company profile"));

        Company company = profile.getCompany();
        if (company == null) {
            company = new Company();
        }

        company.setName(request.getName());
        company.setIndustry(request.getIndustry());
        company.setCompanySize(request.getCompanySize());
        company.setFoundedYear(request.getFoundedYear());
        company.setWebsite(request.getWebsite());
        company.setEmail(request.getEmail());
        company.setPhone(request.getPhone());
        company.setDescription(request.getDescription());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setCountry(request.getCountry());

        Company savedCompany = companyRepository.save(company);
        profile.setCompany(savedCompany);
        employerProfileRepository.save(profile);

        return savedCompany;
    }

    @Override
    @Transactional
    public Company uploadCompanyLogo(Long companyId, MultipartFile file) {
        Company company = getCompanyById(companyId);
        String logoPath = fileStorageUtil.storeFile(file, "logos");
        company.setLogo(logoPath);
        return companyRepository.save(company);
    }
}
