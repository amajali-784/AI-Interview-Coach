const express = require('express');
const { adminLogin } = require('../controllers/adminController');  // Ensure this import is correct

const router = express.Router();

// Admin login route
router.post('/login', adminLogin);  // Ensure `adminLogin` is properly defined

module.exports = router;
