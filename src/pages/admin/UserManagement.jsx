import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge, Modal } from '../../components';

/**
 * User Management Page (Admin View)
 * Table view of all users with management actions
 */
export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const users = [
    {
      id: 1,
      name: 'Ahmed Al-Rashid',
      email: 'ahmed@example.com',
      role: 'user',
      status: 'active',
      applications: 3,
      lastActive: '2024-01-18',
      joinedDate: '2023-06-15',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'user',
      status: 'active',
      applications: 5,
      lastActive: '2024-01-17',
      joinedDate: '2023-03-22',
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      email: 'mohammed@example.com',
      role: 'officer',
      status: 'active',
      applications: 0,
      lastActive: '2024-01-18',
      joinedDate: '2023-01-10',
    },
    {
      id: 4,
      name: 'Fatima Hassan',
      email: 'fatima@example.com',
      role: 'user',
      status: 'inactive',
      applications: 2,
      lastActive: '2024-01-10',
      joinedDate: '2023-08-05',
    },
    {
      id: 5,
      name: 'John Smith',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      applications: 0,
      lastActive: '2024-01-18',
      joinedDate: '2022-12-01',
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'user',
      status: 'pending',
      applications: 1,
      lastActive: '2024-01-16',
      joinedDate: '2024-01-02',
    },
  ];

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'error',
      officer: 'primary',
      user: 'secondary',
    };
    const labels = {
      admin: 'Administrator',
      officer: 'Officer',
      user: 'User',
    };
    return <Badge variant={variants[role]}>{labels[role]}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      inactive: 'neutral',
      pending: 'warning',
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'Total Users', value: users.length },
    { label: 'Active Users', value: users.filter((u) => u.status === 'active').length },
    { label: 'Officers', value: users.filter((u) => u.role === 'officer').length },
    { label: 'Admins', value: users.filter((u) => u.role === 'admin').length },
  ];

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
          <p className="text-neutral-500 mt-1">Manage users, roles, and permissions</p>
        </div>
        <Button variant="primary">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </Button>
      </div>

      {/* Stats */}
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

      {/* Filters */}
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

      {/* Users Table */}
      <Card>
        <Card.Header title="All Users" subtitle={`${filteredUsers.length} users found`} />
        <Card.Body className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary-700">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">{user.name}</div>
                          <div className="text-sm text-neutral-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {user.applications}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-neutral-600 hover:text-neutral-900"
                        >
                          Edit
                        </button>
                        {user.status === 'active' ? (
                          <button className="text-accent-600 hover:text-accent-900">
                            Deactivate
                          </button>
                        ) : (
                          <button className="text-secondary-600 hover:text-secondary-900">
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
        <Card.Footer className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled>
              Previous
            </Button>
            <Button variant="secondary" size="sm">
              Next
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* User Detail Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-medium text-primary-700">
                  {selectedUser.name.split(' ').map((n) => n[0]).join('')}
                </span>
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
            <div className="flex gap-2 pt-4 border-t border-neutral-200">
              <Button variant="secondary" className="flex-1">
                Edit User
              </Button>
              <Button variant="secondary" className="flex-1">
                Reset Password
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

