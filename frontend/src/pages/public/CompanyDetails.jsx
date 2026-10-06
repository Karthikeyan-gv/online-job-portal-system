import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { jobService } from '../../services/jobService';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BiBuilding, BiGlobe, BiEnvelope, BiPhone, BiMapPin, BiBriefcase } from 'react-icons/bi';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [openJobs, setOpenJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [compRes, jobsRes] = await Promise.all([
          companyService.getCompanyById(id),
          jobService.getJobs({ page: 0, size: 20 })
        ]);
        setCompany(compRes.data);
        const filtered = (jobsRes.data?.content || []).filter(j => j.company?.id === parseInt(id));
        setOpenJobs(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading company details..." />;
  if (!company) return <div className="container py-5">Company not found</div>;

  return (
    <div className="company-details-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        {/* Banner Card */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="d-flex align-items-center gap-4">
            <div className="company-logo bg-primary-subtle text-primary rounded-4 d-flex align-items-center justify-content-center fw-bold fs-1" style={{ width: 80, height: 80 }}>
              {company.logo ? (
                <img src={`http://localhost:8080/uploads/${company.logo}`} alt={company.name} className="img-fluid rounded-4" style={{ width: 80, height: 80, objectFit: 'cover' }} />
              ) : (
                company.name?.charAt(0)
              )}
            </div>
            <div>
              <h2 className="fw-extrabold text-dark mb-1">{company.name}</h2>
              <p className="text-muted mb-2 d-flex align-items-center gap-2">
                <BiBuilding className="text-primary" /> {company.industry || 'Software & Services'}
                <span>•</span>
                <BiMapPin className="text-primary" /> {company.city}, {company.country}
              </p>
              <div className="d-flex gap-3 small text-muted">
                {company.website && <span><BiGlobe className="me-1 text-primary" /> <a href={company.website} target="_blank" rel="noreferrer">{company.website}</a></span>}
                {company.companySize && <span>Size: {company.companySize}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <h5 className="fw-bold text-dark mb-3">About {company.name}</h5>
          <p className="text-slate-700 leading-relaxed">{company.description || 'No description provided.'}</p>
        </div>

        {/* Open Job Listings */}
        <h4 className="fw-bold text-dark mb-3">Open Positions at {company.name} ({openJobs.length})</h4>
        {openJobs.length === 0 ? (
          <div className="bg-white rounded-4 p-4 shadow-sm text-center text-muted">
            No active job openings currently posted by this company.
          </div>
        ) : (
          <div className="row g-4">
            {openJobs.map(job => (
              <div key={job.id} className="col-md-6">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;
