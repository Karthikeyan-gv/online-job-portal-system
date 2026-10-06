import React, { useState } from 'react';
import { 
  BiUser, BiFile, BiEnvelope, BiCheckCircle, BiXCircle, 
  BiInfoCircle, BiChevronRight, BiMove, BiCalendarCheck, BiStar
} from 'react-icons/bi';

const STAGES = [
  { key: 'APPLIED', title: 'Applied', color: 'primary', bg: 'bg-primary-subtle', border: 'border-primary' },
  { key: 'UNDER_REVIEW', title: 'Under Review', color: 'info', bg: 'bg-info-subtle', border: 'border-info' },
  { key: 'SHORTLISTED', title: 'Shortlisted', color: 'warning', bg: 'bg-warning-subtle', border: 'border-warning' },
  { key: 'INTERVIEW', title: 'Interview Stage', color: 'purple', bg: 'bg-purple-subtle', border: 'border-purple' },
  { key: 'SELECTED', title: 'Selected / Hired', color: 'success', bg: 'bg-success-subtle', border: 'border-success' },
  { key: 'REJECTED', title: 'Rejected', color: 'danger', bg: 'bg-danger-subtle', border: 'border-danger' }
];

const KanbanBoard = ({ applications = [], onStatusUpdate }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const getApplicationsForStage = (stageKey) => {
    return applications.filter(app => app.currentStatus === stageKey);
  };

  // Drag & Drop Event Handlers
  const handleDragStart = (e, appId) => {
    setDraggedAppId(appId);
    e.dataTransfer.setData('text/plain', appId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stageKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageKey) {
      setDragOverStage(stageKey);
    }
  };

  const handleDragLeave = (stageKey) => {
    if (dragOverStage === stageKey) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e, stageKey) => {
    e.preventDefault();
    setDragOverStage(null);
    const appIdStr = e.dataTransfer.getData('text/plain') || draggedAppId;
    const appId = parseInt(appIdStr);

    if (appId) {
      const targetApp = applications.find(a => a.id === appId);
      if (targetApp && targetApp.currentStatus !== stageKey) {
        onStatusUpdate(appId, stageKey, `Moved to ${stageKey} via Drag & Drop`);
      }
    }
    setDraggedAppId(null);
  };

  return (
    <div className="kanban-wrapper overflow-x-auto pb-4">
      <div className="d-flex gap-3" style={{ minWidth: 1400 }}>
        {STAGES.map((stage) => {
          const stageApps = getApplicationsForStage(stage.key);
          const isDragOver = dragOverStage === stage.key;

          return (
            <div
              key={stage.key}
              className={`flex-1 rounded-4 p-3 transition-all ${
                isDragOver ? `${stage.bg} border ${stage.border} shadow-lg scale-102` : 'bg-slate-100 shadow-inner'
              }`}
              style={{ minWidth: 280, width: 280 }}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={() => handleDragLeave(stage.key)}
              onDrop={(e) => handleDrop(e, stage.key)}
            >
              {/* Column Header */}
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <span className={`fw-bold text-${stage.color} small text-uppercase`}>{stage.title}</span>
                </div>
                <span className={`badge rounded-pill ${stage.bg} text-${stage.color} fw-bold px-2.5 py-1`}>
                  {stageApps.length}
                </span>
              </div>

              {/* Candidate Cards List */}
              <div className="kanban-cards d-flex flex-column gap-3" style={{ minHeight: 350 }}>
                {stageApps.length === 0 ? (
                  <div className={`text-center text-muted small py-4 rounded-3 border border-dashed ${isDragOver ? 'bg-white' : 'bg-slate-50'}`}>
                    {isDragOver ? 'Drop Candidate Here' : 'No candidates in stage'}
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      className={`card border-0 shadow-sm rounded-4 p-3 bg-white hover-lift cursor-grab transition-all ${
                        draggedAppId === app.id ? 'opacity-50 border border-primary' : ''
                      }`}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: 36, height: 36 }}>
                            {app.seekerProfile?.firstName?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <h6 className="fw-bold mb-0 text-dark small">
                              {app.seekerProfile?.firstName} {app.seekerProfile?.lastName}
                            </h6>
                            <span className="text-muted extra-small d-block text-truncate" style={{ maxWidth: 140 }}>
                              {app.job?.title}
                            </span>
                          </div>
                        </div>

                        <button
                          className="btn btn-light btn-sm rounded-circle p-1 text-muted hover-text-primary"
                          title="View Application Details"
                          onClick={() => setSelectedApp(app)}
                        >
                          <BiInfoCircle className="fs-5" />
                        </button>
                      </div>

                      <p className="text-muted extra-small mb-2 d-flex align-items-center gap-1">
                        <BiEnvelope className="text-primary" /> {app.seekerProfile?.user?.email}
                      </p>

                      {app.resume && (
                        <div className="mb-2">
                          <a
                            href={`http://localhost:8080/uploads/${app.resume.filePath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-light btn-sm text-primary w-100 extra-small py-1 border rounded-pill d-flex align-items-center justify-content-center gap-1"
                          >
                            <BiFile /> View Resume ({app.resume.fileName})
                          </a>
                        </div>
                      )}

                      {/* Quick Move Stage Dropdown & Action Buttons */}
                      <div className="mt-2 pt-2 border-top">
                        <div className="d-flex align-items-center justify-content-between gap-1 mb-2">
                          <span className="extra-small text-muted fw-semibold">Stage:</span>
                          <select
                            className="form-select form-select-sm extra-small rounded-pill py-0.5 px-2 bg-light border-0 fw-semibold text-dark"
                            value={app.currentStatus}
                            onChange={(e) => onStatusUpdate(app.id, e.target.value, `Stage changed to ${e.target.value}`)}
                          >
                            {STAGES.map(s => (
                              <option key={s.key} value={s.key}>{s.title}</option>
                            ))}
                          </select>
                        </div>

                        {/* Quick 1-click stage advancement shortcuts */}
                        <div className="d-flex gap-1">
                          {stage.key === 'APPLIED' && (
                            <button
                              className="btn btn-outline-info btn-xs w-100 rounded-pill extra-small py-1 fw-semibold"
                              onClick={() => onStatusUpdate(app.id, 'UNDER_REVIEW', 'Moved to Under Review')}
                            >
                              Review Candidate
                            </button>
                          )}
                          {stage.key === 'UNDER_REVIEW' && (
                            <button
                              className="btn btn-outline-warning btn-xs w-100 rounded-pill extra-small py-1 fw-semibold"
                              onClick={() => onStatusUpdate(app.id, 'SHORTLISTED', 'Shortlisted Candidate')}
                            >
                              Shortlist
                            </button>
                          )}
                          {stage.key === 'SHORTLISTED' && (
                            <button
                              className="btn btn-outline-purple btn-xs w-100 rounded-pill extra-small py-1 fw-semibold"
                              onClick={() => onStatusUpdate(app.id, 'INTERVIEW', 'Scheduled Interview')}
                            >
                              Interview
                            </button>
                          )}
                          {stage.key === 'INTERVIEW' && (
                            <button
                              className="btn btn-outline-success btn-xs w-100 rounded-pill extra-small py-1 fw-semibold"
                              onClick={() => onStatusUpdate(app.id, 'SELECTED', 'Hired Candidate')}
                            >
                              Hire Candidate 🎉
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Evaluation Modal */}
      {selectedApp && (
        <div className="modal show d-block backdrop-blur" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-2xl p-3">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-dark">Candidate Evaluation Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedApp(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="bg-light rounded-4 p-3 border">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Candidate Information</h6>
                      <p className="mb-2 small"><strong>Name:</strong> {selectedApp.seekerProfile?.firstName} {selectedApp.seekerProfile?.lastName}</p>
                      <p className="mb-2 small"><strong>Email:</strong> {selectedApp.seekerProfile?.user?.email}</p>
                      <p className="mb-2 small"><strong>Phone:</strong> {selectedApp.seekerProfile?.phone || 'N/A'}</p>
                      <p className="mb-2 small"><strong>Location:</strong> {selectedApp.seekerProfile?.location || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="bg-light rounded-4 p-3 border">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Application Details</h6>
                      <p className="mb-2 small"><strong>Target Job:</strong> {selectedApp.job?.title}</p>
                      <p className="mb-2 small"><strong>Company:</strong> {selectedApp.job?.company?.name}</p>
                      <p className="mb-2 small"><strong>Current Stage:</strong> <span className="badge bg-primary px-3 py-1 rounded-pill">{selectedApp.currentStatus}</span></p>
                      <p className="mb-2 small"><strong>Applied Date:</strong> {new Date(selectedApp.appliedAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {selectedApp.coverLetter && (
                    <div className="col-12">
                      <h6 className="fw-bold text-dark">Cover Letter</h6>
                      <div className="bg-white rounded-3 p-3 small text-slate-700 whitespace-pre-line border shadow-inner">
                        {selectedApp.coverLetter}
                      </div>
                    </div>
                  )}

                  {selectedApp.resume && (
                    <div className="col-12">
                      <h6 className="fw-bold text-dark mb-2">Attached Resume</h6>
                      <a
                        href={`http://localhost:8080/uploads/${selectedApp.resume.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary rounded-pill px-4 fw-semibold"
                      >
                        <BiFile className="me-1" /> Open Candidate Resume ({selectedApp.resume.fileName})
                      </a>
                    </div>
                  )}

                  {/* Stage Advancement inside Modal */}
                  <div className="col-12 pt-3 border-top">
                    <h6 className="fw-bold text-dark mb-2">Update Stage Status</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {STAGES.map(s => (
                        <button
                          key={s.key}
                          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                            selectedApp.currentStatus === s.key ? 'btn-primary' : 'btn-outline-secondary'
                          }`}
                          onClick={() => {
                            onStatusUpdate(selectedApp.id, s.key, `Stage changed to ${s.title}`);
                            setSelectedApp(prev => ({ ...prev, currentStatus: s.key }));
                          }}
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setSelectedApp(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
