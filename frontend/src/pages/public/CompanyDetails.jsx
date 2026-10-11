import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { jobService } from '../../services/jobService';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BiBuilding, BiGlobe, BiEnvelope, BiPhone, BiMapPin, BiBriefcase, BiCheckShield, BiGroup } from 'react-icons/bi';
import CompanyLogo from '../../components/CompanyLogo';

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
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <CompanyLogo company={company} size={84} rounded="rounded-4" className="shadow-sm" />
            <div>
              <h2 className="fw-extrabold text-dark mb-1 d-flex align-items-center">
                {company.name}
                <BiCheckShield className="text-primary ms-2 fs-4" title="Verified Enterprise" />
              </h2>
              <p className="text-muted mb-2 d-flex align-items-center gap-2 flex-wrap">
                <span className="d-flex align-items-center gap-1">
                  <BiBuilding className="text-primary" /> {company.industry || 'Software & Services'}
                </span>
                <span>•</span>
                <span className="d-flex align-items-center gap-1">
                  <BiMapPin className="text-primary" /> {company.city}, {company.country}
                </span>
              </p>
              <div className="d-flex gap-3 small text-muted flex-wrap">
                {company.website && (
                  <span className="d-flex align-items-center gap-1">
                    <BiGlobe className="text-primary" /> 
                    <a href={company.website} target="_blank" rel="noreferrer" className="text-primary text-decoration-none">{company.website}</a>
                  </span>
                )}
                {company.companySize && (
                  <span className="d-flex align-items-center gap-1">
                    <BiGroup className="text-primary" /> Size: {company.companySize}
                  </span>
                )}
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
