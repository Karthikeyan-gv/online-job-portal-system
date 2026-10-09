import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import EmailDrawer from './EmailDrawer';
import { 
  BiBriefcaseAlt2, BiBell, BiEnvelope, BiUserCircle, BiLogOut, BiBookmark, 
  BiPlusCircle, BiListCheck, BiBuilding, BiGridAlt, BiChevronDown 
} from 'react-icons/bi';

const Navbar = () => {
  const { user, isAuthenticated, logout, isJobSeeker, isEmployer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchUnreadCount = () => {
    if (isAuthenticated) {
      notificationService.getUnreadCount()
        .then(res => setUnreadCount(res.data || 0))
        .catch(() => {});
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-slate-900 sticky-top shadow-sm py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4 text-primary-gradient" to="/">
          <div className="bg-primary text-white rounded-3 p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
            <BiBriefcaseAlt2 className="fs-4" />
          </div>
          <span className="brand-text">CAREER<span className="text-primary">HUB</span></span>
        </Link>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className={`nav-link px-3 fw-medium ${location.pathname === '/' ? 'active text-primary' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 fw-medium ${location.pathname.startsWith('/jobs') ? 'active text-primary' : ''}`} to="/jobs">Find Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 fw-medium ${location.pathname.startsWith('/companies') ? 'active text-primary' : ''}`} to="/companies">Companies</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 fw-medium ${location.pathname === '/about' ? 'active text-primary' : ''}`} to="/about">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 fw-medium ${location.pathname === '/contact' ? 'active text-primary' : ''}`} to="/contact">Contact</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Email Inbox Drawer Trigger */}
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="btn btn-slate-800 text-light position-relative p-2 rounded-circle hover-bg-slate border-0 d-flex align-items-center justify-content-center"
                  title="Open Formatted Email Inbox"
                  style={{ width: 40, height: 40 }}
                >
                  <BiEnvelope className="fs-4" />
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="dropdown">
                  <button 
                    className="btn btn-slate-800 text-white border-0 dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32 }}>
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="small fw-semibold text-truncate" style={{ maxWidth: 120 }}>{user?.email}</span>
                    <BiChevronDown />
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow-lg rounded-3 border-0 mt-2 p-2" style={{ minWidth: 220 }}>
                    <div className="px-3 py-2 border-bottom mb-1">
                      <p className="fw-bold mb-0 text-dark small">{user?.email}</p>
                      <span className="badge bg-primary-subtle text-primary rounded-pill small mt-1">
                        {user?.role?.replace('ROLE_', '')}
                      </span>
                    </div>

                    {isJobSeeker() && (
                      <>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/jobseeker/dashboard"><BiGridAlt className="me-2" /> Dashboard</Link></li>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/jobseeker/profile"><BiUserCircle className="me-2" /> My Profile</Link></li>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/jobseeker/applied-jobs"><BiListCheck className="me-2" /> Applied Jobs</Link></li>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/jobseeker/saved-jobs"><BiBookmark className="me-2" /> Saved Jobs</Link></li>
                      </>
                    )}

                    {isEmployer() && (
                      <>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/employer/dashboard"><BiGridAlt className="me-2" /> Employer Dashboard</Link></li>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/employer/post-job"><BiPlusCircle className="me-2" /> Post New Job</Link></li>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/employer/manage-jobs"><BiListCheck className="me-2" /> Manage Jobs</Link></li>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/employer/pipeline"><BiGridAlt className="me-2" /> Recruitment Pipeline</Link></li>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/employer/company-profile"><BiBuilding className="me-2" /> Company Profile</Link></li>
                      </>
                    )}

                    {isAdmin() && (
                      <>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/admin/dashboard"><BiGridAlt className="me-2" /> Admin Portal</Link></li>
                        <li><Link className="dropdown-item rounded-2 py-2" to="/admin/manage-jobs"><BiListCheck className="me-2" /> Pending Approvals</Link></li>
                      </>
                    )}

                    <div className="dropdown-divider my-1"></div>
                    <li>
                      <button className="dropdown-item text-danger rounded-2 py-2" onClick={handleLogout}>
                        <BiLogOut className="me-2" /> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light rounded-pill px-4 py-2 text-decoration-none fw-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold text-decoration-none shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

    <EmailDrawer 
      isOpen={isDrawerOpen} 
      onClose={() => setIsDrawerOpen(false)} 
      onRefreshCount={fetchUnreadCount} 
    />
    </>
  );
};

export default Navbar;
