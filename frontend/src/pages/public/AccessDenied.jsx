import React from 'react';
import { Link } from 'react-router-dom';
import { BiShieldX } from 'react-icons/bi';

const AccessDenied = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card border-0 shadow-lg rounded-4 p-5 text-center max-w-md bg-white">
        <BiShieldX className="display-1 text-danger mb-3" />
        <h2 className="fw-extrabold text-dark mb-2">Access Denied (403)</h2>
        <p className="text-muted mb-4">
          You do not have authorization to view this page. Please sign in with an account containing the required role.
        </p>
        <Link to="/" className="btn btn-primary rounded-pill px-4 fw-semibold">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
