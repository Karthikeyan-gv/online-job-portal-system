import React from 'react';
import { BiBriefcase, BiCheckShield, BiRocket, BiUserCheck } from 'react-icons/bi';

const About = () => {
  return (
    <div className="about-page bg-light py-5 min-vh-100">
      <div className="container py-4">
        <div className="text-center max-w-3xl mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-2">About CareerHub</span>
          <h1 className="display-5 fw-extrabold text-dark mb-3">Empowering Tech Professionals & Hiring Leaders</h1>
          <p className="lead text-muted">
            CareerHub is a full-stack production online job portal system engineered to streamline candidate discovery, application workflows, and automated recruitment pipelines.
          </p>
        </div>

        <div className="row g-4 my-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100 bg-white">
              <div className="bg-primary-subtle text-primary rounded-circle p-3 mx-auto mb-3" style={{ width: 60, height: 60 }}>
                <BiRocket className="fs-2" />
              </div>
              <h5 className="fw-bold text-dark">Fast Applications</h5>
              <p className="text-muted small">Instant candidate job submission with resume auto-linking and cover letter submission.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100 bg-white">
              <div className="bg-success-subtle text-success rounded-circle p-3 mx-auto mb-3" style={{ width: 60, height: 60 }}>
                <BiCheckShield className="fs-2" />
              </div>
              <h5 className="fw-bold text-dark">Admin Moderation</h5>
              <p className="text-muted small">Strict job approval workflows to ensure only legitimate enterprise listings are active.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100 bg-white">
              <div className="bg-info-subtle text-info rounded-circle p-3 mx-auto mb-3" style={{ width: 60, height: 60 }}>
                <BiUserCheck className="fs-2" />
              </div>
              <h5 className="fw-bold text-dark">Kanban Pipeline</h5>
              <p className="text-muted small">Employer dashboard with real-time stage progression and candidate status history.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
