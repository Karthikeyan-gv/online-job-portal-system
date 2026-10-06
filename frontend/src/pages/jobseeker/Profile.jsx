import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import { resumeService } from '../../services/resumeService';
import { jobService } from '../../services/jobService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { BiUser, BiFile, BiBook, BiBriefcase, BiPlus, BiTrash, BiCheck, BiCloudUpload } from 'react-icons/bi';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [resumes, setResumes] = useState([]);
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // New item form states
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', fieldOfStudy: '', startYear: 2020, endYear: 2024, grade: '' });
  const [newExp, setNewExp] = useState({ companyName: '', jobTitle: '', location: '', startDate: '', endDate: '', description: '' });
  const [showEduModal, setShowEduModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [profRes, resRes, skillsRes] = await Promise.all([
        profileService.getProfile(),
        resumeService.getResumes(),
        jobService.getSkills()
      ]);
      setProfile(profRes.data || {});
      setResumes(resRes.data || []);
      setAllSkills(skillsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.updateProfile(profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      alert(err?.toString());
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await resumeService.uploadResume(file, true);
      loadProfileData();
    } catch (err) {
      alert(err?.toString());
    }
  };

  const handleDeleteResume = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await resumeService.deleteResume(id);
      loadProfileData();
    } catch (err) {
      alert(err?.toString());
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      await profileService.addEducation(newEdu);
      setShowEduModal(false);
      loadProfileData();
    } catch (err) {
      alert(err?.toString());
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      await profileService.addExperience(newExp);
      setShowExpModal(false);
      loadProfileData();
    } catch (err) {
      alert(err?.toString());
    }
  };

  if (loading) return <LoadingSpinner message="Loading candidate profile..." />;

  return (
    <div className="profile-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        <h3 className="fw-extrabold text-dark mb-4">My Professional Profile</h3>

        {message && <div className="alert alert-success rounded-3">{message}</div>}

        <div className="row g-4">
          {/* Main Info */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3">Personal Details</h5>
              <form onSubmit={handleProfileSave}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">First Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={profile.firstName || ''}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Last Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={profile.lastName || ''}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Phone</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">City / Location</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold small text-muted">Professional Summary</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="4"
                      value={profile.summary || ''}
                      onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold mt-4" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>

          {/* Resume Hub */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3">Resume Hub</h5>
              <div className="mb-3">
                <label className="btn btn-outline-primary rounded-pill w-100 py-2 cursor-pointer fw-semibold d-flex align-items-center justify-content-center gap-2">
                  <BiCloudUpload className="fs-5" /> Upload New Resume (PDF/DOC)
                  <input type="file" accept=".pdf,.doc,.docx" className="d-none" onChange={handleResumeUpload} />
                </label>
              </div>

              <div className="d-flex flex-column gap-2">
                {resumes.map(r => (
                  <div key={r.id} className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-0 text-dark small">{r.fileName}</h6>
                      <span className="extra-small text-muted">{new Date(r.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteResume(r.id)}>
                      <BiTrash className="fs-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
