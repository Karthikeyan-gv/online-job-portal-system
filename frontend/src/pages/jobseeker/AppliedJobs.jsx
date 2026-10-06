import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { BiBuilding, BiMapPin, BiTrash, BiHistory, BiFile, BiBroadcast, BiRefresh } from 'react-icons/bi';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAppliedJobs(true);

    // Live Polling every 4 seconds to track stage updates live
    const interval = setInterval(() => {
      fetchAppliedJobs(false);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchAppliedJobs = async (showInitialLoading = false) => {
    if (showInitialLoading) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await applicationService.getSeekerApplications({ page: 0, size: 50 });
      const list = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setApplications(list);
    } catch (err) {
      if (showInitialLoading) setError(err?.toString() || 'Failed to load applied jobs');
    } finally {
      if (showInitialLoading) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    setApplications(prev => prev.map(a => a.id === id ? { ...a, currentStatus: 'WITHDRAWN' } : a));
    try {
      await applicationService.withdrawApplication(id);
      fetchAppliedJobs(false);
    } catch (err) {
      alert(err?.toString());
      fetchAppliedJobs(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED': return <span className="badge bg-primary-subtle text-primary fs-6 px-3 py-2 rounded-pill">Applied</span>;
      case 'UNDER_REVIEW': return <span className="badge bg-info-subtle text-info fs-6 px-3 py-2 rounded-pill">Under Review</span>;
      case 'SHORTLISTED': return <span className="badge bg-warning-subtle text-warning fs-6 px-3 py-2 rounded-pill">Shortlisted</span>;
      case 'INTERVIEW': return <span className="badge bg-purple-subtle text-purple fs-6 px-3 py-2 rounded-pill">Interview Stage</span>;
      case 'SELECTED': return <span className="badge bg-success-subtle text-success fs-6 px-3 py-2 rounded-pill">Selected / Hired 🎉</span>;
      case 'REJECTED': return <span className="badge bg-danger-subtle text-danger fs-6 px-3 py-2 rounded-pill">Rejected</span>;
      case 'WITHDRAWN': return <span className="badge bg-secondary-subtle text-secondary fs-6 px-3 py-2 rounded-pill">Withdrawn</span>;
      default: return <span className="badge bg-slate-200 fs-6 px-3 py-2 rounded-pill">{status}</span>;
    }
  };

  if (loading) return <LoadingSpinner message="Loading your submitted applications..." />;

  return (
    <div className="applied-jobs-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 extra-small fw-semibold d-inline-flex align-items-center gap-1 mb-1">
              <BiBroadcast className="fs-6 text-success animate-pulse" /> Live Status Tracking Active
            </span>
            <h3 className="fw-extrabold text-dark mb-0">My Job Applications ({applications.length})</h3>
          </div>
          <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold" onClick={() => fetchAppliedJobs(false)}>
            <BiRefresh className="me-1" /> Refresh Statuses
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        {applications.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <h5 className="fw-bold text-dark">No Applications Found</h5>
            <p className="text-muted">You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <div className="row g-4">
            {applications.map((app) => (
              <div key={app.id} className="col-12">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white hover-lift">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <h5 className="fw-bold text-dark mb-0">{app.job?.title}</h5>
                        {getStatusBadge(app.currentStatus)}
                      </div>
                      <p className="text-muted mb-1 small d-flex align-items-center gap-2">
                        <BiBuilding className="text-primary" /> <span className="fw-semibold text-dark">{app.job?.company?.name}</span>
                        <span>•</span>
                        <BiMapPin className="text-primary" /> {app.job?.location}
                      </p>
                      <span className="extra-small text-muted">Applied on {new Date(app.appliedAt).toLocaleString()}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      {app.currentStatus !== 'WITHDRAWN' && app.currentStatus !== 'REJECTED' && (
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-semibold"
                          onClick={() => handleWithdraw(app.id)}
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
