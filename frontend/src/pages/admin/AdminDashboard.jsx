import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  BiUserCheck, BiBuilding, BiBriefcase, BiListCheck, 
  BiCheckCircle, BiXCircle, BiShieldQuarter, BiTask 
} from 'react-icons/bi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, jobsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPendingJobs({ page: 0, size: 5 })
      ]);
      setStats(statsRes.data);
      setPendingJobs(jobsRes.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveJob(id);
      fetchAdminData();
    } catch (err) {
      alert(err?.toString());
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectJob(id);
      fetchAdminData();
    } catch (err) {
      alert(err?.toString());
    }
  };

  if (loading) return <LoadingSpinner message="Loading Admin Operations console..." />;

  return (
    <div className="admin-dashboard bg-light py-5 min-vh-100">
      <div className="container py-3">
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-slate-950 text-white">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-1 fw-semibold mb-2">Admin Portal</span>
              <h3 className="fw-extrabold mb-1">System Control & Moderation</h3>
              <p className="text-slate-400 small mb-0">Platform overview, user access governance, and job posting review console.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-primary mb-1">{stats?.totalUsers || 0}</span>
              <span className="small text-muted fw-semibold">Total Registered Users</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-info mb-1">{stats?.totalCompanies || 0}</span>
              <span className="small text-muted fw-semibold">Active Companies</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-success mb-1">{stats?.activeJobs || 0}</span>
              <span className="small text-muted fw-semibold">Active Job Listings</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
              <span className="fs-3 fw-extrabold text-warning mb-1">{stats?.totalApplications || 0}</span>
              <span className="small text-muted fw-semibold">System Applications</span>
            </div>
          </div>
        </div>

        {/* Quick Admin Actions & Pending Jobs */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h5 className="fw-bold text-dark mb-0">Jobs Pending Moderation ({pendingJobs.length})</h5>
                <Link to="/admin/manage-jobs" className="small text-primary fw-semibold text-decoration-none">View All Pending</Link>
              </div>

              {pendingJobs.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No jobs currently pending moderation.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light extra-small text-uppercase">
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th className="text-end">Moderation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingJobs.map(j => (
                        <tr key={j.id}>
                          <td className="fw-bold text-dark">{j.title}</td>
                          <td>{j.company?.name}</td>
                          <td>{j.location}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-success rounded-pill px-3 me-1" onClick={() => handleApprove(j.id)}>
                              Approve
                            </button>
                            <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleReject(j.id)}>
                              Reject
                            </button>
                          </td>
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
              <h5 className="fw-bold text-dark mb-3">Admin Controls</h5>
              <div className="d-flex flex-column gap-2">
                <Link to="/admin/manage-users" className="btn btn-light text-start p-3 rounded-3 fw-semibold text-dark">
                  Manage Users & Block Access
                </Link>
                <Link to="/admin/manage-jobs" className="btn btn-light text-start p-3 rounded-3 fw-semibold text-dark">
                  Pending Job Approval Queue
                </Link>
                <Link to="/admin/categories" className="btn btn-light text-start p-3 rounded-3 fw-semibold text-dark">
                  Manage Categories & Master Skills
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
