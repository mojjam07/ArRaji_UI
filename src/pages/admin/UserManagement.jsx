import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge, Modal, Alert } from '../../components';
import { adminAPI } from '../../api';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== 'all') params.role = roleFilter;
      const response = await adminAPI.getUsers(params);
      if (response.success && response.data) {
        setUsers(response.data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please check your connection and try again.');
      setUsers([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      const response = await adminAPI.activateUser(userId);
      if (response.success) {
        setSuccess('User activated successfully!');
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to activate user:', err);
      setError('Failed to activate user. Please try again.');
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      const response = await adminAPI.deactivateUser(userId);
      if (response.success) {
        setSuccess('User deactivated successfully!');
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to deactivate user:', err);
      setError('Failed to deactivate user. Please try again.');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    // Show a modal or navigate to add user page
    setSuccess('Add User functionality - Modal would open here');
    setTimeout(() => setSuccess(null), 3000);
  };

  const getRoleBadge = (role) => {
    const variants = { admin: 'error', officer: 'primary', user: 'secondary' };
    const labels = { admin: 'Administrator', officer: 'Officer', user: 'User' };
    return <Badge variant={variants[role] || 'default'}>{labels[role] || role}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = { active: 'success', inactive: 'neutral', pending: 'warning' };
    return <Badge variant={variants[status] || 'default'}>{status?.charAt(0).toUpperCase() + status?.slice(1) || status}</Badge>;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'Total Users', value: users.length },
    { label: 'Active Users', value: users.filter(u => u.status === 'active').length },
    { label: 'Officers', value: users.filter(u => u.role === 'officer').length },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
          <p className="text-neutral-500 mt-1">Manage users, roles, and permissions</p>
        </div>
        <Card>
          <Card.Body className="text-center py-12">
            <svg className="h-8 w-8 text-neutral-300 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-neutral-500 mt-4">Loading users...</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="error" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert variant="success" title="Success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
          <p className="text-neutral-500 mt-1">Manage users, roles, and permissions</p>
        </div>
        <Button variant="primary" onClick={handleAddUser}>
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <Card.Body className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-500">{stat.label}</p>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Card>
        <Card.Body className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'admin', label: 'Administrator' },
              { value: 'officer', label: 'Officer' },
              { value: 'user', label: 'User' },
            ]}
            className="w-full sm:w-48"
          />
        </Card.Body>
      </Card>

      <Card>
        <Card.Header title="All Users" subtitle={`${filteredUsers.length} users found`} />
        <Card.Body className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary-700">{user.name?.split(' ').map(n => n?.[0]).join('') || '?'}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">{user.name}</div>
                          <div className="text-sm text-neutral-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{user.applications}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{user.lastActive}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleViewUser(user)} className="text-primary-600 hover:text-primary-900 mr-3">View</button>
                      {user.status === 'active' ? (
                        <button onClick={() => handleDeactivateUser(user.id)} className="text-accent-600 hover:text-accent-900">Deactivate</button>
                      ) : (
                        <button onClick={() => handleActivateUser(user.id)} className="text-secondary-600 hover:text-secondary-900">Activate</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
        <Card.Footer className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">Showing {filteredUsers.length} of {users.length} users</p>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* User Details Modal */}
      <Modal isOpen={showUserModal} onClose={handleCloseModal} title="User Details" size="md">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-medium text-primary-700">{selectedUser.name?.split(' ').map(n => n?.[0]).join('') || '?'}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{selectedUser.name}</h3>
                <p className="text-neutral-500">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
              <div>
                <p className="text-sm text-neutral-500">Joined Date</p>
                <p className="font-medium text-neutral-900">{selectedUser.joinedDate}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Last Active</p>
                <p className="font-medium text-neutral-900">{selectedUser.lastActive}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Applications</p>
                <p className="font-medium text-neutral-900">{selectedUser.applications}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">User ID</p>
                <p className="font-medium text-neutral-900">#{selectedUser.id}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
