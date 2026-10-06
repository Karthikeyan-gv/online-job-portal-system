import React from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="d-flex justify-content-center my-4">
      <ul className="pagination pagination-md shadow-sm rounded-pill p-1 bg-white">
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button
            className="page-item-btn border-0 rounded-circle d-flex align-items-center justify-content-center me-1"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            style={{ width: 36, height: 36 }}
          >
            <BiChevronLeft className="fs-5" />
          </button>
        </li>

        {pages.map((page) => (
          <li key={page} className="page-item">
            <button
              className={`page-item-btn border-0 rounded-circle fw-semibold mx-1 ${
                currentPage === page ? 'bg-primary text-white' : 'bg-transparent text-dark'
              }`}
              onClick={() => onPageChange(page)}
              style={{ width: 36, height: 36 }}
            >
              {page + 1}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
          <button
            className="page-item-btn border-0 rounded-circle d-flex align-items-center justify-content-center ms-1"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            style={{ width: 36, height: 36 }}
          >
            <BiChevronRight className="fs-5" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
