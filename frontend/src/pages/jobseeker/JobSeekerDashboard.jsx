import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { profileService } from '../../services/profileService';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  BiBriefcaseAlt2, BiCheckCircle, BiTimeFive, BiStar, 
  BiXCircle, BiBookmark, BiUserCircle, BiFile 
} from 'react-icons/bi';

const JobSeekerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profRes, appsRes, savedRes, recRes] = await Promise.all([
        profileService.getProfile(),
        applicationService.getSeekerApplications({ page: 0, size: 5 }),
        profileService.getSavedJobs({ page: 0, size: 5 }),
        profileService.getRecommendations()
      ]);
      setProfile(profRes.data);
      setApplications(appsRes.data?.content || []);
      setSavedJobs(savedRes.data?.content || []);
      setRecommendations(recRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED': return <span className="badge bg-primary-subtle text-primary">Applied</span>;
      case 'UNDER_REVIEW': return <span className="badge bg-info-subtle text-info">Under Review</span>;
      case 'SHORTLISTED': return <span className="badge bg-warning-subtle text-warning">Shortlisted</span>;
      case 'INTERVIEW': return <span className="badge bg-purple-subtle text-purple">Interview</span>;
      case 'SELECTED': return <span className="badge bg-success-subtle text-success">Selected</span>;
      case 'REJECTED': return <span className="badge bg-danger-subtle text-danger">Rejected</span>;
      default: return <span className="badge bg-secondary-subtle text-secondary">{status}</span>;
    }
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  const counts = {
    total: applications.length,
    shortlisted: applications.filter(a => a.currentStatus === 'SHORTLISTED').length,
    interview: applications.filter(a => a.currentStatus === 'INTERVIEW').length,
    selected: applications.filter(a => a.currentStatus === 'SELECTED').length,
  };

  return (
    <div className="jobseeker-dashboard bg-light py-5 min-vh-100">
      <div className="container py-3">
        {/* Welcome Header */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-gradient-dark text-white">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: 60, height: 60 }}>
                {profile?.firstName?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="fw-extrabold mb-1">Welcome back, {profile?.firstName || 'Candidate'}!</h3>
                <p className="text-slate-300 small mb-0">{profile?.headline || 'Java Full Stack Developer'}</p>
              </div>
            </div>
            <Link to="/jobseeker/profile" className="btn btn-outline-light rounded-pill px-4 fw-semibold">
              <BiUserCircle className="me-1" /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-primary mb-1">{counts.total}</span>
              <span className="small text-muted fw-semibold">Total Applications</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-warning mb-1">{counts.shortlisted}</span>
              <span className="small text-muted fw-semibold">Shortlisted</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-info mb-1">{counts.interview}</span>
              <span className="small text-muted fw-semibold">Interviews Scheduled</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-success mb-1">{counts.selected}</span>
              <span className="small text-muted fw-semibold">Offers Received</span>
            </div>
          </div>
        </div>

        {/* Recent Applications & Recommended Jobs */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h5 className="fw-bold text-dark mb-0">Recent Job Applications</h5>
                <Link to="/jobseeker/applied-jobs" className="small text-primary fw-semibold text-decoration-none">View All</Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No job applications submitted yet. <Link to="/jobs">Search jobs now</Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light extra-small text-uppercase">
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id}>
                          <td><span className="fw-bold text-dark">{app.job?.title}</span></td>
                          <td>{app.job?.company?.name}</td>
                          <td className="small text-muted">{new Date(app.appliedAt).toLocaleDateString()}</td>
                          <td>{getStatusBadge(app.currentStatus)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">Recommended For You</h5>
              <div className="d-flex flex-column gap-3">
                {recommendations.slice(0, 3).map((job) => (
                  <div key={job.id} className="border-bottom pb-2">
                    <h6 className="fw-bold mb-1">
                      <Link to={`/jobs/${job.id}`} className="text-dark text-decoration-none hover-text-primary">{job.title}</Link>
                    </h6>
                    <p className="extra-small text-muted mb-1">{job.company?.name} • {job.location}</p>
                    <span className="badge bg-success-subtle text-success extra-small">₹{(job.salaryMin/100000).toFixed(1)}L - ₹{(job.salaryMax/100000).toFixed(1)}L</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
