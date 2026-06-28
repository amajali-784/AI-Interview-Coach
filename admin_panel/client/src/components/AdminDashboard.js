import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './AdminPanel.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleDelete = (userId) => {
    axios
      .delete(`http://localhost:5000/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      })
      .then((response) => {
        setUsers(users.filter((user) => user._id !== userId));
        alert('User deleted');
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  const handleEditPassword = (userId) => {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
      axios
        .put(
          `http://localhost:5000/api/admin/user/password/${userId}`,
          { password: newPassword },
          { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
        )
        .then((response) => {
          alert('Password updated');
        })
        .catch((error) => console.error('Error updating password:', error));
    }
  };

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-content">
        <h2>User Management</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                  <button onClick={() => handleEditPassword(user._id)}>Edit Password</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
