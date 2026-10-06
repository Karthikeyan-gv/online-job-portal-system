import React from 'react';
import { BiErrorCircle } from 'react-icons/bi';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between my-3 shadow-sm rounded-3 p-3">
      <div className="d-flex align-items-center">
        <BiErrorCircle className="fs-3 me-3 text-danger" />
        <div>
          <h6 className="mb-0 fw-bold">Something went wrong</h6>
          <span className="small">{message || 'An unexpected error occurred. Please try again.'}</span>
        </div>
      </div>
      {onRetry && (
        <button className="btn btn-outline-danger btn-sm rounded-pill ms-3" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
