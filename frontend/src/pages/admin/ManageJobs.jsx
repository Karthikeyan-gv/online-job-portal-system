import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { jobService } from '../../services/jobService';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs({ page: 0, size: 50, status: null });
      setJobs(res.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveJob(id);
      fetchJobs();
    } catch (err) {
      alert(err?.toString());
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectJob(id);
      fetchJobs();
    } catch (err) {
      alert(err?.toString());
    }
  };

  if (loading) return <LoadingSpinner message="Loading job moderations..." />;

  return (
    <div className="admin-manage-jobs-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        <h3 className="fw-extrabold text-dark mb-4">Job Moderation & Approvals ({jobs.length})</h3>

        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light extra-small text-uppercase">
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td>
                      <h6 className="fw-bold mb-0 text-dark">{j.title}</h6>
                      <span className="extra-small text-muted">{j.jobType}</span>
                    </td>
                    <td>{j.company?.name}</td>
                    <td>{j.location}</td>
                    <td>
                      <span className={`badge ${j.status === 'ACTIVE' ? 'bg-success-subtle text-success' : j.status === 'PENDING' ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger'}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {j.status !== 'ACTIVE' && (
                        <button className="btn btn-sm btn-success rounded-pill px-3 me-1" onClick={() => handleApprove(j.id)}>
                          Approve
                        </button>
                      )}
                      {j.status !== 'REJECTED' && (
                        <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleReject(j.id)}>
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageJobs;
