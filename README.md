# ONLINE JOB PORTAL SYSTEM

A full-stack, production-style web application simulating modern job platforms such as LinkedIn Jobs, Indeed, and Naukri.

Built with **React (JavaScript)**, **Spring Boot (Java)**, **Spring Security (JWT)**, and **MySQL**.

---

## 🚀 Technology Stack

### Frontend
- **Framework:** React (Vite, Functional Components, React Hooks)
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios with Request & Response Interceptors
- **Styling:** Bootstrap 5, Custom CSS3 (Glassmorphism theme)
- **Icons:** React Icons (`react-icons/bi`)

### Backend
- **Language & Framework:** Java 17, Spring Boot 3.1
- **Security:** Spring Security, JWT (JSON Web Tokens), BCrypt Password Hashing
- **ORM & Database:** Spring Data JPA, Hibernate, MySQL 8
- **Validation:** Jakarta Bean Validation
- **Search Engine:** JPA Specification Criteria Builder with Pageable pagination

---

## 👥 User Roles & Access Control

1. **JOB_SEEKER**
   - Register, Login, Logout
   - Candidate Profile Management (Bio, Links, Location)
   - Resume Upload, Download, Delete, and Set Primary (PDF/DOC/DOCX)
   - Job Search with multi-filter (Keyword, Location, Type, Mode, Category, Salary)
   - One-Click Job Application with cover letter
   - Application Tracking & Status Timeline (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`, `WITHDRAWN`)
   - Bookmark / Save Jobs
   - Rule-Based Job Recommendations based on candidate skill matrix
   - Unread Notifications Center

2. **EMPLOYER**
   - Register, Login, Logout
   - Company Branding Profile (Logo Upload, Size, Industry, Website, Overview)
   - Post, Edit, Delete, and Activate/Deactivate Jobs
   - Candidate Review & Resume Inspection
   - **Kanban Recruitment Pipeline:** Interactive stage progression
   - Audit logging in `ApplicationStatusHistory`

3. **ADMIN**
   - System Dashboard with platform-wide analytics
   - User Management: View registered candidates/employers and Block/Unblock access
   - Job Moderation: Approve or Reject pending job postings
   - Master Data Management: Create/Delete Job Categories & Master Skills

---

## 📁 Folder Structure

```
ooase project/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/jobportal/
│       │   ├── config/ (SecurityConfig, CorsConfig, WebConfig, DataInitializer)
│       │   ├── controller/ (AuthController, JobController, JobSeekerController, EmployerController, AdminController, CompanyController, NotificationController, ContactController)
│       │   ├── dto/ (LoginRequest, RegisterRequest, JobRequest, CompanyRequest, ApplicationRequest, JwtResponse, ApiResponse, DashboardStatsResponse)
│       │   ├── entity/ (User, Role, JobSeekerProfile, EmployerProfile, Company, Job, JobCategory, Skill, Education, Experience, Resume, JobApplication, ApplicationStatusHistory, SavedJob, Notification, ContactMessage)
│       │   ├── exception/ (GlobalExceptionHandler, ResourceNotFoundException, DuplicateResourceException, InvalidFileException, UnauthorizedException)
│       │   ├── repository/ (UserRepository, JobRepository, CompanyRepository, JobApplicationRepository, etc.)
│       │   ├── security/ (JwtTokenProvider, JwtAuthenticationFilter, JwtAuthenticationEntryPoint, UserDetailsImpl, UserDetailsServiceImpl)
│       │   ├── service/ & service/impl/ (AuthService, JobService, ApplicationService, CompanyService, ProfileService, ResumeService, RecommendationService, AdminService, NotificationService)
│       │   ├── specification/ (JobSpecification)
│       │   └── util/ (FileStorageUtil)
│       └── resources/
│           └── application.properties
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/ (Navbar, Footer, JobCard, CompanyCard, SearchBar, JobFilter, Pagination, LoadingSpinner, ErrorMessage, ProtectedRoute, KanbanBoard)
│       ├── context/ (AuthContext.jsx)
│       ├── pages/
│       │   ├── public/ (Home, Jobs, JobDetails, Companies, CompanyDetails, About, Contact, AccessDenied, NotFound)
│       │   ├── auth/ (Login, Register, ForgotPassword)
│       │   ├── jobseeker/ (JobSeekerDashboard, Profile, AppliedJobs, SavedJobs, RecommendedJobs, Notifications)
│       │   ├── employer/ (EmployerDashboard, CompanyProfile, PostJob, ManageJobs, RecruitmentPipeline)
│       │   └── admin/ (AdminDashboard, ManageUsers, ManageJobs, ManageCategories)
│       ├── services/ (api.js, authService.js, jobService.js, applicationService.js, companyService.js, profileService.js, resumeService.js, notificationService.js, adminService.js)
│       ├── routes/ (AppRoutes.jsx)
│       ├── index.css
│       ├── App.jsx
│       └── main.jsx
```

---

## 🔑 Demo Login Credentials

The application automatically seeds sample data on startup:

| Role | Email | Password | Details |
|---|---|---|---|
| **ADMIN** | `admin@jobportal.com` | `admin123` | System Moderator Console |
| **EMPLOYER** | `employer1@techcorp.com` | `employer123` | TechCorp Solutions HR Manager |
| **EMPLOYER** | `employer2@innovate.com` | `employer123` | Innovate Labs Talent Lead |
| **JOB_SEEKER** | `seeker1@gmail.com` | `seeker123` | Senior Java Full Stack Engineer |

---

## 🛠️ How to Run the Application

### 1. Database Setup (MySQL)
Ensure MySQL is running on `localhost:3306`.
The database `job_portal_db` will be automatically created or updated by Hibernate `ddl-auto=update` and auto-populated by Spring `DataInitializer`.

Database properties in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/job_portal_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=password
```

### 2. Backend Setup (Spring Boot)
Open terminal in `backend` directory:
```bash
mvn clean spring-boot:run
```
The REST API server will start on `http://localhost:8080`.

### 3. Frontend Setup (React Vite)
Open terminal in `frontend` directory:
```bash
npm install
npm run dev
```
The React development server will start on `http://localhost:5173`.
