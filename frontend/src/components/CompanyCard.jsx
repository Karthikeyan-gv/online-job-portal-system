import React from 'react';
import { Link } from 'react-router-dom';
import { BiBuilding, BiMapPin, BiBriefcase, BiCheckShield, BiGroup } from 'react-icons/bi';
import CompanyLogo from './CompanyLogo';

const CompanyCard = ({ company }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 transition-all hover-lift overflow-hidden bg-white">
      {/* Decorative Brand Header Banner */}
      <div 
        className="w-100 position-relative" 
        style={{ 
          height: '70px', 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' 
        }}
      >
        <span 
          className="badge bg-white text-primary rounded-pill position-absolute extra-small fw-semibold shadow-sm"
          style={{ top: '10px', right: '12px' }}
        >
          ● Actively Hiring
        </span>
      </div>

      <div className="card-body p-4 pt-0 text-center d-flex flex-column align-items-center justify-content-between flex-grow-1">
        <div style={{ marginTop: '-36px' }} className="mb-2">
          <CompanyLogo company={company} size={70} rounded="rounded-4" className="border border-3 border-white shadow" />
        </div>

        <div className="mb-2">
          <h5 className="fw-bold text-dark mb-1 d-inline-flex align-items-center justify-content-center">
            {company.name}
            <BiCheckShield className="text-primary ms-1.5 fs-5" title="Verified Employer" />
          </h5>
          <div>
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 small fw-semibold">
              <BiBuilding className="me-1" /> {company.industry || 'IT & Tech'}
            </span>
          </div>
        </div>

        <p className="text-muted small line-clamp-2 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {company.description || 'Leading enterprise empowering world-class digital innovation and global talent.'}
        </p>

        <div className="w-100 pt-3 border-top d-flex justify-content-between text-muted small mb-3">
          <span className="d-flex align-items-center"><BiMapPin className="me-1 text-primary" /> {company.city || 'Remote'}</span>
          <span className="d-flex align-items-center"><BiGroup className="me-1 text-primary" /> {company.companySize || '100+'}</span>
        </div>

        <Link to={`/companies/${company.id}`} className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-semibold py-2">
          Explore Company & Jobs
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
