import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BiBell, BiCheckCircle } from 'react-icons/bi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      const list = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setNotifications(list);
    } catch (err) {
      console.error(err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    // Optimistic UI update to prevent layout glitch/flicker
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, isRead: true } : n));
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner message="Loading notifications..." />;

  return (
    <div className="notifications-page bg-light py-5 min-vh-100">
      <div className="container py-3 max-w-2xl">
        <h3 className="fw-extrabold text-dark mb-4 d-flex align-items-center gap-2">
          <BiBell className="text-primary" /> Notifications
        </h3>

        {notifications.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <p className="text-muted mb-0">No notifications found.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {notifications.map((n) => {
              const isRead = n.read || n.isRead;
              return (
                <div key={n.id} className={`card border-0 shadow-sm rounded-4 p-4 transition-all ${!isRead ? 'bg-white border-start border-primary border-4 shadow' : 'bg-slate-50 opacity-75'}`}>
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h6 className="fw-bold text-dark mb-0">{n.title}</h6>
                        {!isRead && <span className="badge bg-primary rounded-pill extra-small">New</span>}
                      </div>
                      <p className="text-muted small mb-2">{n.message}</p>
                      <span className="extra-small text-slate-400">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    {!isRead && (
                      <button
                        className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center p-2"
                        title="Mark as read"
                        onClick={() => handleMarkAsRead(n.id)}
                        style={{ width: 36, height: 36, flexShrink: 0 }}
                      >
                        <BiCheckCircle className="fs-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
