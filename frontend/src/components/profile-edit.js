import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfileEdita.css';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    skills: '',
    experience: '',
    qualification: '',
    specialization: '',
    passoutYear: '',
  });

  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

  // Fetch current user profile data
  useEffect(() => {
    if (!userId) {
      navigate('/login'); // If no user is logged in, redirect to login page
    } else {
      axios
        .get(`http://localhost:5000/api/users/profile/${userId}`)
        .then((response) => {
          setUserData({
            ...response.data.profile,
            name: response.data.name,  // Assuming profile data is nested in the response
            email: response.data.email, // Assuming email and name are in the user data itself
            phone: response.data.phone,
            confirmPassword: response.data.password, // Set confirmPassword to be the same initially
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [userId, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Submit the form for profile update
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (userData.password !== userData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    // Ensure skills is a string or an array
    const skills = Array.isArray(userData.skills)
      ? userData.skills.join(', ') // If it's an array, join it into a string
      : userData.skills; // If it's already a string, use it as is
  
    axios
      .put('http://localhost:5000/api/users/update-profile', {
        userId,
        profileData: {
          location: userData.location,
          skills: skills, // Send skills as a string
          experience: userData.experience,
          qualification: userData.qualification,
          specialization: userData.specialization,
          passoutYear: userData.passoutYear,
          email: userData.email,
          phone: userData.phone,
          name: userData.name,
          password: userData.password, // Only include if password is updated
        },
      })
      .then((response) => {
        alert(response.data.message);
        navigate('/dashboard'); // Redirect after successful update
      })
      .catch((error) => {
        console.error(error);
        alert('Error updating profile');
      });
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-edit-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Skills</label>
          <input
            type="text"
            name="skills"
            value={userData.skills}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Experience</label>
          <input
            type="text"
            name="experience"
            value={userData.experience}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Qualification</label>
          <input
            type="text"
            name="qualification"
            value={userData.qualification}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            name="specialization"
            value={userData.specialization}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Passout Year</label>
          <input
            type="number"
            name="passoutYear"
            value={userData.passoutYear}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
