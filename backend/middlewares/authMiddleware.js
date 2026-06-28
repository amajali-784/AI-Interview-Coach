// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assuming you have a User model

const protect = async (req, res, next) => {
  let token;

  // Check if there is a Bearer token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];  // Extract token from "Bearer <token>"
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token using the JWT_SECRET
    req.user = await User.findById(decoded.id);  // Attach the user object to the request
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
}
module.exports = {protect, authenticate};
