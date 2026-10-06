import React, { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BiBuilding, BiCloudUpload, BiCheckCircle } from 'react-icons/bi';

const CompanyProfile = () => {
  const [company, setCompany] = useState({
    name: '',
    industry: 'Software & Services',
    companySize: '100-500',
    foundedYear: 2020,
    website: '',
    email: '',
    phone: '',
    description: '',
    city: '',
    state: '',
    country: 'India'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await companyService.getAllCompanies({ page: 0, size: 1 });
      if (res.data?.content?.length > 0) {
        setCompany(res.data.content[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await companyService.saveEmployerCompany(company);
      setMessage('Company Profile saved successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      alert(err?.toString());
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !company.id) return;
    try {
      const res = await companyService.uploadLogo(company.id, file);
      setCompany(res.data);
      alert('Logo uploaded successfully!');
    } catch (err) {
      alert(err?.toString());
    }
  };

  if (loading) return <LoadingSpinner message="Loading company branding profile..." />;

  return (
    <div className="company-profile-page bg-light py-5 min-vh-100">
      <div className="container py-3 max-w-3xl">
        <div className="card border-0 shadow-lg rounded-5 p-4 p-md-5 bg-white">
          <h3 className="fw-extrabold text-dark mb-1">Company Profile & Branding</h3>
          <p className="text-muted small mb-4">Set up your enterprise profile so candidates can learn about your organization.</p>

          {message && <div className="alert alert-success rounded-3">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 text-center mb-3">
                <div className="company-logo bg-light rounded-circle border p-2 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 90, height: 90 }}>
                  {company.logo ? (
                    <img src={`http://localhost:8080/uploads/${company.logo}`} alt="Company Logo" className="img-fluid rounded-circle" style={{ width: 90, height: 90, objectFit: 'cover' }} />
                  ) : (
                    <BiBuilding className="display-4 text-primary" />
                  )}
                </div>
                {company.id && (
                  <div>
                    <label className="btn btn-outline-primary btn-sm rounded-pill px-3 cursor-pointer">
                      <BiCloudUpload className="me-1" /> Upload Brand Logo
                      <input type="file" accept="image/*" className="d-none" onChange={handleLogoUpload} />
                    </label>
                  </div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small text-muted">Company Name *</label>
                <input
                  type="text"
                  className="form-control rounded-3 py-2"
                  required
                  value={company.name || ''}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Industry Domain</label>
                <input
                  type="text"
                  className="form-control rounded-3 py-2"
                  value={company.industry || ''}
                  onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Company Size</label>
                <input
                  type="text"
                  className="form-control rounded-3 py-2"
                  placeholder="e.g. 500-1000 Employees"
                  value={company.companySize || ''}
                  onChange={(e) => setCompany({ ...company, companySize: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Website URL</label>
                <input
                  type="url"
                  className="form-control rounded-3 py-2"
                  placeholder="https://company.example.com"
                  value={company.website || ''}
                  onChange={(e) => setCompany({ ...company, website: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">City / Location</label>
                <input
                  type="text"
                  className="form-control rounded-3 py-2"
                  value={company.city || ''}
                  onChange={(e) => setCompany({ ...company, city: e.target.value })}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small text-muted">Company Overview & Culture</label>
                <textarea
                  className="form-control rounded-3"
                  rows="4"
                  placeholder="Describe your company vision, technical stack, work culture, and mission..."
                  value={company.description || ''}
                  onChange={(e) => setCompany({ ...company, description: e.target.value })}
                ></textarea>
              </div>

              <div className="col-12 mt-4">
                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold" disabled={saving}>
                  {saving ? 'Saving Profile...' : 'Save Company Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
