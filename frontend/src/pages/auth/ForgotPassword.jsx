import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiEnvelope, BiCheckCircle } from 'react-icons/bi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card border-0 shadow-lg rounded-5 p-4 p-md-5 max-w-md bg-white">
        <h4 className="fw-extrabold text-dark text-center mb-2">Reset Password</h4>
        <p className="text-muted small text-center mb-4">Enter your registered email address to receive password reset instructions.</p>

        {submitted ? (
          <div className="text-center py-3 text-success">
            <BiCheckCircle className="display-3 mb-2" />
            <h6 className="fw-bold">Password Reset Link Sent</h6>
            <p className="extra-small text-muted mb-3">If an account exists for {email}, a reset link has been dispatched.</p>
            <Link to="/login" className="btn btn-outline-primary btn-sm rounded-pill px-4">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small text-muted">Email Address</label>
              <input
                type="email"
                className="form-control bg-light border-0 rounded-3 py-2"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold py-2 mt-2">Send Reset Link</button>
            <div className="text-center mt-3">
              <Link to="/login" className="small text-muted text-decoration-none">Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
