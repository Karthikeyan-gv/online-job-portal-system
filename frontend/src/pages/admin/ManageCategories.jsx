import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { jobService } from '../../services/jobService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BiPlus, BiTrash } from 'react-icons/bi';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newSkillName, setNewSkillName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, skillRes] = await Promise.all([
        jobService.getCategories(),
        jobService.getSkills()
      ]);
      setCategories(catRes.data || []);
      setSkills(skillRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await adminService.createCategory({ name: newCatName, description: newCatDesc });
      setNewCatName('');
      setNewCatDesc('');
      loadData();
    } catch (err) {
      alert(err?.toString());
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await adminService.createSkill({ name: newSkillName, category: 'General' });
      setNewSkillName('');
      loadData();
    } catch (err) {
      alert(err?.toString());
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await adminService.deleteCategory(id);
      loadData();
    } catch (err) {
      alert(err?.toString());
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await adminService.deleteSkill(id);
      loadData();
    } catch (err) {
      alert(err?.toString());
    }
  };

  if (loading) return <LoadingSpinner message="Loading Master Categories & Skills..." />;

  return (
    <div className="manage-categories-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        <h3 className="fw-extrabold text-dark mb-4">Master Data: Categories & Skills</h3>

        <div className="row g-4">
          {/* Categories Manager */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3">Job Categories ({categories.length})</h5>

              <form onSubmit={handleAddCategory} className="mb-4">
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Category Name"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Description"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm rounded-pill px-4">
                  <BiPlus /> Add Category
                </button>
              </form>

              <div className="d-flex flex-column gap-2">
                {categories.map(c => (
                  <div key={c.id} className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-0 text-dark small">{c.name}</h6>
                      <span className="extra-small text-muted">{c.description}</span>
                    </div>
                    <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteCategory(c.id)}>
                      <BiTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Manager */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3">Master Skills Library ({skills.length})</h5>

              <form onSubmit={handleAddSkill} className="d-flex gap-2 mb-4">
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Skill Name (e.g. Kubernetes)"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm rounded-pill px-4 text-nowrap">
                  <BiPlus /> Add Skill
                </button>
              </form>

              <div className="d-flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s.id} className="badge bg-slate-100 text-slate-800 border p-2 rounded-pill small d-flex align-items-center gap-1">
                    {s.name}
                    <BiTrash className="cursor-pointer text-danger ms-1" onClick={() => handleDeleteSkill(s.id)} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
