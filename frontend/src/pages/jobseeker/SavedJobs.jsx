import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await profileService.getSavedJobs({ page: 0, size: 50 });
      setSavedJobs(res.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = (jobId, isSaved) => {
    if (!isSaved) {
      setSavedJobs(prev => prev.filter(s => s.job.id !== jobId));
    }
  };

  if (loading) return <LoadingSpinner message="Loading saved bookmarks..." />;

  return (
    <div className="saved-jobs-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        <h3 className="fw-extrabold text-dark mb-4">Saved Job Bookmarks ({savedJobs.length})</h3>

        {savedJobs.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <h5 className="fw-bold text-dark">No Saved Jobs</h5>
            <p className="text-muted mb-0">Bookmark jobs while browsing to save them for later applications.</p>
          </div>
        ) : (
          <div className="row g-4">
            {savedJobs.map((item) => (
              <div key={item.id} className="col-md-6 col-lg-4">
                <JobCard job={item.job} isSavedInitial={true} onSaveToggle={handleSaveToggle} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
