import React, { useState } from 'react';
import api from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';
import { BiEnvelope, BiPhone, BiMap, BiSend, BiCheckCircle } from 'react-icons/bi';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err?.toString() || 'Failed to submit contact message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page bg-light py-5 min-vh-100">
      <div className="container py-4">
        <div className="row g-5">
          <div className="col-lg-5">
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-2">Get In Touch</span>
            <h2 className="display-6 fw-extrabold text-dark mb-3">We'd Love to Hear From You</h2>
            <p className="text-muted mb-4">Have questions about job postings, candidate subscriptions, or partnership opportunities?</p>

            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: 45, height: 45 }}>
                <BiMap className="fs-4" />
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-dark">Address</h6>
                <p className="text-muted small mb-0">Tech Park, Guindy, Chennai, India</p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: 45, height: 45 }}>
                <BiEnvelope className="fs-4" />
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-dark">Email Support</h6>
                <p className="text-muted small mb-0">support@jobportal.com</p>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h4 className="fw-bold text-dark mb-4">Send Us a Message</h4>

              {submitted ? (
                <div className="alert alert-success text-center py-4 rounded-3">
                  <BiCheckCircle className="fs-1 text-success mb-2" />
                  <h5 className="fw-bold">Message Sent Successfully!</h5>
                  <p className="small mb-0 text-muted">Thank you for reaching out. Our support team will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <ErrorMessage message={error} />}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Your Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Email Address</label>
                      <input
                        type="email"
                        className="form-control rounded-3"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Subject</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Message</label>
                      <textarea
                        className="form-control rounded-3"
                        rows="5"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold" disabled={submitting}>
                        {submitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
