import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { BiEnvelope, BiX, BiCheckDouble, BiRefresh, BiBriefcase, BiCheckCircle, BiTime } from 'react-icons/bi';

const EmailDrawer = ({ isOpen, onClose, onRefreshCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      const list = res.data || [];
      setNotifications(list);
      if (list.length > 0 && !selectedNotification) {
        setSelectedNotification(list[0]);
      }
    } catch (err) {
      console.error('Failed fetching email notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, read: true } : n));
      if (onRefreshCount) onRefreshCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
      if (onRefreshCount) onRefreshCount();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const filteredList = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead && !n.read;
    if (filter === 'APPLICATION') return n.type === 'APPLICATION_CONFIRMATION' || n.type === 'NEW_APPLICATION';
    if (filter === 'STATUS') return n.type === 'APPLICATION_STATUS';
    return true;
  });

  return (
    <div className="position-fixed top-0 end-0 bottom-0 start-0 z-3 d-flex justify-content-end" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white h-100 shadow-2xl d-flex flex-column" style={{ width: '100%', maxWidth: '850px', transition: 'transform 0.3s ease-in-out' }}>
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 d-flex align-items-center justify-content-between border-bottom border-slate-800">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-20 p-2.5 rounded-3 text-primary">
              <BiEnvelope className="fs-3" />
            </div>
            <div>
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-white">
                Email Inbox & Portal Alerts
                <span className="badge bg-primary rounded-pill fs-7">{notifications.filter(n => !n.isRead && !n.read).length} Unread</span>
              </h5>
              <small className="text-slate-400">Formatted notification emails for candidates & employers</small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-outline-light d-flex align-items-center gap-1 rounded-2" onClick={handleMarkAllRead} title="Mark all as read">
              <BiCheckDouble className="fs-5" />
              <span className="d-none d-sm-inline">Mark All Read</span>
            </button>
            <button className="btn btn-sm btn-outline-light p-1.5 rounded-2" onClick={fetchNotifications} title="Refresh">
              <BiRefresh className={`fs-5 ${loading ? 'spin' : ''}`} />
            </button>
            <button className="btn btn-sm btn-slate-800 text-slate-300 p-1.5 rounded-2 ms-2 hover-text-white" onClick={onClose}>
              <BiX className="fs-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-100 px-4 py-2 border-bottom d-flex align-items-center gap-2 overflow-x-auto">
          <button 
            className={`btn btn-sm rounded-pill px-3 fw-medium ${filter === 'ALL' ? 'btn-primary shadow-sm' : 'btn-light text-slate-700'}`}
            onClick={() => setFilter('ALL')}
          >
            All Emails ({notifications.length})
          </button>
          <button 
            className={`btn btn-sm rounded-pill px-3 fw-medium ${filter === 'UNREAD' ? 'btn-primary shadow-sm' : 'btn-light text-slate-700'}`}
            onClick={() => setFilter('UNREAD')}
          >
            Unread ({notifications.filter(n => !n.isRead && !n.read).length})
          </button>
          <button 
            className={`btn btn-sm rounded-pill px-3 fw-medium ${filter === 'APPLICATION' ? 'btn-primary shadow-sm' : 'btn-light text-slate-700'}`}
            onClick={() => setFilter('APPLICATION')}
          >
            Applications
          </button>
          <button 
            className={`btn btn-sm rounded-pill px-3 fw-medium ${filter === 'STATUS' ? 'btn-primary shadow-sm' : 'btn-light text-slate-700'}`}
            onClick={() => setFilter('STATUS')}
          >
            Stage Updates
          </button>
        </div>

        {/* Content Split: List & Detailed Email View */}
        <div className="d-flex flex-grow-1 overflow-hidden">
          
          {/* List Sidebar */}
          <div className="w-40 border-end overflow-y-auto bg-slate-50" style={{ minWidth: '320px', maxWidth: '360px' }}>
            {loading ? (
              <div className="text-center py-5 text-slate-500">
                <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                Loading emails...
              </div>
            ) : filteredList.length === 0 ? (
              <div className="text-center py-5 px-3 text-slate-400">
                <BiEnvelope className="fs-1 mb-2 opacity-50" />
                <p className="small mb-0">No email notifications found.</p>
              </div>
            ) : (
              filteredList.map((item) => {
                const isUnread = !item.isRead && !item.read;
                const isSelected = selectedNotification?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-3 border-bottom cursor-pointer transition-all ${
                      isSelected ? 'bg-primary-subtle border-primary-subtle' : isUnread ? 'bg-white font-semibold' : 'bg-slate-50 opacity-80'
                    }`}
                    onClick={() => {
                      setSelectedNotification(item);
                      if (isUnread) handleMarkAsRead(item.id);
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className={`badge rounded-pill ${
                        item.type === 'NEW_APPLICATION' ? 'bg-success-subtle text-success' :
                        item.type === 'APPLICATION_CONFIRMATION' ? 'bg-primary-subtle text-primary' : 'bg-info-subtle text-info'
                      } style={{ fontSize: '11px' }}`}>
                        {item.type || 'NOTIFICATION'}
                      </span>
                      <small className="text-slate-400 style={{ fontSize: '11px' }}">
                        {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </small>
                    </div>

                    <h6 className={`mb-1 text-slate-900 line-clamp-1 ${isUnread ? 'fw-bold' : 'fw-medium'}`} style={{ fontSize: '14px' }}>
                      {item.title}
                    </h6>
                    <p className="text-slate-500 small mb-0 line-clamp-2" style={{ fontSize: '12px' }}>
                      {item.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Detailed Email Reader View */}
          <div className="flex-grow-1 p-4 overflow-y-auto bg-white">
            {selectedNotification ? (
              <div className="d-flex flex-column h-100">
                
                {/* Email Header Metadata */}
                <div className="pb-3 mb-3 border-bottom">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-primary px-3 py-1.5 rounded-pill text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>
                      {selectedNotification.type || 'EMAIL NOTIFICATION'}
                    </span>
                    <small className="text-slate-400 d-flex align-items-center gap-1">
                      <BiTime />
                      {selectedNotification.createdAt ? new Date(selectedNotification.createdAt).toLocaleString() : ''}
                    </small>
                  </div>

                  <h4 className="fw-bold text-slate-900 mb-3">{selectedNotification.title}</h4>

                  <div className="bg-slate-50 p-3 rounded-3 border small">
                    <div className="d-flex mb-1">
                      <strong className="text-slate-500 w-20">From:</strong>
                      <span className="text-slate-800 fw-medium">Online Job Portal &lt;karthikeyan15786@gmail.com&gt;</span>
                    </div>
                    <div className="d-flex mb-1">
                      <strong className="text-slate-500 w-20">Status:</strong>
                      <span className="text-success fw-bold d-flex align-items-center gap-1">
                        <BiCheckCircle /> Formatted Mail Delivered to Portal Inbox
                      </span>
                    </div>
                  </div>
                </div>

                {/* Styled Email Body Frame */}
                <div className="bg-slate-50 border rounded-3 p-4 flex-grow-1 shadow-inner">
                  <div className="bg-white p-4 rounded-3 border shadow-sm">
                    <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom text-primary fw-bold">
                      <BiBriefcase className="fs-4" />
                      <span>CareerHub Application Notification</span>
                    </div>

                    <div className="text-slate-800 style={{ lineHeight: '1.7' }}" style={{ whiteSpace: 'pre-line' }}>
                      {selectedNotification.message}
                    </div>

                    <div className="mt-4 pt-3 border-top text-slate-400 small">
                      <p className="mb-0">This notification email was generated automatically by the Online Job Portal system.</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-slate-400">
                <BiEnvelope className="fs-1 mb-2 opacity-40" />
                <p>Select an email from the left sidebar to view details.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default EmailDrawer;
