import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import KanbanBoard from '../../components/KanbanBoard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BiRefresh, BiBroadcast } from 'react-icons/bi';

const RecruitmentPipeline = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchJobsAndApplications(true);

    // Live Polling every 4 seconds for instant real-time application updates
    const interval = setInterval(() => {
      fetchJobsAndApplications(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedJobId]);

  const fetchJobsAndApplications = async (showInitialLoading = false) => {
    if (showInitialLoading) setLoading(true);
    setIsRefreshing(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobService.getEmployerJobs({ page: 0, size: 50 }),
        applicationService.getEmployerApplications(selectedJobId || null)
      ]);
      setJobs(jobsRes.data?.content || []);
      const appsList = Array.isArray(appsRes.data) ? appsRes.data : (appsRes.data?.content || []);
      setApplications(appsList);
    } catch (err) {
      console.error(err);
    } finally {
      if (showInitialLoading) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus, remarks) => {
    // Optimistically update local application status in Kanban board
    setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, currentStatus: newStatus } : app));
    try {
      await applicationService.updateCandidateStatus(applicationId, newStatus, remarks);
      fetchJobsAndApplications(false);
    } catch (err) {
      alert(err?.toString());
      fetchJobsAndApplications(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading live Kanban pipeline..." />;

  return (
    <div className="pipeline-page bg-light py-5 min-vh-100">
      <div className="container-fluid px-4 py-2">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 extra-small fw-semibold d-flex align-items-center gap-1">
                <BiBroadcast className="fs-6 text-success animate-pulse" /> Live Tracking Active
              </span>
            </div>
            <h3 className="fw-extrabold text-dark mb-1">Recruitment Kanban Pipeline</h3>
            <p className="text-muted small mb-0">Evaluate candidate profiles, inspect resumes, and advance applicants live through stage workflows.</p>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1 fw-semibold"
              onClick={() => fetchJobsAndApplications(false)}
              disabled={isRefreshing}
            >
              <BiRefresh className={`fs-5 ${isRefreshing ? 'spin' : ''}`} /> Refresh Live Board
            </button>

            <div className="d-flex align-items-center gap-2">
              <label className="fw-semibold small text-muted mb-0">Filter Job:</label>
              <select
                className="form-select rounded-pill px-3 shadow-sm"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                style={{ minWidth: 240 }}
              >
                <option value="">All Job Listings ({applications.length} Candidates)</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Render Kanban Board */}
        <KanbanBoard applications={applications} onStatusUpdate={handleStatusUpdate} />
      </div>
    </div>
  );
};

export default RecruitmentPipeline;
