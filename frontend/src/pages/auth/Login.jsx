import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';
import { BiLockAlt, BiEnvelope, BiBriefcaseAlt2 } from 'react-icons/bi';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const user = await login(formData);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'ROLE_EMPLOYER') {
        navigate('/employer/dashboard');
      } else {
        const redirect = searchParams.get('redirect') || '/jobseeker/dashboard';
        navigate(redirect);
      }
    } catch (err) {
      setError(err?.toString() || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-xl rounded-5 p-4 p-md-5 bg-white">
              <div className="text-center mb-4">
                <div className="bg-primary text-white rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 50, height: 50 }}>
                  <BiBriefcaseAlt2 className="fs-3" />
                </div>
                <h3 className="fw-extrabold text-dark mb-1">Welcome Back</h3>
                <p className="text-muted small">Sign in to access your CareerHub account</p>
              </div>

              {error && <ErrorMessage message={error} />}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted"><BiEnvelope /></span>
                    <input
                      type="email"
                      className="form-control bg-light border-0 rounded-end-3 py-2"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label fw-semibold small text-muted mb-0">Password</label>
                    <Link to="/forgot-password" className="small text-primary text-decoration-none">Forgot password?</Link>
                  </div>
                  <div className="input-group mt-1">
                    <span className="input-group-text bg-light border-0 text-muted"><BiLockAlt /></span>
                    <input
                      type="password"
                      className="form-control bg-light border-0 rounded-end-3 py-2"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold my-3 shadow-sm" disabled={submitting}>
                  {submitting ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              {/* Demo Quick Logins */}
              <div className="mt-4 pt-3 border-top text-center">
                <span className="extra-small text-muted d-block mb-2 fw-semibold">QUICK DEMO LOGINS:</span>
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-outline-secondary btn-sm extra-small rounded-pill" onClick={() => setFormData({ email: 'seeker1@gmail.com', password: 'seeker123' })}>
                    Seeker
                  </button>
                  <button className="btn btn-outline-secondary btn-sm extra-small rounded-pill" onClick={() => setFormData({ email: 'employer1@techcorp.com', password: 'employer123' })}>
                    Employer
                  </button>
                  <button className="btn btn-outline-secondary btn-sm extra-small rounded-pill" onClick={() => setFormData({ email: 'admin@jobportal.com', password: 'admin123' })}>
                    Admin
                  </button>
                </div>
              </div>

              <div className="text-center mt-4 pt-2">
                <span className="small text-muted">Don't have an account? </span>
                <Link to="/register" className="small fw-bold text-primary text-decoration-none">Register Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
