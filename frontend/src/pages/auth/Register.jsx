import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';
import { BiUser, BiBuilding, BiEnvelope, BiLockAlt, BiPhone } from 'react-icons/bi';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const [role, setRole] = useState(searchParams.get('role') || 'JOB_SEEKER');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await register({ ...formData, role });
      alert('Registration successful! Please log in with your credentials.');
      navigate('/login');
    } catch (err) {
      setError(err?.toString() || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="card border-0 shadow-xl rounded-5 p-4 p-md-5 bg-white">
              <div className="text-center mb-4">
                <h3 className="fw-extrabold text-dark mb-1">Create Account</h3>
                <p className="text-muted small">Join thousands of tech candidates and top employers</p>

                {/* Role Switcher Pills */}
                <div className="btn-group w-100 p-1 bg-light rounded-pill mt-3">
                  <button
                    className={`btn rounded-pill fw-semibold py-2 ${role === 'JOB_SEEKER' ? 'btn-primary shadow-sm' : 'btn-light text-muted'}`}
                    onClick={() => setRole('JOB_SEEKER')}
                  >
                    <BiUser className="me-1" /> Job Seeker
                  </button>
                  <button
                    className={`btn rounded-pill fw-semibold py-2 ${role === 'EMPLOYER' ? 'btn-primary shadow-sm' : 'btn-light text-muted'}`}
                    onClick={() => setRole('EMPLOYER')}
                  >
                    <BiBuilding className="me-1" /> Employer / Hiring
                  </button>
                </div>
              </div>

              {error && <ErrorMessage message={error} />}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">First Name</label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 rounded-3 py-2"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Last Name</label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 rounded-3 py-2"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small text-muted">Email Address</label>
                    <input
                      type="email"
                      className="form-control bg-light border-0 rounded-3 py-2"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control bg-light border-0 rounded-3 py-2"
                      placeholder="+91..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  {role === 'EMPLOYER' && (
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Company Name</label>
                      <input
                        type="text"
                        className="form-control bg-light border-0 rounded-3 py-2"
                        placeholder="TechCorp Inc."
                        required={role === 'EMPLOYER'}
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="col-12">
                    <label className="form-label fw-semibold small text-muted">Password</label>
                    <input
                      type="password"
                      className="form-control bg-light border-0 rounded-3 py-2"
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold mt-4 shadow-sm" disabled={submitting}>
                  {submitting ? 'Creating Account...' : `Register as ${role === 'JOB_SEEKER' ? 'Candidate' : 'Employer'}`}
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="small text-muted">Already have an account? </span>
                <Link to="/login" className="small fw-bold text-primary text-decoration-none">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
