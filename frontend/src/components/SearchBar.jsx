import React, { useState } from 'react';
import { BiSearch, BiMap, BiBriefcase } from 'react-icons/bi';

const SearchBar = ({ onSearch, initialKeyword = '', initialLocation = '' }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, location });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar-card bg-white p-3 rounded-4 shadow-lg border border-light-subtle">
      <div className="row g-2 align-items-center">
        <div className="col-md-5">
          <div className="input-group input-group-lg border-0">
            <span className="input-group-text bg-transparent border-0 text-primary">
              <BiSearch className="fs-4" />
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-none ps-0 fs-6"
              placeholder="Job title, skills, or company name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-4 border-start-md">
          <div className="input-group input-group-lg border-0">
            <span className="input-group-text bg-transparent border-0 text-primary">
              <BiMap className="fs-4" />
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-none ps-0 fs-6"
              placeholder="City, state, or 'Remote'..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-3">
          <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm">
            <BiSearch /> Search Jobs
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
