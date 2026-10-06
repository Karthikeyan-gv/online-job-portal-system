import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public pages
import Home from '../pages/public/Home';
import Jobs from '../pages/public/Jobs';
import JobDetails from '../pages/public/JobDetails';
import Companies from '../pages/public/Companies';
import CompanyDetails from '../pages/public/CompanyDetails';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import AccessDenied from '../pages/public/AccessDenied';
import NotFound from '../pages/public/NotFound';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Job Seeker pages
import JobSeekerDashboard from '../pages/jobseeker/JobSeekerDashboard';
import Profile from '../pages/jobseeker/Profile';
import AppliedJobs from '../pages/jobseeker/AppliedJobs';
import SavedJobs from '../pages/jobseeker/SavedJobs';
import RecommendedJobs from '../pages/jobseeker/RecommendedJobs';
import Notifications from '../pages/jobseeker/Notifications';

// Employer pages
import EmployerDashboard from '../pages/employer/EmployerDashboard';
import CompanyProfile from '../pages/employer/CompanyProfile';
import PostJob from '../pages/employer/PostJob';
import ManageJobs from '../pages/employer/ManageJobs';
import RecruitmentPipeline from '../pages/employer/RecruitmentPipeline';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import AdminManageJobs from '../pages/admin/ManageJobs';
import ManageCategories from '../pages/admin/ManageCategories';

// Protected Route Guard
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/companies/:id" element={<CompanyDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Job Seeker Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER', 'ROLE_ADMIN']} />}>
        <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
        <Route path="/jobseeker/profile" element={<Profile />} />
        <Route path="/jobseeker/applied-jobs" element={<AppliedJobs />} />
        <Route path="/jobseeker/saved-jobs" element={<SavedJobs />} />
        <Route path="/jobseeker/recommendations" element={<RecommendedJobs />} />
        <Route path="/jobseeker/notifications" element={<Notifications />} />
      </Route>

      {/* Protected Employer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_EMPLOYER', 'ROLE_ADMIN']} />}>
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/company-profile" element={<CompanyProfile />} />
        <Route path="/employer/post-job" element={<PostJob />} />
        <Route path="/employer/manage-jobs" element={<ManageJobs />} />
        <Route path="/employer/pipeline" element={<RecruitmentPipeline />} />
        <Route path="/employer/notifications" element={<Notifications />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-jobs" element={<AdminManageJobs />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
