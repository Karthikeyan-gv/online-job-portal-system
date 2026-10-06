import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import ErrorMessage from '../../components/ErrorMessage';
import { BiBriefcase, BiMoney, BiMap, BiCheckCircle } from 'react-icons/bi';

const PostJob = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    jobType: 'FULL_TIME',
    workMode: 'HYBRID',
    salaryMin: 600000,
    salaryMax: 1200000,
    experienceRequired: 2,
    educationRequired: 'Bachelor Degree',
    vacancies: 2,
    categoryId: '',
    skillIds: []
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([jobService.getCategories(), jobService.getSkills()])
      .then(([catRes, skillRes]) => {
        setCategories(catRes.data || []);
        setAllSkills(skillRes.data || []);
        if (catRes.data?.length > 0) setFormData(prev => ({ ...prev, categoryId: catRes.data[0].id }));
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await jobService.postJob({
        ...formData,
        categoryId: parseInt(formData.categoryId),
        salaryMin: parseFloat(formData.salaryMin),
        salaryMax: parseFloat(formData.salaryMax),
        experienceRequired: parseInt(formData.experienceRequired),
        vacancies: parseInt(formData.vacancies)
      });
      alert('Job posted successfully!');
      navigate('/employer/manage-jobs');
    } catch (err) {
      setError(err?.toString() || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-job-page bg-light py-5 min-vh-100">
      <div className="container py-3 max-w-3xl">
        <div className="card border-0 shadow-lg rounded-5 p-4 p-md-5 bg-white">
          <h3 className="fw-extrabold text-dark mb-1">Post a New Job Opening</h3>
          <p className="text-muted small mb-4">Create a comprehensive job specification to attract qualified candidate profiles.</p>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold small text-muted">Job Title *</label>
                <input
                  type="text"
                  className="form-control rounded-3 py-2"
                  placeholder="e.g. Senior Java Full Stack Engineer"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Category *</label>
                <select
                  className="form-select rounded-3 py-2"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Location *</label>
                <input
                  type="text"
                  className="form-control rounded-3 py-2"
                  placeholder="e.g. Chennai, India"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Job Type *</label>
                <select
                  className="form-select rounded-3 py-2"
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Work Mode *</label>
                <select
                  className="form-select rounded-3 py-2"
                  value={formData.workMode}
                  onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                >
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote</option>
                  <option value="ONSITE">Onsite</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Min Salary (INR / Annum)</label>
                <input
                  type="number"
                  className="form-control rounded-3 py-2"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Max Salary (INR / Annum)</label>
                <input
                  type="number"
                  className="form-control rounded-3 py-2"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Experience Required (Years)</label>
                <input
                  type="number"
                  className="form-control rounded-3 py-2"
                  value={formData.experienceRequired}
                  onChange={(e) => setFormData({ ...formData, experienceRequired: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Vacancies</label>
                <input
                  type="number"
                  className="form-control rounded-3 py-2"
                  value={formData.vacancies}
                  onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small text-muted">Detailed Job Description *</label>
                <textarea
                  className="form-control rounded-3"
                  rows="4"
                  required
                  placeholder="Describe role objectives, team context, and key technical expectations..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small text-muted">Requirements & Skills Needed</label>
                <textarea
                  className="form-control rounded-3"
                  rows="3"
                  placeholder="e.g. 3+ years experience with Java 17, Spring Boot microservices, React, MySQL..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                ></textarea>
              </div>

              <div className="col-12 mt-4">
                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm" disabled={submitting}>
                  {submitting ? 'Publishing Job...' : 'Publish Job Opening'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
