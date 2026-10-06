import React, { useState, useEffect } from 'react';
import CompanyCard from '../../components/CompanyCard';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { companyService } from '../../services/companyService';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage]);

  const fetchCompanies = async (page = 0) => {
    setLoading(true);
    try {
      const res = await companyService.getAllCompanies({ page, size: 8 });
      setCompanies(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
    } catch (err) {
      setError(err?.toString() || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="companies-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-2">Company Directory</span>
          <h2 className="fw-extrabold text-dark mb-2">Discover Top Tech Employers</h2>
          <p className="text-muted">Explore leading corporate environments, industry domains, and current career opportunities.</p>
        </div>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingSpinner message="Fetching companies..." />
        ) : (
          <>
            <div className="row g-4">
              {companies.map((company) => (
                <div key={company.id} className="col-lg-3 col-md-6">
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => setCurrentPage(p)} />
          </>
        )}
      </div>
    </div>
  );
};

export default Companies;
