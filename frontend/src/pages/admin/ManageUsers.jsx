import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { BiShield, BiLockAlt, BiCheckCircle } from 'react-icons/bi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers({ page: 0, size: 50 });
      setUsers(res.data?.content || []);
    } catch (err) {
      setError(err?.toString() || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await adminService.toggleUserBlock(id);
      fetchUsers();
    } catch (err) {
      alert(err?.toString());
    }
  };

  if (loading) return <LoadingSpinner message="Loading user registry..." />;

  return (
    <div className="manage-users-page bg-light py-5 min-vh-100">
      <div className="container py-3">
        <h3 className="fw-extrabold text-dark mb-4">Manage System Users ({users.length})</h3>

        {error && <ErrorMessage message={error} />}

        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light extra-small text-uppercase">
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="fw-bold">#{u.id}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary">
                        {u.role?.name?.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td>
                      {u.blocked ? (
                        <span className="badge bg-danger-subtle text-danger">Blocked</span>
                      ) : (
                        <span className="badge bg-success-subtle text-success">Active</span>
                      )}
                    </td>
                    <td className="small text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="text-end">
                      <button
                        className={`btn btn-sm rounded-pill px-3 ${u.blocked ? 'btn-success' : 'btn-outline-danger'}`}
                        onClick={() => handleToggleBlock(u.id)}
                      >
                        {u.blocked ? 'Unblock User' : 'Block Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
