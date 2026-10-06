import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { BiPlusCircle, BiEdit, BiTrash, BiPowerOff } from 'react-icons/bi';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getEmployerJobs({ page: 0, size: 50 });
      setJobs(res.data?.content || []);
    } catch (err) {
      setError(err?.toString() || 'Failed to fetch employer jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await jobService.toggleJobStatus(id);
      fetchJobs();
    } catch (err) {
      alert(err?.toString());
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await jobService.deleteJob(id);
      fetchJobs();
    } catch (err) {
      alert(err?.toString());
    }
  };

  if (loading) return <LoadingSpinner message="Loading posted job listings..." />;

  return (
    <div className="manage-jobs-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-extrabold text-dark mb-1">Manage Job Postings ({jobs.length})</h3>
            <p className="text-muted small mb-0">Activate, deactivate, or edit job specifications posted by your company.</p>
          </div>
          <Link to="/employer/post-job" className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm">
            + Post New Job
          </Link>
        </div>

        {error && <ErrorMessage message={error} />}

        {jobs.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <h5 className="fw-bold text-dark">No Jobs Posted Yet</h5>
            <p className="text-muted">Create your first job post to start receiving candidate applications.</p>
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light extra-small text-uppercase">
                  <tr>
                    <th>Job Title</th>
                    <th>Type & Mode</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Posted Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id}>
                      <td>
                        <h6 className="fw-bold mb-0 text-dark">{j.title}</h6>
                        <span className="extra-small text-muted">{j.location}</span>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary extra-small me-1">{j.jobType?.replace('_', ' ')}</span>
                        <span className="badge bg-info-subtle text-info extra-small">{j.workMode}</span>
                      </td>
                      <td className="fw-semibold text-success small">
                        ₹{(j.salaryMin / 100000).toFixed(1)}L - ₹{(j.salaryMax / 100000).toFixed(1)}L
                      </td>
                      <td>
                        <span className={`badge ${j.status === 'ACTIVE' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {j.status}
                        </span>
                      </td>
                      <td className="small text-muted">{new Date(j.createdAt).toLocaleDateString()}</td>
                      <td className="text-end">
                        <button
                          className={`btn btn-sm rounded-circle me-1 ${j.status === 'ACTIVE' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          title="Toggle Active/Deactive"
                          onClick={() => handleToggleStatus(j.id)}
                        >
                          <BiPowerOff />
                        </button>
                        <button className="btn btn-outline-danger btn-sm rounded-circle" title="Delete Job" onClick={() => handleDeleteJob(j.id)}>
                          <BiTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
