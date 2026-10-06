package com.example.jobportal.config;

import com.example.jobportal.entity.*;
import com.example.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
        if (roleRepository.count() == 0) {
            seedRoles();
        }
        if (categoryRepository.count() == 0) {
            seedCategoriesAndSkills();
        }
        if (userRepository.count() == 0) {
            seedUsersAndCompanies();
            seedComprehensiveJobs();
        }
        if (applicationRepository.count() == 0) {
            seedSampleApplications();
        }
    }

    private void seedRoles() {
        roleRepository.save(new Role(RoleName.ROLE_JOB_SEEKER));
        roleRepository.save(new Role(RoleName.ROLE_EMPLOYER));
        roleRepository.save(new Role(RoleName.ROLE_ADMIN));
    }

    private void seedCategoriesAndSkills() {
        categoryRepository.save(new JobCategory("Software Development", "BiCodeAlt", "Backend, Frontend, and Full Stack Engineering roles"));
        categoryRepository.save(new JobCategory("Data Science & AI", "BiBrain", "Machine Learning, Analytics, Deep Learning & Big Data"));
        categoryRepository.save(new JobCategory("Cloud & DevOps", "BiCloud", "AWS, Azure, Docker, Kubernetes & Infrastructure"));
        categoryRepository.save(new JobCategory("Product & UI/UX Design", "BiPalette", "UI/UX Design, Product Management & Graphics"));
        categoryRepository.save(new JobCategory("Cyber Security", "BiShield", "InfoSec, Ethical Hacking & Network Protection"));
        categoryRepository.save(new JobCategory("Mobile App Development", "BiMobile", "iOS, Android, React Native & Flutter"));
        categoryRepository.save(new JobCategory("QA & Automation", "BiCheckShield", "Selenium, Cypress, Automated Testing & QA"));
        categoryRepository.save(new JobCategory("Database & Analytics", "BiData", "MySQL, PostgreSQL, MongoDB & Data Pipelines"));

        skillRepository.save(new Skill("Java", "Backend"));
        skillRepository.save(new Skill("Spring Boot", "Backend"));
        skillRepository.save(new Skill("React", "Frontend"));
        skillRepository.save(new Skill("JavaScript", "Frontend"));
        skillRepository.save(new Skill("MySQL", "Database"));
        skillRepository.save(new Skill("Docker", "DevOps"));
        skillRepository.save(new Skill("Kubernetes", "DevOps"));
        skillRepository.save(new Skill("Python", "Backend"));
        skillRepository.save(new Skill("HTML5 & CSS3", "Frontend"));
        skillRepository.save(new Skill("REST APIs", "Backend"));
        skillRepository.save(new Skill("AWS", "Cloud"));
        skillRepository.save(new Skill("Flutter", "Mobile"));
        skillRepository.save(new Skill("Node.js", "Backend"));
        skillRepository.save(new Skill("Figma", "Design"));
        skillRepository.save(new Skill("Selenium", "Testing"));
    }

    private void seedUsersAndCompanies() {
        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseThrow();
        Role employerRole = roleRepository.findByName(RoleName.ROLE_EMPLOYER).orElseThrow();
        Role seekerRole = roleRepository.findByName(RoleName.ROLE_JOB_SEEKER).orElseThrow();

        // 1. Admin
        User admin = new User("admin@jobportal.com", passwordEncoder.encode("admin123"), adminRole);
        userRepository.save(admin);

        // 2. Employers & Companies
        Company c1 = createCompany("TechCorp Solutions", "IT Services", "500-1000", "https://techcorp.example.com", "Enterprise Java and Cloud engineering.", "Chennai");
        createEmployerUser("employer1@techcorp.com", "Ramesh", "Kumar", "HR Lead", c1, employerRole);

        Company c2 = createCompany("Innovate Labs", "Artificial Intelligence", "100-250", "https://innovatelabs.example.com", "AI research startup building scalable ML cloud engines.", "Bengaluru");
        createEmployerUser("employer2@innovate.com", "Priya", "Sharma", "Talent Manager", c2, employerRole);

        Company c3 = createCompany("CloudScale Systems", "Cloud & DevOps", "250-500", "https://cloudscale.example.com", "High performance Kubernetes infrastructure solutions.", "Hyderabad");
        createEmployerUser("employer3@cloudscale.com", "Anand", "Verma", "Hiring Director", c3, employerRole);

        Company c4 = createCompany("CyberShield Security", "Cyber Security", "50-100", "https://cybershield.example.com", "Managed threat detection & ethical security audits.", "Pune");
        Company c5 = createCompany("NexGen Mobile Labs", "Mobile Software", "100-200", "https://nexgenmobile.example.com", "Cross platform mobile products for iOS and Android.", "Mumbai");
        Company c6 = createCompany("DataPulse Analytics", "Data & ML", "150-300", "https://datapulse.example.com", "Big data engineering & predictive AI dashboards.", "Bengaluru");

        // 3. Job Seekers
        createSeekerUser("seeker1@gmail.com", "Karthik", "Raj", "+91 9876543210", "Chennai", "Java Full Stack Developer with expertise in Spring Boot, React, and MySQL.", seekerRole, java.util.Arrays.asList("Java", "Spring Boot", "React", "MySQL"));
        createSeekerUser("seeker2@gmail.com", "Anita", "Deshmukh", "+91 9123456789", "Bengaluru", "Frontend Specialist focused on React, JavaScript, and responsive UI design.", seekerRole, java.util.Arrays.asList("React", "JavaScript", "HTML5 & CSS3"));
        createSeekerUser("seeker3@gmail.com", "Siddharth", "Mehta", "+91 9988776655", "Hyderabad", "DevOps & Cloud Engineer proficient in Docker, Kubernetes, and AWS.", seekerRole, java.util.Arrays.asList("AWS", "Docker", "Kubernetes"));
    }

    private Company createCompany(String name, String industry, String size, String website, String desc, String city) {
        Company c = new Company();
        c.setName(name);
        c.setIndustry(industry);
        c.setCompanySize(size);
        c.setWebsite(website);
        c.setDescription(desc);
        c.setCity(city);
        c.setCountry("India");
        return companyRepository.save(c);
    }

    private void createEmployerUser(String email, String fName, String lName, String designation, Company company, Role role) {
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
        Company techcorp = companyRepository.findByName("TechCorp Solutions").orElseThrow();
        Company innovate = companyRepository.findByName("Innovate Labs").orElseThrow();
        Company cloudscale = companyRepository.findByName("CloudScale Systems").orElseThrow();
        Company cybershield = companyRepository.findByName("CyberShield Security").orElseThrow();
        Company nexgen = companyRepository.findByName("NexGen Mobile Labs").orElseThrow();
        Company datapulse = companyRepository.findByName("DataPulse Analytics").orElseThrow();

        JobCategory devCat = categoryRepository.findByName("Software Development").orElse(null);
        JobCategory aiCat = categoryRepository.findByName("Data Science & AI").orElse(null);
        JobCategory cloudCat = categoryRepository.findByName("Cloud & DevOps").orElse(null);
        JobCategory mobileCat = categoryRepository.findByName("Mobile App Development").orElse(null);
        JobCategory secCat = categoryRepository.findByName("Cyber Security").orElse(null);
        JobCategory designCat = categoryRepository.findByName("Product & UI/UX Design").orElse(null);
        JobCategory qaCat = categoryRepository.findByName("QA & Automation").orElse(null);
        JobCategory dbCat = categoryRepository.findByName("Database & Analytics").orElse(null);

        // 1. FULL TIME - HYBRID
        createJobEntry("Senior Java Full Stack Developer", techcorp, devCat, JobType.FULL_TIME, WorkMode.HYBRID, "Chennai", 900000.0, 1500000.0, 3, 3,
                "We are seeking a Senior Java Developer to engineer microservices using Spring Boot, Hibernate, and React.js.",
                "Design RESTful APIs, optimize MySQL database queries, collaborate on React frontend UI.",
                "3+ years experience with Java 17, Spring Boot, React, and MySQL.");

        // 2. FULL TIME - REMOTE
        createJobEntry("React UI Architect", innovate, devCat, JobType.FULL_TIME, WorkMode.REMOTE, "Bengaluru", 800000.0, 1300000.0, 2, 2,
                "Join Innovate Labs to craft responsive user interfaces for AI analytics dashboards using React Hooks and Bootstrap.",
                "Develop modular React UI components, integrate Axios REST APIs, manage state flow.",
                "2+ years frontend UI design, React Router DOM, JavaScript ES6+.");

        // 3. CONTRACT - ONSITE
        createJobEntry("DevOps & Kubernetes Specialist", cloudscale, cloudCat, JobType.CONTRACT, WorkMode.ONSITE, "Hyderabad", 1000000.0, 1600000.0, 4, 1,
                "Manage AWS cloud infrastructure, Docker container orchestration, and automated CI/CD build scripts.",
                "Maintain Kubernetes clusters, configure Docker builds, monitor system metrics.",
                "4+ years with AWS, Docker, Kubernetes, and CI/CD pipelines.");

        // 4. INTERNSHIP - HYBRID
        createJobEntry("Machine Learning Intern", innovate, aiCat, JobType.INTERNSHIP, WorkMode.HYBRID, "Bengaluru", 300000.0, 450000.0, 0, 5,
                "Great internship opportunity for fresh graduates interested in Python, Machine Learning models, and Data Analytics.",
                "Assist data scientists in cleaning data, running ML model benchmarks, and writing Python scripts.",
                "Proficiency in Python, basic statistics, and SQL databases.");

        // 5. FREELANCE - REMOTE
        createJobEntry("Flutter Mobile Application Developer", nexgen, mobileCat, JobType.FREELANCE, WorkMode.REMOTE, "Mumbai", 500000.0, 900000.0, 1, 2,
                "Looking for a freelance Flutter developer to build iOS and Android mobile features for our consumer apps.",
                "Implement clean Flutter UI screens, state management with Provider/Bloc, and API integrations.",
                "1+ years Flutter/Dart mobile development experience.");

        // 6. PART TIME - HYBRID
        createJobEntry("Cyber Security Analyst", cybershield, secCat, JobType.PART_TIME, WorkMode.HYBRID, "Pune", 600000.0, 1000000.0, 2, 1,
                "Part-time security engineer to perform network vulnerability scans and penetration testing audits.",
                "Conduct vulnerability assessments, analyze server logs, enforce OAuth2 security policies.",
                "Knowledge of Information Security, Linux shell, and ethical hacking.");

        // 7. FULL TIME - ONSITE
        createJobEntry("Senior QA Automation Engineer", techcorp, qaCat, JobType.FULL_TIME, WorkMode.ONSITE, "Chennai", 700000.0, 1100000.0, 3, 2,
                "Automate end-to-end regression test suites for enterprise web portals using Selenium WebDriver and Java.",
                "Create automated test scripts, execute test plans, report defect trace logs.",
                "3+ years in QA Automation, Selenium, Java, and TestNG/JUnit.");

        // 8. FULL TIME - REMOTE
        createJobEntry("UI/UX Product Designer", innovate, designCat, JobType.FULL_TIME, WorkMode.REMOTE, "Remote", 750000.0, 1200000.0, 2, 2,
                "Design intuitive wireframes, interactive prototypes, and modern UI components in Figma.",
                "Conduct user research, design Figma prototypes, collaborate with frontend React developers.",
                "Strong Figma portfolio demonstrating clean web and mobile design aesthetics.");

        // 9. FULL TIME - HYBRID
        createJobEntry("Python Data Pipeline Engineer", datapulse, dbCat, JobType.FULL_TIME, WorkMode.HYBRID, "Bengaluru", 850000.0, 1400000.0, 3, 2,
                "Build scalable data ingestion pipelines using Python, SQL, and AWS cloud storage.",
                "Extract, transform, and load enterprise dataset pipelines into MySQL and data lakes.",
                "Strong Python, SQL, and data warehouse experience.");

        // 10. CONTRACT - REMOTE
        createJobEntry("Node.js Microservices Backend Developer", techcorp, devCat, JobType.CONTRACT, WorkMode.REMOTE, "Chennai", 800000.0, 1350000.0, 3, 3,
                "Contract Node.js backend developer to build asynchronous REST APIs and Event Stream listeners.",
                "Implement express microservices, JWT authentication, and MySQL database connectors.",
                "3+ years Node.js, Express, and REST API development.");
    }

    private void createJobEntry(String title, Company company, JobCategory category, JobType type, WorkMode mode, String location, Double minSal, Double maxSal, int exp, int vacancies, String desc, String resp, String req) {
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

    private void seedSampleApplications() {
        List<Job> jobs = jobRepository.findAll();
        List<JobSeekerProfile> seekers = seekerProfileRepository.findAll();

        if (jobs.isEmpty() || seekers.isEmpty()) return;

        JobSeekerProfile s1 = seekers.get(0); // Karthik
        JobSeekerProfile s2 = seekers.size() > 1 ? seekers.get(1) : s1; // Anita
        JobSeekerProfile s3 = seekers.size() > 2 ? seekers.get(2) : s1; // Siddharth

        // Create initial candidate applications across different stages
        createApp(jobs.get(0), s1, ApplicationStatus.APPLIED, "I have 3+ years experience with Spring Boot & React.");
        if (jobs.size() > 1) createApp(jobs.get(1), s2, ApplicationStatus.UNDER_REVIEW, "Specialized in React UI design and state management.");
        if (jobs.size() > 2) createApp(jobs.get(2), s3, ApplicationStatus.SHORTLISTED, "Hands-on experience with Kubernetes clusters and Docker.");
        if (jobs.size() > 3) createApp(jobs.get(3), s1, ApplicationStatus.INTERVIEW, "Python enthusiast keen on ML research.");
        if (jobs.size() > 6) createApp(jobs.get(6), s2, ApplicationStatus.SELECTED, "Experienced in Selenium test suites.");
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

        // Create sample notification
        User empUser = userRepository.findByEmail("employer1@techcorp.com").orElse(null);
        if (empUser != null) {
            notificationRepository.save(new Notification(
                    empUser,
                    "New Job Candidate Application",
                    seeker.getFirstName() + " applied for " + job.getTitle(),
                    "NEW_APPLICATION"
            ));
        }
    }
}
