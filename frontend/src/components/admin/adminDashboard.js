import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './adminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Tracks the user being edited
  const [newPassword, setNewPassword] = useState(''); // For password updates
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/adminlog'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/user'); // Fetch all users
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user); // Set user for editing
    setNewPassword(''); // Reset password field
  };

  const handleCancelEdit = () => {
    setEditingUser(null); // Cancel edit mode
    setNewPassword(''); // Reset password
  };

  const handleSaveEdit = async () => {
    try {
      // Update user details
      const updatedUser = {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
      };
      await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, updatedUser);

      // Update password if provided
      if (newPassword) {
        await axios.put(`http://localhost:5000/api/users/modify-password/${editingUser._id}`, { newPassword });
      }

      // Update user list locally
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === editingUser._id ? { ...user, ...updatedUser } : user))
      );
      setEditingUser(null);
      setNewPassword('');
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <header className="adm-header">
        <div className="adm-header-content">
          <img src="./logo.png" alt="Logo" className="adm-logo" />
          <h1>AI-Powered Job Interview Coach Admin Panel</h1>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="dashboard-content">
        <aside className="sidebar">
          <ul>
            <li><a href="/adminDashboard">Dashboard</a></li>
            <li><a href="/admin-courses">Courses</a></li>
            <li><a href="/admin-jobs">Jobs</a></li>
            <li><a href="/control_panel">Customer Care</a></li>
            <li><a href="/admin-feedback">Feedback</a></li>
          </ul>
        </aside>
        <main className="dashboard-main">
          <h2>User Management</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {editingUser && editingUser._id === user._id ? (
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser._id === user._id ? (
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser._id === user._id ? (
                      <input
                        type="text"
                        value={editingUser.phone}
                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                      />
                    ) : (
                      user.phone
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser._id === user._id ? (
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    ) : (
                      '******'
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser._id === user._id ? (
                      <>
                        <button onClick={handleSaveEdit} className="save-btn">Save</button>
                        <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(user)} className="modify-btn">Modify</button>
                        <button onClick={() => handleDelete(user._id)} className="delete-btn">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>

      {/* Footer */}
      <footer className="adm-footer">
        <p>24/7 Service | Built with ❤️ by GEC Karwar</p>
        <p>© 2024 AI Job Coach. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
