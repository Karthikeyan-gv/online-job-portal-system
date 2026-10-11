import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BiBuilding, BiMapPin, BiBriefcase, BiMoney, BiBookmark, 
  BiBookmarkHeart, BiLaptop, BiNetworkChart, BiTime, BiCalendar,
  BiCodeAlt, BiBrain, BiCloud, BiShieldQuarter, BiPlusMedical, BiTargetLock, BiUserCheck
} from 'react-icons/bi';
import { profileService } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import CompanyLogo from './CompanyLogo';

const getWorkModeIcon = (mode = '') => {
  const m = mode.toUpperCase();
  if (m === 'REMOTE') return <BiLaptop className="me-1" />;
  if (m === 'HYBRID') return <BiNetworkChart className="me-1" />;
  return <BiBuilding className="me-1" />;
};

const getCategoryIcon = (name = '') => {
  const n = (name || '').toLowerCase();
  if (n.includes('software') || n.includes('development')) return <BiCodeAlt className="me-1" />;
  if (n.includes('ai') || n.includes('data')) return <BiBrain className="me-1" />;
  if (n.includes('cloud') || n.includes('devops')) return <BiCloud className="me-1" />;
  if (n.includes('cyber') || n.includes('security')) return <BiShieldQuarter className="me-1" />;
  if (n.includes('health') || n.includes('medical')) return <BiPlusMedical className="me-1" />;
  if (n.includes('sales')) return <BiTargetLock className="me-1" />;
  if (n.includes('hr') || n.includes('talent')) return <BiUserCheck className="me-1" />;
  return <BiBriefcase className="me-1" />;
};

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
    : 'Competitive Salary';

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 job-card hover-lift transition-all">
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div className="d-flex align-items-center gap-3">
              <CompanyLogo company={job.company} size={52} rounded="rounded-3" />
              <div>
                <h5 className="card-title fw-bold text-dark mb-1 hover-text-primary">
                  <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">{job.title}</Link>
                </h5>
                <p className="text-muted mb-0 small d-flex align-items-center">
                  <BiBuilding className="me-1 text-primary" /> {job.company?.name || 'Company'}
                </p>
              </div>
            </div>

            {isAuthenticated && isJobSeeker() ? (
              <button
                className={`btn btn-link p-2 rounded-circle ${saved ? 'text-danger' : 'text-muted'} border-0`}
                onClick={handleSaveToggle}
                disabled={saving}
                title={saved ? 'Unsave Job' : 'Save Job'}
              >
                {saved ? <BiBookmarkHeart className="fs-4 text-danger" /> : <BiBookmark className="fs-4" />}
              </button>
            ) : !isAuthenticated ? (
              <Link
                to={`/login?redirect=/jobs/${job.id}`}
                className="btn btn-link p-2 rounded-circle text-muted border-0"
                title="Login to save job"
              >
                <BiBookmark className="fs-4" />
              </Link>
            ) : null}
          </div>

          <div className="d-flex flex-wrap gap-2 my-3">
            {job.category?.name && (
              <span className="badge bg-purple-subtle text-purple rounded-pill px-3 py-1.5 small fw-semibold d-inline-flex align-items-center">
                {getCategoryIcon(job.category.name)} {job.category.name}
              </span>
            )}
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1.5 small fw-medium d-inline-flex align-items-center">
              <BiBriefcase className="me-1" /> {job.jobType?.replace('_', ' ')}
            </span>
            <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1.5 small fw-medium d-inline-flex align-items-center">
              {getWorkModeIcon(job.workMode)} {job.workMode}
            </span>
            <span className="badge bg-info-subtle text-info rounded-pill px-3 py-1.5 small fw-medium d-inline-flex align-items-center">
              <BiMapPin className="me-1" /> {job.location || 'Remote'}
            </span>
          </div>

          <div className="small text-muted mb-3 d-flex align-items-center flex-wrap gap-2">
            <span className="d-inline-flex align-items-center fw-semibold text-dark me-2">
              <BiMoney className="me-1 text-success fs-5" /> {formattedSalary}
            </span>
            <span className="d-inline-flex align-items-center">
              <BiTime className="me-1 text-muted" /> Exp: {job.experienceRequired || 0}+ yrs
            </span>
          </div>

          <p className="text-slate-600 small line-clamp-2 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.description}
          </p>
        </div>

        <div className="pt-3 border-top d-flex align-items-center justify-content-between">
          <span className="small text-muted d-inline-flex align-items-center">
            <BiCalendar className="me-1 text-muted" /> {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
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
