import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const RecommendedJobs = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getRecommendations()
      .then(res => setRecommendations(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Calculating skill-based recommendations..." />;

  return (
    <div className="recommended-jobs-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        <h3 className="fw-extrabold text-dark mb-1">Recommended For You</h3>
        <p className="text-muted mb-4">Jobs algorithmically matched against your candidate profile skills and preferred location.</p>

        <div className="row g-4">
          {recommendations.map(job => (
            <div key={job.id} className="col-md-6 col-lg-4">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedJobs;
