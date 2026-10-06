import React from 'react';
import { Link } from 'react-router-dom';
import { BiBriefcaseAlt2, BiEnvelope, BiPhone, BiMap } from 'react-icons/bi';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-5 pb-4 mt-auto border-top border-slate-800">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <Link className="d-flex align-items-center fw-bold fs-4 text-white text-decoration-none mb-3" to="/">
              <div className="bg-primary text-white rounded-3 p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <BiBriefcaseAlt2 className="fs-5" />
              </div>
              <span>CAREER<span className="text-primary">HUB</span></span>
            </Link>
            <p className="small text-slate-400 leading-relaxed mb-4">
              Connecting top tech talent with leading companies worldwide. Find your dream job or hire exceptional candidate profiles today.
            </p>
            <div className="d-flex gap-3 text-slate-400">
              <span className="small d-flex align-items-center"><BiMap className="me-1 text-primary" /> Chennai, India</span>
              <span className="small d-flex align-items-center"><BiEnvelope className="me-1 text-primary" /> support@jobportal.com</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">For Job Seekers</h6>
            <ul className="list-unstyled text-small">
              <li className="mb-2"><Link to="/jobs" className="text-slate-400 text-decoration-none hover-text-primary">Browse Jobs</Link></li>
              <li className="mb-2"><Link to="/companies" className="text-slate-400 text-decoration-none hover-text-primary">Company Directory</Link></li>
              <li className="mb-2"><Link to="/jobseeker/dashboard" className="text-slate-400 text-decoration-none hover-text-primary">Candidate Dashboard</Link></li>
              <li className="mb-2"><Link to="/jobseeker/recommendations" className="text-slate-400 text-decoration-none hover-text-primary">Recommended Jobs</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">For Employers</h6>
            <ul className="list-unstyled text-small">
              <li className="mb-2"><Link to="/employer/post-job" className="text-slate-400 text-decoration-none hover-text-primary">Post a Job</Link></li>
              <li className="mb-2"><Link to="/employer/manage-jobs" className="text-slate-400 text-decoration-none hover-text-primary">Manage Listings</Link></li>
              <li className="mb-2"><Link to="/employer/pipeline" className="text-slate-400 text-decoration-none hover-text-primary">Recruitment Pipeline</Link></li>
              <li className="mb-2"><Link to="/register?role=EMPLOYER" className="text-slate-400 text-decoration-none hover-text-primary">Employer Sign Up</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="text-white fw-bold mb-3">Newsletter</h6>
            <p className="small text-slate-400 mb-3">Get the latest tech job alerts delivered straight to your inbox weekly.</p>
            <div className="input-group">
              <input type="email" className="form-control bg-slate-900 border-slate-800 text-white rounded-start-3" placeholder="Your email address" />
              <button className="btn btn-primary rounded-end-3" type="button">Subscribe</button>
            </div>
          </div>
        </div>

        <hr className="my-4 border-slate-800" />

        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between small text-slate-500">
          <p className="mb-0">© {new Date().getFullYear()} CareerHub Job Portal System. All rights reserved.</p>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            <Link to="/about" className="text-slate-500 text-decoration-none">Privacy Policy</Link>
            <Link to="/contact" className="text-slate-500 text-decoration-none">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
