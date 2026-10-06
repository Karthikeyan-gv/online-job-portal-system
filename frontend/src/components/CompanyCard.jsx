import React from 'react';
import { Link } from 'react-router-dom';
import { BiBuilding, BiMap, BiBriefcase } from 'react-icons/bi';

const CompanyCard = ({ company }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 transition-all hover-lift">
      <div className="card-body p-4 text-center d-flex flex-column align-items-center justify-content-between">
        <div className="company-logo bg-light rounded-circle shadow-inner d-flex align-items-center justify-content-center mb-3" style={{ width: 70, height: 70 }}>
          {company.logo ? (
            <img src={`http://localhost:8080/uploads/${company.logo}`} alt={company.name} className="img-fluid rounded-circle" style={{ width: 70, height: 70, objectFit: 'cover' }} />
          ) : (
            <span className="fs-2 fw-bold text-primary">{company.name?.charAt(0)}</span>
          )}
        </div>

        <h5 className="fw-bold text-dark mb-1">{company.name}</h5>
        <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1 mb-2 small">{company.industry || 'IT & Tech'}</span>

        <p className="text-muted small line-clamp-2 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {company.description || 'Leading technology enterprise empowering global digital transformation.'}
        </p>

        <div className="w-100 pt-3 border-top d-flex justify-content-between text-muted small mb-3">
          <span><BiMap className="me-1 text-primary" /> {company.city || 'Chennai'}</span>
          <span><BiBuilding className="me-1 text-primary" /> {company.companySize || '100+'}</span>
        </div>

        <Link to={`/companies/${company.id}`} className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-semibold">
          View Profile & Jobs
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
