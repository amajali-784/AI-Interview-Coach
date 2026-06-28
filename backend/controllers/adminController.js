const express = require('express');

// Admin Login Handler
exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  // Static username and password for admin
  const adminUsername = 'admin';
  const adminPassword = 'adminpassword';

  // Check if the provided credentials match the static ones
  if (username === adminUsername && password === adminPassword) {
    // Successful login response
    return res.status(200).json({ message: 'Login successful' });
  } else {
    // Invalid credentials response
    return res.status(400).json({ message: 'Invalid credentials' });
  }
};
