package com.example.jobportal.config;

import com.example.jobportal.entity.*;
import com.example.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobSeekerProfileRepository seekerProfileRepository;

    @Autowired
    private EmployerProfileRepository employerProfileRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobCategoryRepository categoryRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private ApplicationStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedRoles();
        seedCategoriesAndSkills();
        seedUsersAndCompanies();
        seedComprehensiveJobs();
        seedSampleApplications();
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(RoleName.ROLE_JOB_SEEKER));
            roleRepository.save(new Role(RoleName.ROLE_EMPLOYER));
            roleRepository.save(new Role(RoleName.ROLE_ADMIN));
        }
    }

    private void seedCategoriesAndSkills() {
        // Tech Categories
        upsertCategory("Software Development", "BiCodeAlt", "Backend, Frontend, and Full Stack Engineering roles");
        upsertCategory("Data Science & AI", "BiBrain", "Machine Learning, Analytics, Deep Learning & Big Data");
        upsertCategory("Cloud & DevOps", "BiCloud", "AWS, Azure, Docker, Kubernetes & Infrastructure");
        upsertCategory("Cyber Security", "BiShield", "InfoSec, Ethical Hacking & Network Protection");
        upsertCategory("Mobile App Development", "BiMobile", "iOS, Android, React Native & Flutter");
        upsertCategory("Product & UI/UX Design", "BiPalette", "UI/UX Design, Product Management & Graphics");
        upsertCategory("QA & Automation", "BiCheckShield", "Selenium, Cypress, Automated Testing & QA");
        upsertCategory("Database & Analytics", "BiData", "MySQL, PostgreSQL, MongoDB & Data Pipelines");

        // Non-Tech Categories
        upsertCategory("Human Resources & Talent", "BiUserCheck", "Talent Acquisition, People Ops & HR Management");
        upsertCategory("Finance, Banking & Accounting", "BiMoney", "Investment Banking, Financial Analysis, Wealth & Auditing");
        upsertCategory("Digital Marketing & SEO", "BiTrendingUp", "Growth Marketing, Performance Advertising & Content Strategy");
        upsertCategory("Sales & Business Development", "BiTargetLock", "B2B Sales, Enterprise Account Management & Business Expansion");
        upsertCategory("Operations & Project Management", "BiBriefcase", "Agile Project Delivery, Supply Chain & Operations Leadership");
        upsertCategory("Customer Success & Support", "BiSupport", "Client Relationships, Technical Support & Customer Experience");
        upsertCategory("Healthcare & Medical Administration", "BiPlusMedical", "Clinical Operations, Hospital Administration & Health Tech");
        upsertCategory("Content Writing & Communications", "BiEdit", "Corporate Communications, Technical Documentation & Copywriting");

        // Skills
        String[][] skillList = {
            {"Java", "Backend"}, {"Spring Boot", "Backend"}, {"React", "Frontend"}, {"JavaScript", "Frontend"},
            {"MySQL", "Database"}, {"Docker", "DevOps"}, {"Kubernetes", "DevOps"}, {"Python", "Backend"},
            {"HTML5 & CSS3", "Frontend"}, {"REST APIs", "Backend"}, {"AWS", "Cloud"}, {"Flutter", "Mobile"},
            {"Node.js", "Backend"}, {"Figma", "Design"}, {"Selenium", "Testing"}, {"PostgreSQL", "Database"},
            {"Talent Sourcing", "HR"}, {"Payroll Management", "HR"}, {"Financial Modeling", "Finance"},
            {"Accounting", "Finance"}, {"SEO Optimization", "Marketing"}, {"Google Ads", "Marketing"},
            {"B2B Enterprise Sales", "Sales"}, {"CRM Salesforce", "Sales"}, {"Agile Scrum", "Management"},
            {"Supply Chain", "Operations"}, {"Zendesk", "Customer Support"}, {"Medical Billing", "Healthcare"},
            {"Technical Writing", "Communications"}, {"Copywriting", "Communications"}
        };

        for (String[] s : skillList) {
            if (!skillRepository.existsByName(s[0])) {
                skillRepository.save(new Skill(s[0], s[1]));
            }
        }
    }

    private void upsertCategory(String name, String icon, String desc) {
        if (!categoryRepository.existsByName(name)) {
            categoryRepository.save(new JobCategory(name, icon, desc));
        }
    }

    private void seedUsersAndCompanies() {
        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).orElse(null);
        Role employerRole = roleRepository.findByName(RoleName.ROLE_EMPLOYER).orElse(null);
        Role seekerRole = roleRepository.findByName(RoleName.ROLE_JOB_SEEKER).orElse(null);

        if (adminRole == null || employerRole == null || seekerRole == null) return;

        // 1. Admin
        if (userRepository.findByEmail("admin@jobportal.com").isEmpty()) {
            User admin = new User("admin@jobportal.com", passwordEncoder.encode("admin123"), adminRole);
            userRepository.save(admin);
        }

        // 2. Tech Companies
        Company c1 = getOrCreateCompany("TechCorp Solutions", "IT Services", "500-1000", "https://techcorp.example.com", "Enterprise Java and Cloud engineering.", "Chennai");
        getOrCreateEmployer("employer1@techcorp.com", "Ramesh", "Kumar", "HR Lead", c1, employerRole);

        Company c2 = getOrCreateCompany("Innovate Labs", "Artificial Intelligence", "100-250", "https://innovatelabs.example.com", "AI research startup building scalable ML cloud engines.", "Bengaluru");
        getOrCreateEmployer("employer2@innovate.com", "Priya", "Sharma", "Talent Manager", c2, employerRole);

        Company c3 = getOrCreateCompany("CloudScale Systems", "Cloud & DevOps", "250-500", "https://cloudscale.example.com", "High performance Kubernetes infrastructure solutions.", "Hyderabad");
        getOrCreateEmployer("employer3@cloudscale.com", "Anand", "Verma", "Hiring Director", c3, employerRole);

        getOrCreateCompany("CyberShield Security", "Cyber Security", "50-100", "https://cybershield.example.com", "Managed threat detection & ethical security audits.", "Pune");
        getOrCreateCompany("NexGen Mobile Labs", "Mobile Software", "100-200", "https://nexgenmobile.example.com", "Cross platform mobile products for iOS and Android.", "Mumbai");
        getOrCreateCompany("DataPulse Analytics", "Data & ML", "150-300", "https://datapulse.example.com", "Big data engineering & predictive AI dashboards.", "Bengaluru");

        // 3. Non-Tech & Corporate Companies
        Company c7 = getOrCreateCompany("Apex Global Finance", "Financial Services", "1000+", "https://apexfinance.example.com", "Global investment banking and asset management.", "Mumbai");
        getOrCreateEmployer("employer4@apexfinance.com", "Rajesh", "Menon", "VP Human Capital", c7, employerRole);

        Company c8 = getOrCreateCompany("Stellar Healthcare Systems", "Healthcare & Life Sciences", "500-1000", "https://stellarhealth.example.com", "Leading multi-specialty healthcare and telemedicine networks.", "Bengaluru");
        getOrCreateEmployer("employer5@stellarhealth.com", "Dr. Kavita", "Iyer", "Director of Clinical Talent", c8, employerRole);

        Company c9 = getOrCreateCompany("Vanguard Retail & Logistics", "Supply Chain & E-Commerce", "2000+", "https://vanguardretail.example.com", "Omnichannel retail and pan-India logistics network.", "Delhi NCR");
        getOrCreateEmployer("employer6@vanguard.com", "Vikram", "Chauhan", "Head of HR", c9, employerRole);

        Company c10 = getOrCreateCompany("GrowthPulse Media & Marketing", "Advertising & Digital Media", "100-250", "https://growthpulse.example.com", "Performance digital marketing, creative branding & SEO.", "Chennai");
        getOrCreateEmployer("employer7@growthpulse.com", "Deepa", "Nair", "Talent Acquisition Head", c10, employerRole);

        Company c11 = getOrCreateCompany("Elevate Talent Partners", "Human Resources & Staffing", "50-150", "https://elevatetalent.example.com", "Executive search and human capital consulting.", "Hyderabad");
        getOrCreateEmployer("employer8@elevate.com", "Sanjay", "Rao", "Managing Partner", c11, employerRole);

        getOrCreateCompany("Zenith Corporate Consulting", "Management Consulting", "250-500", "https://zenithconsult.example.com", "Strategic management, corporate legal and operational advisory.", "Pune");

        // 4. Job Seekers
        if (userRepository.findByEmail("seeker1@gmail.com").isEmpty()) {
            createSeekerUser("seeker1@gmail.com", "Karthik", "Raj", "+91 9876543210", "Chennai", "Java Full Stack Developer with expertise in Spring Boot, React, and MySQL.", seekerRole, Arrays.asList("Java", "Spring Boot", "React", "MySQL"));
        }
        if (userRepository.findByEmail("seeker2@gmail.com").isEmpty()) {
            createSeekerUser("seeker2@gmail.com", "Anita", "Deshmukh", "+91 9123456789", "Bengaluru", "Frontend Specialist focused on React, JavaScript, and responsive UI design.", seekerRole, Arrays.asList("React", "JavaScript", "HTML5 & CSS3"));
        }
        if (userRepository.findByEmail("seeker3@gmail.com").isEmpty()) {
            createSeekerUser("seeker3@gmail.com", "Siddharth", "Mehta", "+91 9988776655", "Hyderabad", "DevOps & Cloud Engineer proficient in Docker, Kubernetes, and AWS.", seekerRole, Arrays.asList("AWS", "Docker", "Kubernetes"));
        }
    }

    private Company getOrCreateCompany(String name, String industry, String size, String website, String desc, String city) {
        return companyRepository.findByName(name).orElseGet(() -> {
            Company c = new Company();
            c.setName(name);
            c.setIndustry(industry);
            c.setCompanySize(size);
            c.setWebsite(website);
            c.setDescription(desc);
            c.setCity(city);
            c.setCountry("India");
            return companyRepository.save(c);
        });
    }

    private void getOrCreateEmployer(String email, String fName, String lName, String designation, Company company, Role role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User u = new User(email, passwordEncoder.encode("employer123"), role);
            u = userRepository.save(u);
            EmployerProfile p = new EmployerProfile();
            p.setUser(u);
            p.setFirstName(fName);
            p.setLastName(lName);
            p.setDesignation(designation);
            p.setCompany(company);
            employerProfileRepository.save(p);
        }
    }

    private void createSeekerUser(String email, String fName, String lName, String phone, String location, String summary, Role role, List<String> skillNames) {
        User u = new User(email, passwordEncoder.encode("seeker123"), role);
        u = userRepository.save(u);
        JobSeekerProfile p = new JobSeekerProfile();
        p.setUser(u);
        p.setFirstName(fName);
        p.setLastName(lName);
        p.setPhone(phone);
        p.setLocation(location);
        p.setSummary(summary);
        Set<Skill> skills = new HashSet<>();
        for (String sName : skillNames) {
            skillRepository.findByName(sName).ifPresent(skills::add);
        }
        p.setSkills(skills);
        seekerProfileRepository.save(p);
    }

    private void seedComprehensiveJobs() {
        Company techcorp = companyRepository.findByName("TechCorp Solutions").orElse(null);
        Company innovate = companyRepository.findByName("Innovate Labs").orElse(null);
        Company cloudscale = companyRepository.findByName("CloudScale Systems").orElse(null);
        Company cybershield = companyRepository.findByName("CyberShield Security").orElse(null);
        Company nexgen = companyRepository.findByName("NexGen Mobile Labs").orElse(null);
        Company datapulse = companyRepository.findByName("DataPulse Analytics").orElse(null);
        Company apex = companyRepository.findByName("Apex Global Finance").orElse(techcorp);
        Company stellar = companyRepository.findByName("Stellar Healthcare Systems").orElse(innovate);
        Company vanguard = companyRepository.findByName("Vanguard Retail & Logistics").orElse(techcorp);
        Company growthpulse = companyRepository.findByName("GrowthPulse Media & Marketing").orElse(innovate);
        Company elevate = companyRepository.findByName("Elevate Talent Partners").orElse(techcorp);
        Company zenith = companyRepository.findByName("Zenith Corporate Consulting").orElse(techcorp);

        // Tech Categories
        JobCategory devCat = categoryRepository.findByName("Software Development").orElse(null);
        JobCategory aiCat = categoryRepository.findByName("Data Science & AI").orElse(null);
        JobCategory cloudCat = categoryRepository.findByName("Cloud & DevOps").orElse(null);
        JobCategory secCat = categoryRepository.findByName("Cyber Security").orElse(null);
        JobCategory mobileCat = categoryRepository.findByName("Mobile App Development").orElse(null);
        JobCategory designCat = categoryRepository.findByName("Product & UI/UX Design").orElse(null);
        JobCategory qaCat = categoryRepository.findByName("QA & Automation").orElse(null);
        JobCategory dbCat = categoryRepository.findByName("Database & Analytics").orElse(null);

        // Non-Tech Categories
        JobCategory hrCat = categoryRepository.findByName("Human Resources & Talent").orElse(null);
        JobCategory finCat = categoryRepository.findByName("Finance, Banking & Accounting").orElse(null);
        JobCategory mktCat = categoryRepository.findByName("Digital Marketing & SEO").orElse(null);
        JobCategory salesCat = categoryRepository.findByName("Sales & Business Development").orElse(null);
        JobCategory opsCat = categoryRepository.findByName("Operations & Project Management").orElse(null);
        JobCategory csCat = categoryRepository.findByName("Customer Success & Support").orElse(null);
        JobCategory healthCat = categoryRepository.findByName("Healthcare & Medical Administration").orElse(null);
        JobCategory writeCat = categoryRepository.findByName("Content Writing & Communications").orElse(null);

        // 1. SOFTWARE DEVELOPMENT
        createJobEntry("Senior Java Full Stack Developer", techcorp, devCat, JobType.FULL_TIME, WorkMode.HYBRID, "Chennai", 900000.0, 1500000.0, 3, 4,
                "Engineer microservices using Spring Boot, Hibernate, and React.js.",
                "Design RESTful APIs, optimize MySQL database queries, develop React components.",
                "3+ years experience with Java 17, Spring Boot, React, and MySQL.");

        createJobEntry("React UI Architect", innovate, devCat, JobType.FULL_TIME, WorkMode.REMOTE, "Bengaluru", 800000.0, 1300000.0, 2, 3,
                "Craft responsive user interfaces for modern web applications using React Hooks and CSS.",
                "Develop modular UI components, integrate Axios REST APIs, manage state flow.",
                "2+ years frontend UI design, React Router DOM, JavaScript ES6+.");

        createJobEntry("Node.js Microservices Backend Developer", techcorp, devCat, JobType.CONTRACT, WorkMode.REMOTE, "Chennai", 800000.0, 1350000.0, 3, 3,
                "Build asynchronous REST APIs and scalable microservices architectures.",
                "Implement Express services, JWT authentication, and MySQL connectors.",
                "3+ years Node.js, Express, and REST API development.");

        // 2. DATA SCIENCE & AI
        createJobEntry("Machine Learning Intern", innovate, aiCat, JobType.INTERNSHIP, WorkMode.HYBRID, "Bengaluru", 300000.0, 450000.0, 0, 5,
                "Internship opportunity for graduates passionate about Python, ML models, and analytics.",
                "Assist data scientists in cleaning data, running ML benchmarks, and scripting.",
                "Proficiency in Python, basic statistics, and SQL databases.");

        createJobEntry("Lead AI & Deep Learning Engineer", innovate, aiCat, JobType.FULL_TIME, WorkMode.HYBRID, "Bengaluru", 1400000.0, 2400000.0, 4, 2,
                "Lead the creation of LLM integrations and predictive deep learning algorithms.",
                "Train Transformer models, deploy neural networks to cloud APIs, mentor researchers.",
                "4+ years with Python, PyTorch/TensorFlow, and production ML pipelines.");

        createJobEntry("Senior Data Scientist", datapulse, aiCat, JobType.FULL_TIME, WorkMode.ONSITE, "Pune", 1100000.0, 1800000.0, 3, 2,
                "Transform complex enterprise datasets into actionable predictive intelligence.",
                "Build classification models, conduct A/B tests, and present insights to stakeholders.",
                "3+ years in statistical data science, Python, Pandas, and Scikit-learn.");

        // 3. CLOUD & DEVOPS
        createJobEntry("DevOps & Kubernetes Specialist", cloudscale, cloudCat, JobType.CONTRACT, WorkMode.ONSITE, "Hyderabad", 1000000.0, 1600000.0, 4, 2,
                "Manage AWS cloud infrastructure, Docker container orchestration, and CI/CD scripts.",
                "Maintain Kubernetes clusters, configure Docker builds, monitor system telemetry.",
                "4+ years with AWS, Docker, Kubernetes, and CI/CD pipelines.");

        createJobEntry("AWS Cloud Solutions Architect", cloudscale, cloudCat, JobType.FULL_TIME, WorkMode.REMOTE, "Bengaluru", 1500000.0, 2600000.0, 5, 2,
                "Architect highly scalable, multi-region cloud infrastructures on Amazon Web Services.",
                "Design serverless architectures with Lambda, S3, RDS, and automated Terraform IAC.",
                "5+ years AWS infrastructure architecture with AWS Certified Solutions Architect certification.");

        // 4. CYBER SECURITY
        createJobEntry("Cyber Security Analyst", cybershield, secCat, JobType.PART_TIME, WorkMode.HYBRID, "Pune", 600000.0, 1000000.0, 2, 2,
                "Perform network vulnerability scans, penetration testing audits, and security incident response.",
                "Conduct vulnerability assessments, analyze server logs, enforce OAuth2 security policies.",
                "Knowledge of Information Security, Linux shell, and ethical hacking.");

        createJobEntry("Information Security & Penetration Tester", cybershield, secCat, JobType.FULL_TIME, WorkMode.ONSITE, "Delhi NCR", 900000.0, 1500000.0, 3, 2,
                "Execute red team vulnerability testing across corporate web applications and networks.",
                "Identify OWASP Top 10 vulnerabilities, conduct source code review, produce audit reports.",
                "CEH / OSCP certification with 3+ years hands-on penetration testing.");

        // 5. MOBILE APP DEVELOPMENT
        createJobEntry("Flutter Mobile Application Developer", nexgen, mobileCat, JobType.FREELANCE, WorkMode.REMOTE, "Mumbai", 500000.0, 900000.0, 1, 3,
                "Build responsive iOS and Android mobile features using Flutter and Dart.",
                "Implement clean Flutter UI screens, state management with Bloc, and API integrations.",
                "1+ years Flutter/Dart mobile development experience.");

        createJobEntry("Senior iOS Swift Developer", nexgen, mobileCat, JobType.FULL_TIME, WorkMode.HYBRID, "Bengaluru", 1100000.0, 1800000.0, 3, 2,
                "Develop high-performance native iOS applications for millions of active smartphone users.",
                "Architect SwiftUI views, optimize memory usage, and publish releases to Apple App Store.",
                "3+ years native iOS development with Swift, CoreData, and SwiftUI.");

        // 6. PRODUCT & UI/UX DESIGN
        createJobEntry("UI/UX Product Designer", innovate, designCat, JobType.FULL_TIME, WorkMode.REMOTE, "Remote", 750000.0, 1200000.0, 2, 3,
                "Design intuitive wireframes, interactive prototypes, and design systems in Figma.",
                "Conduct user research, design Figma prototypes, collaborate with React engineers.",
                "Strong Figma portfolio demonstrating clean web and mobile design aesthetics.");

        createJobEntry("Lead Visual & Interaction Designer", techcorp, designCat, JobType.FULL_TIME, WorkMode.HYBRID, "Chennai", 950000.0, 1600000.0, 4, 2,
                "Create cohesive visual brand identities, design systems, and responsive user interfaces.",
                "Lead usability tests, refine typography & micro-interactions, define style guides.",
                "4+ years digital product design experience with advanced Figma mastery.");

        // 7. QA & AUTOMATION
        createJobEntry("Senior QA Automation Engineer", techcorp, qaCat, JobType.FULL_TIME, WorkMode.ONSITE, "Chennai", 700000.0, 1100000.0, 3, 3,
                "Automate end-to-end regression test suites for enterprise web portals using Selenium WebDriver.",
                "Create automated test scripts, execute test plans, report defect trace logs.",
                "3+ years in QA Automation, Selenium, Java, and TestNG/JUnit.");

        createJobEntry("SDET - Test Framework Engineer", cloudscale, qaCat, JobType.FULL_TIME, WorkMode.HYBRID, "Hyderabad", 850000.0, 1400000.0, 3, 2,
                "Develop scalable automated testing frameworks for microservices and REST APIs.",
                "Implement Cypress and Postman CI/CD automated test pipelines with Docker runners.",
                "3+ years in Test Automation with JavaScript/Java and API integration testing.");

        // 8. DATABASE & ANALYTICS
        createJobEntry("Python Data Pipeline Engineer", datapulse, dbCat, JobType.FULL_TIME, WorkMode.HYBRID, "Bengaluru", 850000.0, 1400000.0, 3, 3,
                "Build scalable data ingestion pipelines using Python, SQL, and AWS cloud storage.",
                "Extract, transform, and load enterprise dataset pipelines into MySQL and data lakes.",
                "Strong Python, SQL, and data warehouse experience.");

        createJobEntry("Database Administrator & Performance Tuning Lead", datapulse, dbCat, JobType.FULL_TIME, WorkMode.ONSITE, "Pune", 950000.0, 1550000.0, 4, 2,
                "Ensure high availability, replication, backup, and indexing of relational databases.",
                "Tune complex MySQL and PostgreSQL queries, optimize buffer pools, manage failover.",
                "4+ years DBA experience with MySQL and PostgreSQL in high-concurrency environments.");

        // 9. HUMAN RESOURCES & TALENT (NON-TECH)
        createJobEntry("Technical Talent Acquisition Lead", elevate, hrCat, JobType.FULL_TIME, WorkMode.HYBRID, "Bengaluru", 700000.0, 1200000.0, 3, 2,
                "Lead end-to-end recruitment for high-growth engineering, AI, and cloud technology teams.",
                "Source candidates via LinkedIn Recruiter, manage interview pipelines, negotiate offers.",
                "3+ years technical recruiting experience with strong ATS management proficiency.");

        createJobEntry("Senior HR Business Partner (HRBP)", elevate, hrCat, JobType.FULL_TIME, WorkMode.ONSITE, "Hyderabad", 850000.0, 1450000.0, 4, 2,
                "Partner with senior management on employee engagement, retention, and performance appraisals.",
                "Drive talent development programs, resolve employee relations, ensure labor compliance.",
                "MBA in Human Resources with 4+ years generalist/HRBP experience.");

        createJobEntry("People Operations & Payroll Specialist", techcorp, hrCat, JobType.FULL_TIME, WorkMode.HYBRID, "Chennai", 500000.0, 850000.0, 2, 2,
                "Administer company payroll, benefits, statutory compliance, and onboarding programs.",
                "Process monthly salary disbursement, manage attendance tracking, assist new hires.",
                "2+ years experience in HR Operations, PF/ESI regulations, and payroll software.");

        // 10. FINANCE, BANKING & ACCOUNTING (NON-TECH)
        createJobEntry("Senior Financial Analyst", apex, finCat, JobType.FULL_TIME, WorkMode.ONSITE, "Mumbai", 850000.0, 1400000.0, 3, 3,
                "Conduct quantitative financial modeling, valuation, and capital allocation forecasting.",
                "Prepare quarterly investor presentations, analyze variance trends, track KPI metrics.",
                "CA / MBA Finance with 3+ years experience in corporate finance or equity research.");

        createJobEntry("Investment Banking Associate", apex, finCat, JobType.FULL_TIME, WorkMode.ONSITE, "Mumbai", 1200000.0, 2200000.0, 3, 2,
                "Work on M&A advisory, debt financing structures, and equity underwriting transactions.",
                "Build dynamic DCF and LBO financial models, author confidential investment memorandums.",
                "3+ years experience at an investment bank, PE firm, or Big 4 corporate finance practice.");

        createJobEntry("Corporate Tax & Compliance Manager", apex, finCat, JobType.FULL_TIME, WorkMode.HYBRID, "Delhi NCR", 900000.0, 1500000.0, 4, 2,
                "Manage direct and indirect tax filings, GST reconciliations, and statutory audits.",
                "Ensure compliance with Indian Income Tax laws and liaise with external auditing firms.",
                "Chartered Accountant (CA) with 4+ years post-qualification taxation experience.");

        // 11. DIGITAL MARKETING & SEO (NON-TECH)
        createJobEntry("Head of Digital Growth & Performance Marketing", growthpulse, mktCat, JobType.FULL_TIME, WorkMode.HYBRID, "Bengaluru", 900000.0, 1600000.0, 4, 2,
                "Drive customer acquisition through Google Ads, Meta Ads, remarketing, and conversion optimization.",
                "Manage monthly marketing budgets, optimize CAC/ROAS, coordinate cross-channel campaigns.",
                "4+ years performance marketing experience with proven track record in high ROI campaigns.");

        createJobEntry("SEO & Inbound Content Strategist", growthpulse, mktCat, JobType.FULL_TIME, WorkMode.REMOTE, "Chennai", 550000.0, 950000.0, 2, 2,
                "Maximize organic search traffic rankings, conduct keyword gap audits, and technical SEO fixes.",
                "Optimize on-page metadata, build backlink acquisition strategies, analyze Google Search Console.",
                "2+ years hands-on SEO experience with tools like Ahrefs, SEMrush, and Screaming Frog.");

        // 12. SALES & BUSINESS DEVELOPMENT (NON-TECH)
        createJobEntry("Enterprise B2B SaaS Sales Director", techcorp, salesCat, JobType.FULL_TIME, WorkMode.HYBRID, "Bengaluru", 1400000.0, 2500000.0, 5, 2,
                "Drive enterprise software deals, lead prospecting, and negotiate multi-year contracts.",
                "Manage complex sales cycles with C-suite stakeholders, build recurring revenue pipelines.",
                "5+ years in Enterprise B2B software sales with proven quota overachievement.");

        createJobEntry("Business Development Executive - Client Partnerships", apex, salesCat, JobType.FULL_TIME, WorkMode.ONSITE, "Mumbai", 600000.0, 1000000.0, 2, 4,
                "Generate qualified business leads, pitch financial products, and close institutional partnerships.",
                "Conduct outbound outreach, manage CRM pipeline, attend industry networking summits.",
                "2+ years experience in corporate sales, client acquisition, and relationship management.");

        // 13. OPERATIONS & PROJECT MANAGEMENT (NON-TECH)
        createJobEntry("Senior Agile Scrum Master / Project Lead", techcorp, opsCat, JobType.FULL_TIME, WorkMode.HYBRID, "Chennai", 950000.0, 1600000.0, 4, 2,
                "Facilitate sprint planning, daily standups, backlog grooming, and cross-functional deliveries.",
                "Remove operational roadblocks, ensure Jira tracking alignment, and champion agile excellence.",
                "Certified Scrum Master (CSM/PSM) with 4+ years leading agile software teams.");

        createJobEntry("Supply Chain & Logistics Operations Manager", vanguard, opsCat, JobType.FULL_TIME, WorkMode.ONSITE, "Delhi NCR", 850000.0, 1450000.0, 4, 3,
                "Oversee warehouse inventory flow, fleet dispatch schedules, and pan-India logistics networks.",
                "Optimize fulfillment turnaround times, minimize operational transit losses, manage vendors.",
                "4+ years in warehouse operations, supply chain logistics, and ERP inventory systems.");

        createJobEntry("Business Operations Analyst", zenith, opsCat, JobType.FULL_TIME, WorkMode.HYBRID, "Pune", 600000.0, 1000000.0, 2, 2,
                "Analyze operational bottlenecks, map workflow processes, and develop cost optimization plans.",
                "Collect cross-department operational data, build Executive KPI dashboards, present recommendations.",
                "2+ years experience in business analysis, process re-engineering, and advanced Excel.");

        // 14. CUSTOMER SUCCESS & SUPPORT (NON-TECH)
        createJobEntry("Enterprise Customer Success Manager", innovate, csCat, JobType.FULL_TIME, WorkMode.REMOTE, "Bengaluru", 750000.0, 1250000.0, 3, 2,
                "Nurture relationships with enterprise accounts, drive product adoption, and lead renewals.",
                "Conduct quarterly business reviews, resolve client escalations, identify up-sell opportunities.",
                "3+ years in B2B SaaS Customer Success or Client Relationship Management.");

        createJobEntry("Global Customer Experience Specialist", vanguard, csCat, JobType.FULL_TIME, WorkMode.HYBRID, "Mumbai", 450000.0, 750000.0, 1, 4,
                "Deliver exceptional customer satisfaction across omnichannel email, chat, and phone tickets.",
                "Troubleshoot user account questions, coordinate returns, and log product feedback.",
                "Excellent verbal and written communication skills with Zendesk or Freshdesk familiarity.");

        // 15. HEALTHCARE & MEDICAL ADMINISTRATION (NON-TECH)
        createJobEntry("Healthcare Operations Administrator", stellar, healthCat, JobType.FULL_TIME, WorkMode.ONSITE, "Bengaluru", 750000.0, 1300000.0, 3, 2,
                "Coordinate hospital administration, patient admissions, facility scheduling, and accreditation.",
                "Ensure compliance with clinical quality protocols, manage medical staff rosters, optimize OPD.",
                "Master in Hospital Administration (MHA) or 3+ years healthcare management experience.");

        createJobEntry("Clinical Research & Data Coordinator", stellar, healthCat, JobType.FULL_TIME, WorkMode.HYBRID, "Hyderabad", 600000.0, 1050000.0, 2, 2,
                "Manage clinical trial documentation, patient consent registries, and medical data compliance.",
                "Coordinate with principal investigators, record trial metrics, maintain audit-ready CRF records.",
                "B.Pharm / M.Pharm / Life Sciences degree with knowledge of GCP regulations.");

        // 16. CONTENT WRITING & COMMUNICATIONS (NON-TECH)
        createJobEntry("Senior Technical Writer - Product & APIs", cloudscale, writeCat, JobType.FULL_TIME, WorkMode.REMOTE, "Remote", 800000.0, 1350000.0, 3, 2,
                "Author crystal-clear developer documentation, API reference guides, and system architecture manuals.",
                "Collaborate with backend engineers to explain complex endpoints, write markdown guides.",
                "3+ years technical writing experience for software platforms with Markdown/Git proficiency.");

        createJobEntry("Corporate Communications & PR Manager", zenith, writeCat, JobType.FULL_TIME, WorkMode.HYBRID, "Mumbai", 850000.0, 1450000.0, 4, 2,
                "Draft executive press releases, manage media relations, and lead corporate crisis communications.",
                "Craft thought-leadership articles, coordinate brand interviews, manage internal newsletters.",
                "4+ years experience in public relations, journalism, or corporate communications.");
    }

    private void createJobEntry(String title, Company company, JobCategory category, JobType type, WorkMode mode, String location, Double minSal, Double maxSal, int exp, int vacancies, String desc, String resp, String req) {
        if (company == null) return;
        if (!jobRepository.existsByTitleAndCompany(title, company)) {
            Job j = new Job();
            j.setTitle(title);
            j.setCompany(company);
            j.setCategory(category);
            j.setJobType(type);
            j.setWorkMode(mode);
            j.setLocation(location);
            j.setSalaryMin(minSal);
            j.setSalaryMax(maxSal);
            j.setExperienceRequired(exp);
            j.setEducationRequired("Bachelor Degree");
            j.setVacancies(vacancies);
            j.setDescription(desc);
            j.setResponsibilities(resp);
            j.setRequirements(req);
            j.setStatus(JobStatus.ACTIVE);
            j.setApplicationDeadline(LocalDate.now().plusDays(45));
            jobRepository.save(j);
        }
    }

    private void seedSampleApplications() {
        if (applicationRepository.count() > 0) return;

        List<Job> jobs = jobRepository.findAll();
        List<JobSeekerProfile> seekers = seekerProfileRepository.findAll();

        if (jobs.isEmpty() || seekers.isEmpty()) return;

        JobSeekerProfile s1 = seekers.get(0); // Karthik
        JobSeekerProfile s2 = seekers.size() > 1 ? seekers.get(1) : s1; // Anita
        JobSeekerProfile s3 = seekers.size() > 2 ? seekers.get(2) : s1; // Siddharth

        createApp(jobs.get(0), s1, ApplicationStatus.APPLIED, "I have 3+ years experience with Spring Boot & React.");
        if (jobs.size() > 1) createApp(jobs.get(1), s2, ApplicationStatus.UNDER_REVIEW, "Specialized in React UI design and state management.");
        if (jobs.size() > 2) createApp(jobs.get(2), s3, ApplicationStatus.SHORTLISTED, "Hands-on experience with Kubernetes clusters and Docker.");
        if (jobs.size() > 3) createApp(jobs.get(3), s1, ApplicationStatus.INTERVIEW, "Python enthusiast keen on ML research.");
    }

    private void createApp(Job job, JobSeekerProfile seeker, ApplicationStatus status, String coverLetter) {
        JobApplication app = new JobApplication();
        app.setJob(job);
        app.setSeekerProfile(seeker);
        app.setCoverLetter(coverLetter);
        app.setCurrentStatus(status);
        JobApplication saved = applicationRepository.save(app);

        statusHistoryRepository.save(new ApplicationStatusHistory(
                saved, status, "Initial status set to " + status, seeker.getUser()
        ));
    }
}
