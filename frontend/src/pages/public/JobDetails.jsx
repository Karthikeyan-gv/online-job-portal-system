import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { resumeService } from '../../services/resumeService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { 
  BiBuilding, BiMapPin, BiBriefcase, BiMoney, BiCalendar, 
  BiCheckCircle, BiShareAlt, BiBookmark, BiFile, BiArrowBack 
} from 'react-icons/bi';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isJobSeeker } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobById(id);
      setJob(res.data);
    } catch (err) {
      setError(err?.toString() || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApplyModal = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isJobSeeker()) {
      alert('Only registered job seekers can apply for jobs.');
      return;
    }
    setShowApplyModal(true);
    try {
      const res = await resumeService.getResumes();
      const list = res.data || [];
      setResumes(list);
      const primary = list.find(r => r.isPrimary);
      if (primary) setSelectedResumeId(primary.id);
      else if (list.length > 0) setSelectedResumeId(list[0].id);
    } catch (err) {
      console.error('Failed to load candidate resumes', err);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyError(null);
    try {
      await applicationService.applyForJob({
        jobId: job.id,
        resumeId: selectedResumeId ? parseInt(selectedResumeId) : null,
        coverLetter
      });
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(false);
      }, 2000);
    } catch (err) {
      setApplyError(err?.toString() || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading job specifications..." />;
  if (error) return <div className="container py-5"><ErrorMessage message={error} /></div>;
  if (!job) return null;

  return (
    <div className="job-details-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        <Link to="/jobs" className="btn btn-link text-decoration-none text-muted mb-4 d-inline-flex align-items-center gap-1">
          <BiArrowBack /> Back to Job Search
        </Link>

        {/* Job Header Card */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-4 mb-3">
                <div className="company-logo bg-primary-subtle text-primary rounded-4 d-flex align-items-center justify-content-center fw-bold" style={{ width: 70, height: 70, fontSize: '1.75rem' }}>
                  {job.company?.logo ? (
                    <img src={`http://localhost:8080/uploads/${job.company.logo}`} alt={job.company?.name} className="img-fluid rounded-4" style={{ width: 70, height: 70, objectFit: 'cover' }} />
                  ) : (
                    job.company?.name?.charAt(0) || 'C'
                  )}
                </div>
                <div>
                  <h2 className="fw-extrabold text-dark mb-1">{job.title}</h2>
                  <p className="text-muted mb-0 d-flex align-items-center gap-2">
                    <BiBuilding className="text-primary" /> <span className="fw-semibold text-dark">{job.company?.name}</span>
                    <span>•</span>
                    <BiMapPin className="text-primary" /> {job.location || 'Remote'}
                  </p>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3 mt-3">
                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-medium">
                  <BiBriefcase className="me-1" /> {job.jobType?.replace('_', ' ')}
                </span>
                <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 fw-medium">
                  {job.workMode}
                </span>
                <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-2 fw-medium">
                  <BiMoney className="me-1" /> ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L PA
                </span>
                <span className="badge bg-slate-100 text-slate-700 rounded-pill px-3 py-2 fw-medium">
                  Exp: {job.experienceRequired || 0}+ Years
                </span>
              </div>
            </div>

            <div className="col-lg-4 text-lg-end">
              <button className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-sm mb-2 w-100 w-lg-auto" onClick={handleOpenApplyModal}>
                Apply Now
              </button>
              <div className="small text-muted mt-2">
                Deadline: {job.applicationDeadline || 'Open until filled'}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3">Job Description</h5>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line mb-4">{job.description}</p>

              {job.responsibilities && (
                <>
                  <h5 className="fw-bold text-dark mb-3">Responsibilities</h5>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line mb-4">{job.responsibilities}</p>
                </>
              )}

              {job.requirements && (
                <>
                  <h5 className="fw-bold text-dark mb-3">Requirements & Skills</h5>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line mb-4">{job.requirements}</p>
                </>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <h6 className="fw-bold text-dark mb-3">Required Technical Skills</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {job.skills.map(s => (
                      <span key={s.id} className="badge bg-slate-100 text-slate-800 border rounded-pill px-3 py-2 small">{s.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold text-dark mb-3">Company Overview</h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-light rounded-circle p-3 d-flex align-items-center justify-content-center fw-bold text-primary fs-4" style={{ width: 50, height: 50 }}>
                  {job.company?.name?.charAt(0)}
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark">{job.company?.name}</h6>
                  <span className="small text-muted">{job.company?.industry || 'IT Services'}</span>
                </div>
              </div>
              <p className="text-muted small mb-3">{job.company?.description}</p>

              <div className="border-top pt-3 small text-muted">
                <p className="mb-2"><strong>Location:</strong> {job.company?.city}, {job.company?.country}</p>
                <p className="mb-2"><strong>Company Size:</strong> {job.company?.companySize || '100+ Employees'}</p>
                {job.company?.website && (
                  <p className="mb-0">
                    <strong>Website:</strong> <a href={job.company.website} target="_blank" rel="noreferrer" className="text-primary">{job.company.website}</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="modal show d-block backdrop-blur" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-2xl p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Apply for {job.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowApplyModal(false)}></button>
              </div>
              <div className="modal-body">
                {applySuccess ? (
                  <div className="text-center py-4 text-success">
                    <BiCheckCircle className="display-1 mb-2" />
                    <h5 className="fw-bold">Application Submitted!</h5>
                    <p className="small text-muted mb-0">The employer has been notified of your application.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitApplication}>
                    {applyError && <ErrorMessage message={applyError} />}

                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label className="form-label fw-semibold small text-muted mb-0">Select Resume *</label>
                      </div>
                      {resumes.length === 0 ? (
                        <div className="border rounded-3 p-3 bg-light text-center">
                          <p className="small text-muted mb-2">No resume uploaded to your profile yet.</p>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            id="quickResumeInput"
                            className="d-none"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              setSubmitting(true);
                              try {
                                const uploadedRes = await resumeService.uploadResume(file, true);
                                const newResume = uploadedRes.data;
                                setResumes([newResume]);
                                setSelectedResumeId(newResume.id);
                              } catch (err) {
                                setApplyError('Failed to upload resume: ' + err?.toString());
                              } finally {
                                setSubmitting(false);
                              }
                            }}
                          />
                          <label htmlFor="quickResumeInput" className="btn btn-outline-primary btn-sm rounded-pill px-3 cursor-pointer">
                            <BiFile className="me-1" /> Choose Resume File
                          </label>
                        </div>
                      ) : (
                        <div>
                          <select
                            className="form-select rounded-3 mb-2"
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                            required
                          >
                            {resumes.map(r => (
                              <option key={r.id} value={r.id}>
                                {r.fileName} {r.isPrimary ? '(Primary)' : ''}
                              </option>
                            ))}
                          </select>
                          <div className="text-end">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              id="quickResumeInput"
                              className="d-none"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setSubmitting(true);
                                try {
                                  const uploadedRes = await resumeService.uploadResume(file, false);
                                  const newResume = uploadedRes.data;
                                  setResumes(prev => [...prev, newResume]);
                                  setSelectedResumeId(newResume.id);
                                } catch (err) {
                                  setApplyError('Failed to upload resume: ' + err?.toString());
                                } finally {
                                  setSubmitting(false);
                                }
                              }}
                            />
                            <label htmlFor="quickResumeInput" className="small text-primary fw-semibold cursor-pointer text-decoration-none">
                              + Upload New Resume File
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Cover Letter (Optional)</label>
                      <textarea
                        className="form-control rounded-3"
                        rows="4"
                        placeholder="Briefly explain why you are a great fit for this position..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowApplyModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary rounded-pill px-5 fw-bold" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
