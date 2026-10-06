import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import JobFilter from '../../components/JobFilter';
import JobCard from '../../components/JobCard';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { jobService } from '../../services/jobService';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    categoryId: searchParams.get('categoryId') || '',
    jobType: searchParams.get('jobType') || '',
    workMode: searchParams.get('workMode') || '',
    sortBy: 'createdAt'
  });

  useEffect(() => {
    jobService.getCategories()
      .then(res => setCategories(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, filters]);

  const fetchJobs = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size: 9,
        keyword: filters.keyword,
        location: filters.location,
        categoryId: filters.categoryId || null,
        jobType: filters.jobType || null,
        workMode: filters.workMode || null,
        sortBy: filters.sortBy,
        sortDir: 'desc'
      };
      const res = await jobService.getJobs(params);
      setJobs(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
      setTotalElements(res.data?.totalElements || 0);
    } catch (err) {
      setError(err?.toString() || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = ({ keyword, location }) => {
    setFilters(prev => ({ ...prev, keyword, location }));
    setCurrentPage(0);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      categoryId: '',
      jobType: '',
      workMode: '',
      sortBy: 'createdAt'
    });
    setSearchParams({});
    setCurrentPage(0);
  };

  return (
    <div className="jobs-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        {/* Top Search Bar */}
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} initialKeyword={filters.keyword} initialLocation={filters.location} />
        </div>

        <div className="row g-4">
          {/* Left Sidebar Filter */}
          <div className="col-lg-3">
            <JobFilter
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Main Job Grid */}
          <div className="col-lg-9">
            <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-4 shadow-sm border">
              <span className="fw-semibold text-dark">
                Showing <span className="text-primary fw-bold">{totalElements}</span> jobs available
              </span>
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">Sort:</span>
                <select
                  className="form-select form-select-sm border-0 bg-light fw-medium rounded-pill px-3"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="createdAt">Latest</option>
                  <option value="salaryMax">Highest Salary</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>

            {error && <ErrorMessage message={error} onRetry={() => fetchJobs(currentPage)} />}

            {loading ? (
              <LoadingSpinner message="Searching verified jobs..." />
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-4 shadow-sm p-5 text-center my-4">
                <h5 className="fw-bold text-dark mb-2">No Jobs Match Your Filter</h5>
                <p className="text-muted mb-3">Try adjusting your keyword, location, or filter options.</p>
                <button className="btn btn-outline-primary rounded-pill px-4" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="col-md-6 col-lg-6">
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
