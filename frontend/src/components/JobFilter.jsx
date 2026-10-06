import React from 'react';
import { BiFilterAlt, BiReset } from 'react-icons/bi';

const JobFilter = ({ categories = [], filters, onFilterChange, onReset }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
        <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
          <BiFilterAlt className="text-primary fs-5" /> Filter Jobs
        </h6>
        <button className="btn btn-link btn-sm text-decoration-none text-muted p-0 d-flex align-items-center gap-1" onClick={onReset}>
          <BiReset /> Reset
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="form-label fw-semibold small text-uppercase text-muted">Category</label>
        <select
          className="form-select form-select-sm rounded-3"
          value={filters.categoryId || ''}
          onChange={(e) => onFilterChange('categoryId', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Job Type Filter */}
      <div className="mb-4">
        <label className="form-label fw-semibold small text-uppercase text-muted">Job Type</label>
        {['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE'].map((type) => (
          <div className="form-check mb-2" key={type}>
            <input
              className="form-check-input"
              type="radio"
              name="jobType"
              id={`type-${type}`}
              checked={filters.jobType === type}
              onChange={() => onFilterChange('jobType', filters.jobType === type ? '' : type)}
            />
            <label className="form-check-label small text-capitalize" htmlFor={`type-${type}`}>
              {type.replace('_', ' ').toLowerCase()}
            </label>
          </div>
        ))}
      </div>

      {/* Work Mode Filter */}
      <div className="mb-4">
        <label className="form-label fw-semibold small text-uppercase text-muted">Work Mode</label>
        {['ONSITE', 'REMOTE', 'HYBRID'].map((mode) => (
          <div className="form-check mb-2" key={mode}>
            <input
              className="form-check-input"
              type="radio"
              name="workMode"
              id={`mode-${mode}`}
              checked={filters.workMode === mode}
              onChange={() => onFilterChange('workMode', filters.workMode === mode ? '' : mode)}
            />
            <label className="form-check-label small text-capitalize" htmlFor={`mode-${mode}`}>
              {mode.toLowerCase()}
            </label>
          </div>
        ))}
      </div>

      {/* Sort By */}
      <div className="mb-2">
        <label className="form-label fw-semibold small text-uppercase text-muted">Sort By</label>
        <select
          className="form-select form-select-sm rounded-3"
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        >
          <option value="createdAt">Latest Posted</option>
          <option value="salaryMax">Highest Salary</option>
          <option value="title">Job Title (A-Z)</option>
        </select>
      </div>
    </div>
  );
};

export default JobFilter;
