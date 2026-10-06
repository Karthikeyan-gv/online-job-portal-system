import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BiBriefcase, BiUserCheck, BiPlusCircle, BiGridAlt, BiBuilding, BiTask, BiRightArrowAlt } from 'react-icons/bi';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployerData();
  }, []);

  const fetchEmployerData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobService.getEmployerJobs({ page: 0, size: 20 }),
        applicationService.getEmployerApplications()
      ]);
      setJobs(jobsRes.data?.content || []);
      setApplications(appsRes.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading employer metrics..." />;

  const counts = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'ACTIVE').length,
    totalApps: applications.length,
    shortlisted: applications.filter(a => a.currentStatus === 'SHORTLISTED').length,
    interview: applications.filter(a => a.currentStatus === 'INTERVIEW').length,
    selected: applications.filter(a => a.currentStatus === 'SELECTED').length,
  };

  return (
    <div className="employer-dashboard bg-light py-5 min-vh-100">
      <div className="container py-3">
        {/* Banner */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-slate-900 text-white">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fw-semibold mb-2">Employer Console</span>
              <h3 className="fw-extrabold mb-1">Recruitment Overview</h3>
              <p className="text-slate-400 small mb-0">Manage job postings and evaluate candidate pipelines in real time.</p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/employer/post-job" className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm">
                + Post New Job
              </Link>
              <Link to="/employer/pipeline" className="btn btn-outline-light rounded-pill px-4 fw-semibold">
                Kanban Pipeline
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-primary mb-1">{counts.totalJobs}</span>
              <span className="small text-muted fw-semibold">Total Posted Jobs</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-success mb-1">{counts.activeJobs}</span>
              <span className="small text-muted fw-semibold">Active Jobs</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-info mb-1">{counts.totalApps}</span>
              <span className="small text-muted fw-semibold">Total Applicants</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-warning mb-1">{counts.shortlisted + counts.interview}</span>
              <span className="small text-muted fw-semibold">Candidates In Pipeline</span>
            </div>
          </div>
        </div>

        {/* Action Quick Links */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h5 className="fw-bold text-dark mb-0">Recent Candidate Applications</h5>
                <Link to="/employer/pipeline" className="small text-primary fw-semibold text-decoration-none">Open Kanban</Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-4 text-muted">No applications received yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light extra-small text-uppercase">
                      <tr>
                        <th>Candidate</th>
                        <th>Job Role</th>
                        <th>Applied Date</th>
                        <th>Stage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map(app => (
                        <tr key={app.id}>
                          <td className="fw-bold">{app.seekerProfile?.firstName} {app.seekerProfile?.lastName}</td>
                          <td>{app.job?.title}</td>
                          <td className="small text-muted">{new Date(app.appliedAt).toLocaleDateString()}</td>
                          <td><span className="badge bg-primary-subtle text-primary">{app.currentStatus}</span></td>
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
              <h5 className="fw-bold text-dark mb-3">Quick Navigation</h5>
              <div className="d-flex flex-column gap-2">
                <Link to="/employer/post-job" className="btn btn-light text-start p-3 rounded-3 fw-semibold text-dark d-flex align-items-center justify-content-between">
                  <span>Post a New Opening</span>
                  <BiRightArrowAlt className="fs-4 text-primary" />
                </Link>
                <Link to="/employer/manage-jobs" className="btn btn-light text-start p-3 rounded-3 fw-semibold text-dark d-flex align-items-center justify-content-between">
                  <span>Manage Active Job Listings</span>
                  <BiRightArrowAlt className="fs-4 text-primary" />
                </Link>
                <Link to="/employer/company-profile" className="btn btn-light text-start p-3 rounded-3 fw-semibold text-dark d-flex align-items-center justify-content-between">
                  <span>Update Company Profile & Logo</span>
                  <BiRightArrowAlt className="fs-4 text-primary" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
