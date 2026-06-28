const multer = require('multer');
const path = require('path');

// Setup storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');  // Specify upload destination
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);  // Create a unique filename
  }
});

// File filter to ensure only certain file types can be uploaded
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Example
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
