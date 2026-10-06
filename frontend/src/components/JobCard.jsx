import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiBuilding, BiMapPin, BiBriefcase, BiMoney, BiBookmark, BiBookmarkHeart } from 'react-icons/bi';
import { profileService } from '../services/profileService';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job, isSavedInitial = false, onSaveToggle }) => {
  const { isJobSeeker, isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !isJobSeeker()) return;
    setSaving(true);
    try {
      if (saved) {
        await profileService.removeSavedJob(job.id);
        setSaved(false);
      } else {
        await profileService.saveJob(job.id);
        setSaved(true);
      }
      if (onSaveToggle) onSaveToggle(job.id, !saved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const formattedSalary = job.salaryMin && job.salaryMax
    ? `₹${(job.salaryMin / 100000).toFixed(1)}L - ₹${(job.salaryMax / 100000).toFixed(1)}L PA`
    : 'Salary Not Disclosed';

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 job-card hover-lift transition-all">
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div className="d-flex align-items-center gap-3">
              <div className="company-logo-placeholder bg-primary-subtle text-primary fw-bold rounded-3 d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, fontSize: '1.25rem' }}>
                {job.company?.logo ? (
                  <img src={`http://localhost:8080/uploads/${job.company.logo}`} alt={job.company?.name} className="img-fluid rounded-3" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                ) : (
                  job.company?.name?.charAt(0).toUpperCase() || 'C'
                )}
              </div>
              <div>
                <h5 className="card-title fw-bold text-dark mb-1 hover-text-primary">
                  <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">{job.title}</Link>
                </h5>
                <p className="text-muted mb-0 small d-flex align-items-center">
                  <BiBuilding className="me-1" /> {job.company?.name || 'Company'}
                </p>
              </div>
            </div>

            {isAuthenticated && isJobSeeker() && (
              <button
                className={`btn btn-link p-2 rounded-circle ${saved ? 'text-danger' : 'text-muted'} border-0`}
                onClick={handleSaveToggle}
                disabled={saving}
                title={saved ? 'Unsave Job' : 'Save Job'}
              >
                {saved ? <BiBookmarkHeart className="fs-4 text-danger" /> : <BiBookmark className="fs-4" />}
              </button>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2 my-3">
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 small fw-medium">
              <BiBriefcase className="me-1" /> {job.jobType?.replace('_', ' ')}
            </span>
            <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 small fw-medium">
              {job.workMode}
            </span>
            <span className="badge bg-info-subtle text-info rounded-pill px-3 py-2 small fw-medium">
              <BiMapPin className="me-1" /> {job.location || 'Remote'}
            </span>
          </div>

          <div className="small text-muted mb-3 d-flex align-items-center">
            <BiMoney className="me-1 text-success fs-5" />
            <span className="fw-semibold text-dark me-3">{formattedSalary}</span>
            <span>Exp: {job.experienceRequired || 0}+ yrs</span>
          </div>

          <p className="text-slate-600 small line-clamp-2 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.description}
          </p>
        </div>

        <div className="pt-3 border-top d-flex align-items-center justify-content-between">
          <span className="small text-muted">
            Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
          </span>
          <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-semibold">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
