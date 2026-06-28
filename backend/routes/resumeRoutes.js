const express = require('express');
const { uploadResume, saveInterviewData } = require('../controllers/resumeController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validateFile } = require('../middlewares/fileValidation');
const { upload } = require('../utils/storage');

const router = express.Router();
router.post('/upload', authenticate, upload.single('resume'), validateFile, uploadResume);
router.post('/save', authenticate, saveInterviewData);

module.exports = router;
