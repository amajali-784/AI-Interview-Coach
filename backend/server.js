const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');  // Add this line to import 'path'
const multer = require("multer");
const app = express();
const mongoose = require('mongoose');
const aiFeedbackRoutes = require("./routes/AIfeedbackRoutes");
app.use("/api/feedback", aiFeedbackRoutes);
// Enable CORS for all routes
app.use(cors());
const forgotPasswordRoute = require('./routes/forgotPassword');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', forgotPasswordRoute);
dotenv.config();
connectDB();

// Alternatively, restrict CORS to specific origins:
app.use(cors({
  origin: 'http://localhost:3000',  // React frontend URL
}));

app.use(express.json());  // for parsing application/json
app.use(express.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/as', interviewRoutes);
// Define routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');

app.use('/api/users', userRoutes);  // Your route for signing up
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Handle preflight requests (optional but often needed for APIs with custom headers)
app.options('*', cors());
const fs = require("fs");


const uploadsDir = path.join(__dirname, "uploads");

// Ensure 'uploads' directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes);

const feedbackRoutes = require("./routes/feedbackRoutes");

app.use("/api/feedback", feedbackRoutes);

const resumeRoutes = require('./routes/resumeRoutes');

app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const pdfParse = require('pdf-parse');

const mammoth = require('mammoth');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const interView = require("./routes/interView");
app.use("/api/interview", interView);

const upload = multer({ storage: storage });

// Route to handle resume upload and analysis
app.post('/api/ai-resume-analyzer', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const filePath = req.file.path;
  const fileExt = path.extname(filePath).toLowerCase();

  if (fileExt === '.pdf') {
    // Parse PDF file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error reading file.' });
      }

      pdfParse(data).then((parsedData) => {
        const resumeText = parsedData.text;
        const parsedResume = parseResumeText(resumeText); // Parse resume text
        // Send parsed data to frontend for confirmation
        return res.json({ success: true, parsedData: parsedResume });
      }).catch((parseError) => {
        return res.status(500).json({ success: false, message: 'Error parsing PDF.' });
      });
    });
  } else if (fileExt === '.docx') {
    // Parse DOCX file
    const docxFile = fs.readFileSync(filePath);
    mammoth.extractRawText({ buffer: docxFile })
      .then((result) => {
        const resumeText = result.value;
        const parsedResume = parseResumeText(resumeText); // Parse resume text
        // Send parsed data to frontend for confirmation
        return res.json({ success: true, parsedData: parsedResume });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: 'Error parsing DOCX.' });
      });
  } else {
    return res.status(400).json({ success: false, message: 'Unsupported file type. Please upload a PDF or DOCX file.' });
  }
});
const parseResumeText = (resumeText) => {
  const parsedData = {
    name: '',
    email: '',
    phone: '',
    linkedIn: '',
    objective: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    languages: []
  };

  // Regex patterns to extract information
  const nameRegex = /Name:\s*(.*)/i;
  const emailRegex = /Email:\s*(.*)/i;
  const phoneRegex = /Phone:\s*(.*)/i;
  const linkedInRegex = /LinkedIn:\s*(.*)/i;
  const objectiveRegex = /Objective:\s*(.*?)(Skills|Experience|Education|Certifications|$)/is;
  const skillsRegex = /Skills:\s*([\s\S]*?)(Experience|Education|Certifications|$)/is;
  const experienceRegex = /Experience:([\s\S]*?)(Education|Certifications|$)/is;
  const educationRegex = /Education:([\s\S]*?)(Certifications|Projects|$)/is;
  const certificationsRegex = /Certifications:([\s\S]*?)(Projects|$)/is;
  const projectsRegex = /Projects:([\s\S]*?)(Languages|$)/is;
  const languagesRegex = /Languages:\s*([\s\S]*?)(Job Preferences|$)/is;

  // Extracting matched data from the resume text
  const nameMatch = resumeText.match(nameRegex);
  const emailMatch = resumeText.match(emailRegex);
  const phoneMatch = resumeText.match(phoneRegex);
  const linkedInMatch = resumeText.match(linkedInRegex);
  const objectiveMatch = resumeText.match(objectiveRegex);
  const skillsMatch = resumeText.match(skillsRegex);
  const experienceMatch = resumeText.match(experienceRegex);
  const educationMatch = resumeText.match(educationRegex);
  const certificationsMatch = resumeText.match(certificationsRegex);
  const projectsMatch = resumeText.match(projectsRegex);
  const languagesMatch = resumeText.match(languagesRegex);

  // Assigning parsed data to respective categories
  if (nameMatch) parsedData.name = nameMatch[1].trim();
  if (emailMatch) parsedData.email = emailMatch[1].trim();
  if (phoneMatch) parsedData.phone = phoneMatch[1].trim();
  if (linkedInMatch) parsedData.linkedIn = linkedInMatch[1].trim();
  if (objectiveMatch) parsedData.objective = objectiveMatch[1].trim();
  if (skillsMatch) parsedData.skills = skillsMatch[1].split(',').map(skill => skill.trim());
  if (experienceMatch) parsedData.experience = experienceMatch[1].split('\n').map(experience => experience.trim());
  if (educationMatch) parsedData.education = educationMatch[1].split('\n').map(education => education.trim());
  if (certificationsMatch) parsedData.certifications = certificationsMatch[1].split('\n').map(certification => certification.trim());
  if (projectsMatch) parsedData.projects = projectsMatch[1].split('\n').map(project => project.trim());
  if (languagesMatch) parsedData.languages = languagesMatch[1].split(',').map(language => language.trim());

  return parsedData;
};
