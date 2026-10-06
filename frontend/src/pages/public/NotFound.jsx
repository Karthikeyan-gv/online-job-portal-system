import React from 'react';
import { Link } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card border-0 shadow-lg rounded-4 p-5 text-center max-w-md bg-white">
        <BiSearchAlt className="display-1 text-primary mb-3" />
        <h2 className="fw-extrabold text-dark mb-2">Page Not Found (404)</h2>
        <p className="text-muted mb-4">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary rounded-pill px-4 fw-semibold">
          Back to Safety
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
